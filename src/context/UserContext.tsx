import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export interface UserData {
  name: string;
  username: string;
  contact: string;
  contactType: "phone" | "email";
  password: string;
  profilePhoto?: string;
  dietaryRestrictions: string[];
  foodPreferences: string[];
  savedRestaurants: string[];
  completedOnboarding: boolean;
}

interface UserContextType {
  userData: UserData;
  isLoading: boolean;
  updateUserData: (data: Partial<UserData>) => void;
  saveRestaurant: (id: string) => void;
  unsaveRestaurant: (id: string) => void;
  rateRestaurant: (id: string, rating: number, review?: string) => Promise<void>;
  isSaved: (id: string) => boolean;
  clearAllData: () => Promise<void>;
}

const defaultUserData: UserData = {
  name: "",
  username: "",
  contact: "",
  contactType: "email",
  password: "",
  profilePhoto: undefined,
  dietaryRestrictions: [],
  foodPreferences: [],
  savedRestaurants: [],
  completedOnboarding: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem("scillet-user-data");
        const password = await SecureStore.getItemAsync("scillet-password");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserData({ ...parsed, password: password ?? "" });
        }
      } catch (e) {
        // Storage read failed, use defaults
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Persist to storage whenever userData changes
  useEffect(() => {
    if (isLoading) return;
    const persist = async () => {
      try {
        const { password, ...rest } = userData;
        await AsyncStorage.setItem("scillet-user-data", JSON.stringify(rest));
        if (password) {
          await SecureStore.setItemAsync("scillet-password", password);
        }
      } catch (e) {
        // Ignore storage errors
      }
    };
    persist();
  }, [userData, isLoading]);

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

  const rateRestaurant = async (id: string, rating: number, review?: string) => {
    try {
      const stored = await AsyncStorage.getItem("scillet-ratings");
      const ratings = stored ? JSON.parse(stored) : {};
      ratings[id] = { rating, review, date: new Date().toISOString() };
      await AsyncStorage.setItem("scillet-ratings", JSON.stringify(ratings));
    } catch (e) {
      // Ignore storage errors
    }
  };

  const isSaved = (id: string) => userData.savedRestaurants.includes(id);

  const clearAllData = async () => {
    try {
      await AsyncStorage.removeItem("scillet-user-data");
      await AsyncStorage.removeItem("scillet-ratings");
      await SecureStore.deleteItemAsync("scillet-password");
    } catch (e) {
      // Ignore errors
    }
    setUserData(defaultUserData);
  };

  return (
    <UserContext.Provider
      value={{ userData, isLoading, updateUserData, saveRestaurant, unsaveRestaurant, rateRestaurant, isSaved, clearAllData }}
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
