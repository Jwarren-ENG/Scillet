import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { supabase } from "../lib/supabase";
import { getRestaurantById } from "../data/restaurants";

WebBrowser.maybeCompleteAuthSession();

// ---------- Types ----------

export interface UserData {
  name: string;
  username: string;
  contact: string;
  contactType: "phone" | "email";
  password?: string; // Backward compat only — auth is handled by Supabase
  profilePhoto?: string;
  dietaryRestrictions: string[];
  foodPreferences: string[];
  savedRestaurants: string[];
  completedOnboarding: boolean;
}

interface UserContextType {
  session: Session | null;
  userData: UserData;
  isLoading: boolean;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  saveRestaurant: (id: string) => Promise<void>;
  unsaveRestaurant: (id: string) => Promise<void>;
  rateRestaurant: (id: string, rating: number, review?: string) => Promise<void>;
  getRating: (id: string) => Promise<{ rating: number; review?: string } | null>;
  isSaved: (id: string) => boolean;
  clearAllData: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithApple: () => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithPhone: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any }>;
}

// ---------- Defaults ----------

const defaultUserData: Omit<UserData, "savedRestaurants"> = {
  name: "",
  username: "",
  contact: "",
  contactType: "email",
  password: undefined,
  profilePhoto: undefined,
  dietaryRestrictions: [],
  foodPreferences: [],
  completedOnboarding: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// ---------- Provider ----------

export function UserProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [savedRestaurants, setSavedRestaurants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Optimistic local state — updated immediately on updateUserData, synced to Supabase in background
  const [localData, setLocalData] = useState(defaultUserData);

  // ---------- Session init ----------

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadProfile(session.user.id, session.user.email, session.user.phone);
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await loadProfile(session.user.id, session.user.email, session.user.phone);
      } else {
        setLocalData(defaultUserData);
        setSavedRestaurants([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (
    userId: string,
    email?: string | null,
    phone?: string | null
  ) => {
    try {
      const [profileRes, savesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("saves").select("restaurant_id").eq("user_id", userId),
      ]);

      if (profileRes.data) {
        const p = profileRes.data;
        setLocalData({
          name: p.full_name ?? "",
          username: p.username ?? "",
          contact: email ?? phone ?? "",
          contactType: email ? "email" : "phone",
          profilePhoto: p.avatar_url ?? undefined,
          dietaryRestrictions: p.dietary_restrictions ?? [],
          foodPreferences: p.food_preferences ?? [],
          completedOnboarding: p.onboarding_completed ?? false,
        });
      } else {
        // Profile row not yet created (trigger may be slow)
        setLocalData((prev) => ({
          ...prev,
          contact: email ?? phone ?? "",
          contactType: email ? "email" : "phone",
        }));
      }

      if (savesRes.data) {
        setSavedRestaurants(savesRes.data.map((s: any) => s.restaurant_id));
      }
    } catch {
      // Ignore — use defaults
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Derived userData ----------

  const userData: UserData = { ...localData, savedRestaurants };

  // ---------- updateUserData ----------

  const updateUserData = async (data: Partial<UserData>) => {
    // Optimistic local update
    setLocalData((prev) => {
      const next = { ...prev };
      if ("name" in data) next.name = data.name!;
      if ("username" in data) next.username = data.username!;
      if ("contact" in data) next.contact = data.contact!;
      if ("contactType" in data) next.contactType = data.contactType!;
      if ("profilePhoto" in data) next.profilePhoto = data.profilePhoto;
      if ("dietaryRestrictions" in data) next.dietaryRestrictions = data.dietaryRestrictions!;
      if ("foodPreferences" in data) next.foodPreferences = data.foodPreferences!;
      if ("completedOnboarding" in data) next.completedOnboarding = data.completedOnboarding!;
      return next;
    });

    // Sync to Supabase profile
    if (!session) return;
    const profileUpdate: Record<string, any> = {};
    if ("name" in data) profileUpdate.full_name = data.name;
    if ("username" in data) profileUpdate.username = data.username;
    if ("profilePhoto" in data) profileUpdate.avatar_url = data.profilePhoto;
    if ("dietaryRestrictions" in data) profileUpdate.dietary_restrictions = data.dietaryRestrictions;
    if ("foodPreferences" in data) profileUpdate.food_preferences = data.foodPreferences;
    if ("completedOnboarding" in data && data.completedOnboarding) {
      profileUpdate.onboarding_completed = true;
    }
    if (Object.keys(profileUpdate).length > 0) {
      await supabase.from("profiles").update(profileUpdate).eq("id", session.user.id);
    }
  };

  // ---------- Restaurant helpers ----------

  // Ensures a restaurant exists in the DB before writing a save/rating
  const ensureRestaurantInDb = async (id: string) => {
    const restaurant = getRestaurantById(id);
    if (!restaurant) return;
    await supabase.from("restaurants").upsert(
      {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        city: restaurant.city,
        lat: restaurant.lat,
        lng: restaurant.lng,
        rating: restaurant.rating,
        cuisine: restaurant.cuisine,
        category: restaurant.category,
        tags: restaurant.tags,
        thumbnail_url: restaurant.thumbnailUrl,
        hours: restaurant.hours,
        ordering_services: restaurant.orderingServices ?? null,
      },
      { onConflict: "id" }
    );
  };

  // ---------- Saves ----------

  const saveRestaurant = async (id: string) => {
    if (!session) return;
    setSavedRestaurants((prev) => (prev.includes(id) ? prev : [...prev, id]));
    await ensureRestaurantInDb(id);
    await supabase.from("saves").insert({ user_id: session.user.id, restaurant_id: id });
  };

  const unsaveRestaurant = async (id: string) => {
    if (!session) return;
    setSavedRestaurants((prev) => prev.filter((r) => r !== id));
    await supabase
      .from("saves")
      .delete()
      .match({ user_id: session.user.id, restaurant_id: id });
  };

  const isSaved = (id: string) => savedRestaurants.includes(id);

  // ---------- Ratings ----------

  const rateRestaurant = async (id: string, rating: number, review?: string) => {
    if (!session) return;
    await ensureRestaurantInDb(id);
    await supabase.from("ratings").upsert(
      { user_id: session.user.id, restaurant_id: id, rating, review },
      { onConflict: "user_id,restaurant_id" }
    );
  };

  const getRating = async (id: string) => {
    if (!session) return null;
    const { data } = await supabase
      .from("ratings")
      .select("rating, review")
      .match({ user_id: session.user.id, restaurant_id: id })
      .single();
    return data ? { rating: data.rating, review: data.review } : null;
  };

  // ---------- Auth methods ----------

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) return { error: new Error("No identity token") };
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });
      return { error };
    } catch (e: any) {
      if (e.code === "ERR_REQUEST_CANCELED") return { error: null }; // User cancelled
      return { error: e };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = makeRedirectUri({ scheme: "com.scillet.app" });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
      });
      if (error || !data.url) return { error: error ?? new Error("No OAuth URL") };

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      if (result.type === "success") {
        const hash = result.url.split("#")[1] ?? result.url.split("?")[1] ?? "";
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        if (accessToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken ?? "",
          });
          return { error: sessionError };
        }
      }
      return { error: null };
    } catch (e: any) {
      return { error: e };
    }
  };

  const signInWithPhone = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    return { error };
  };

  const verifyOtp = async (phone: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
    return { error };
  };

  const clearAllData = signOut;

  // ---------- Context value ----------

  return (
    <UserContext.Provider
      value={{
        session,
        userData,
        isLoading,
        updateUserData,
        saveRestaurant,
        unsaveRestaurant,
        rateRestaurant,
        getRating,
        isSaved,
        clearAllData,
        signUp,
        signIn,
        signOut,
        signInWithApple,
        signInWithGoogle,
        signInWithPhone,
        verifyOtp,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
