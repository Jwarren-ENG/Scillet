import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { HomeIcon, SavedIcon, ProfileIcon, MapIcon } from "../components/Icons";
import { ChevronRight, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useCallback } from "react";

export function Profile() {
  const { userData, updateUserData } = useUser();
  const navigate = useNavigate();

  const ratingsCount = useMemo(() => {
    return Object.keys(JSON.parse(localStorage.getItem("scillet-ratings") || "{}")).length;
  }, []);

  const handleLogout = useCallback(() => {
    updateUserData({
      name: "",
      username: "",
      contact: "",
      password: "",
      dietaryRestrictions: [],
      foodPreferences: [],
      savedRestaurants: [],
      completedOnboarding: false,
    });
    localStorage.removeItem("scillet-user-data");
    localStorage.removeItem("scillet-ratings");
    navigate("/");
  }, [updateUserData, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-primary-foreground">
              {userData.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl mb-1">{userData.name}</h2>
          <p className="text-muted-foreground">@{userData.username || 'username'}</p>
          <p className="text-sm text-muted-foreground mt-1">{userData.contact}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-card p-6 rounded-2xl text-center border"
          >
            <div className="text-3xl font-bold text-primary mb-1">
              {userData.savedRestaurants.length}
            </div>
            <div className="text-sm text-muted-foreground">Saved Places</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-card p-6 rounded-2xl text-center border"
          >
            <div className="text-3xl font-bold text-accent mb-1">
              {ratingsCount}
            </div>
            <div className="text-sm text-muted-foreground">Ratings</div>
          </motion.div>
        </div>
      </div>

      {/* Settings */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-lg mb-4">Preferences</h3>

          <button
            onClick={() => navigate("/onboarding/dietary")}
            className="w-full bg-card p-4 rounded-2xl flex items-center justify-between hover:bg-accent/10 transition-colors"
          >
            <div className="text-left">
              <div className="font-medium mb-1">Dietary Restrictions</div>
              <div className="text-sm text-muted-foreground">
                {userData.dietaryRestrictions.length > 0
                  ? userData.dietaryRestrictions.join(", ")
                  : "None selected"}
              </div>
            </div>
            <ChevronRight className="text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate("/onboarding/preferences")}
            className="w-full bg-card p-4 rounded-2xl flex items-center justify-between hover:bg-accent/10 transition-colors"
          >
            <div className="text-left">
              <div className="font-medium mb-1">Food Preferences</div>
              <div className="text-sm text-muted-foreground">
                {userData.foodPreferences.length > 0
                  ? userData.foodPreferences.join(", ")
                  : "None selected"}
              </div>
            </div>
            <ChevronRight className="text-muted-foreground" />
          </button>

          <div className="pt-6">
            <h3 className="text-lg mb-4">Account</h3>

            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-3" size={20} />
              Log Out
            </Button>
          </div>

          <div className="pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Scillet v1.0.0
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Discover food that's cooking nearby
            </p>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-around items-center px-6 py-4 bg-card border-t">
        <button
          onClick={() => navigate("/swipe")}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <HomeIcon size={24} />
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => navigate("/map")}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <MapIcon size={24} />
          <span className="text-xs">Map</span>
        </button>
        <button
          onClick={() => navigate("/saved")}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <SavedIcon size={24} />
          <span className="text-xs">Saved</span>
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center gap-1 text-primary"
        >
          <ProfileIcon size={24} />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}