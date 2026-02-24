import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserData {
  name: string;
  username: string;
  contact: string;
  contactType: "phone" | "email";
  password: string;
  dietaryRestrictions: string[];
  foodPreferences: string[];
  savedRestaurants: string[];
  completedOnboarding: boolean;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  saveRestaurant: (id: string) => void;
  unsaveRestaurant: (id: string) => void;
  rateRestaurant: (id: string, rating: number, review?: string) => void;
  isSaved: (id: string) => boolean;
}

const defaultUserData: UserData = {
  name: "",
  username: "",
  contact: "",
  contactType: "email",
  password: "",
  dietaryRestrictions: [],
  foodPreferences: [],
  savedRestaurants: [],
  completedOnboarding: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(() => {
    const stored = localStorage.getItem("scillet-user-data");
    return stored ? JSON.parse(stored) : defaultUserData;
  });

  useEffect(() => {
    localStorage.setItem("scillet-user-data", JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const saveRestaurant = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      savedRestaurants: [...prev.savedRestaurants, id],
    }));
  };

  const unsaveRestaurant = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      savedRestaurants: prev.savedRestaurants.filter((r) => r !== id),
    }));
  };

  const rateRestaurant = (id: string, rating: number, review?: string) => {
    // Store ratings in localStorage separately
    const ratings = JSON.parse(localStorage.getItem("scillet-ratings") || "{}");
    ratings[id] = { rating, review, date: new Date().toISOString() };
    localStorage.setItem("scillet-ratings", JSON.stringify(ratings));
  };

  const isSaved = (id: string) => {
    return userData.savedRestaurants.includes(id);
  };

  return (
    <UserContext.Provider
      value={{ userData, updateUserData, saveRestaurant, unsaveRestaurant, rateRestaurant, isSaved }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}