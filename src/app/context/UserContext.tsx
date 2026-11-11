import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

export interface UserData {
  name: string;
  username: string;
  contact: string;
  contactType: "phone" | "email";
  dietaryRestrictions: string[];
  foodPreferences: string[];
  savedRestaurants: string[];
  completedOnboarding: boolean;
}

interface UserContextType {
  session: Session | null;
  user: User | null;
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  saveRestaurant: (id: string) => void;
  unsaveRestaurant: (id: string) => void;
  rateRestaurant: (id: string, rating: number, review?: string) => void;
  isSaved: (id: string) => boolean;
  signOut: () => Promise<void>;
  loading: boolean;
}

const defaultUserData: UserData = {
  name: "",
  username: "",
  contact: "",
  contactType: "email",
  dietaryRestrictions: [],
  foodPreferences: [],
  savedRestaurants: [],
  completedOnboarding: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>(() => {
    const stored = localStorage.getItem("scillet-user-data");
    return stored ? JSON.parse(stored) : defaultUserData;
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("scillet-user-data", JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const saveRestaurant = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      savedRestaurants: prev.savedRestaurants.includes(id)
        ? prev.savedRestaurants
        : [...prev.savedRestaurants, id],
    }));
  };

  const unsaveRestaurant = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      savedRestaurants: prev.savedRestaurants.filter((r) => r !== id),
    }));
  };

  const rateRestaurant = (id: string, rating: number, review?: string) => {
    const ratings = JSON.parse(localStorage.getItem("scillet-ratings") || "{}");
    ratings[id] = { rating, review, date: new Date().toISOString() };
    localStorage.setItem("scillet-ratings", JSON.stringify(ratings));
  };

  const isSaved = (id: string) => userData.savedRestaurants.includes(id);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserData(defaultUserData);
    localStorage.removeItem("scillet-user-data");
    localStorage.removeItem("scillet-ratings");
  };

  return (
    <UserContext.Provider value={{
      session,
      user: session?.user ?? null,
      userData,
      updateUserData,
      saveRestaurant,
      unsaveRestaurant,
      rateRestaurant,
      isSaved,
      signOut,
      loading,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
