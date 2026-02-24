import { useUser } from "../context/UserContext";
import { getRestaurantById } from "../data/restaurants";
import { useNavigate } from "react-router";
import { HomeIcon, SavedIcon, ProfileIcon, LocationIcon, StarIcon, MapIcon } from "../components/Icons";
import { motion } from "motion/react";
import { useMemo, useCallback } from "react";

export function SavedList() {
  const { userData } = useUser();
  const navigate = useNavigate();

  const savedRestaurants = useMemo(
    () => userData.savedRestaurants.map((id) => getRestaurantById(id)).filter(Boolean),
    [userData.savedRestaurants]
  );

  const handleRestaurantClick = useCallback(
    (id: string) => {
      navigate(`/restaurant/${id}`);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 bg-card border-b">
        <h1 className="text-3xl">Saved Places</h1>
        <p className="text-muted-foreground">
          {savedRestaurants.length} {savedRestaurants.length === 1 ? "place" : "places"} to try
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-4">
        {savedRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <SavedIcon size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl mb-2">No saved places yet</h3>
            <p className="text-muted-foreground mb-6">
              Start swiping to save places you want to try
            </p>
            <button
              onClick={() => navigate("/swipe")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full"
            >
              Start Swiping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
            {savedRestaurants.map((restaurant, index) => (
              <motion.div
                key={`${restaurant?.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleRestaurantClick(restaurant?.id as string)}
                className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex">
                  <img
                    src={restaurant?.thumbnailUrl}
                    alt={restaurant?.name}
                    className="w-32 h-32 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <h3 className="text-lg mb-1">{restaurant?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {restaurant?.cuisine}
                    </p>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <LocationIcon size={14} className="text-muted-foreground" />
                        <span>{restaurant?.distance} mi</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <StarIcon size={14} className="text-yellow-500" fill="currentColor" />
                        <span>{restaurant?.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
          className="flex flex-col items-center gap-1 text-primary"
        >
          <SavedIcon size={24} />
          <span className="text-xs">Saved</span>
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <ProfileIcon size={24} />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}