import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "motion/react";
import { useUser } from "../context/UserContext";
import { mockRestaurants, Restaurant } from "../data/restaurants";
import { HeartIcon, CloseIcon, LocationIcon, HomeIcon, SavedIcon, ProfileIcon, MapIcon } from "../components/Icons";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { LocationModal } from "../components/LocationModal";
import { FilterModal } from "../components/FilterModal";

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function Swipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [radius, setRadius] = useState(10);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { saveRestaurant, session, loading } = useUser();
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const nopeOpacity = useTransform(x, [-200, 0], [1, 0]);
  const loveOpacity = useTransform(x, [0, 200], [0, 1]);

  useEffect(() => {
    if (!session) {
      navigate("/");
    }
  }, [session, navigate]);

  // Filter restaurants based on selected category, city, and location
  useEffect(() => {
    let filtered = mockRestaurants;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((r) => r.category === selectedCategory);
    }

    if (selectedCity === "current" && userLocation) {
      filtered = filtered
        .map((r) => ({
          ...r,
          distance: Math.round(haversineDistance(userLocation.lat, userLocation.lng, r.lat, r.lng) * 10) / 10,
        }))
        .filter((r) => r.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
    } else if (selectedCity !== "all") {
      filtered = filtered.filter((r) => r.city === selectedCity);
    }

    setRestaurants(filtered);
    setCurrentIndex(0);
    x.set(0);
  }, [selectedCategory, selectedCity, userLocation, radius, x]);

  const currentRestaurant = useMemo(() => restaurants[currentIndex], [restaurants, currentIndex]);
  const nextRestaurant = useMemo(() => restaurants[currentIndex + 1], [restaurants, currentIndex]);

  const moveToNext = useCallback(() => {
    if (currentIndex < restaurants.length - 1) {
      setCurrentIndex(currentIndex + 1);
      x.set(0);
    } else {
      toast.success("You've seen all restaurants!");
      setCurrentIndex(0);
    }
  }, [currentIndex, restaurants.length, x]);

  const handleSave = useCallback(() => {
    if (currentRestaurant) {
      saveRestaurant(currentRestaurant.id);
      toast.success(`Saved ${currentRestaurant.name}!`);
      moveToNext();
    }
  }, [currentRestaurant, saveRestaurant, moveToNext]);

  const handleSkip = useCallback(() => {
    moveToNext();
  }, [moveToNext]);

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    const threshold = 100;

    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swiped right - save
        handleSave();
      } else {
        // Swiped left - skip
        handleSkip();
      }
    } else {
      x.set(0);
    }
  }, [handleSave, handleSkip, x]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!currentRestaurant) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* Top floating buttons */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4">
        {/* Location button - Top left */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={() => setIsLocationModalOpen(true)}
          className="w-14 h-14 rounded-full bg-black/20 backdrop-blur-2xl border border-white/20 flex items-center justify-center shadow-2xl hover:bg-black/30 transition-colors"
        >
          <LocationIcon size={24} className="text-white" />
        </motion.button>

        {/* Scillet logo button - Top right */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={() => setIsFilterModalOpen(true)}
          className="w-14 h-14 rounded-full bg-black/20 backdrop-blur-2xl border border-white/20 flex items-center justify-center shadow-2xl hover:bg-black/30 transition-colors"
        >
          <span className="text-white text-2xl font-bold">S</span>
        </motion.button>
      </div>

      {/* Main swipe area - Full screen */}
      <div className="flex-1 relative overflow-hidden">
        {/* Next card (background) */}
        {nextRestaurant && (
          <div className="absolute inset-0">
            <div className="relative w-full h-full scale-95 opacity-50">
              <img
                src={nextRestaurant.thumbnailUrl}
                alt={nextRestaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Current card - Full screen */}
        <motion.div
          className="absolute inset-0"
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          <div className="relative w-full h-full">
            {/* Restaurant video - Full screen */}
            <video
              key={currentRestaurant.id}
              src={currentRestaurant.videoUrl}
              poster={currentRestaurant.thumbnailUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* TikTok-style vertical action bar - Right side */}
            <div className="absolute right-3 bottom-32 z-20 flex flex-col gap-4">
              {/* Save/Heart button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={handleSave}
                className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-lg hover:bg-white/10 transition-colors group"
              >
                <HeartIcon size={24} filled={false} className="text-white group-hover:text-red-400 transition-colors" />
              </motion.button>

              {/* Skip/Pass button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={handleSkip}
                className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-lg hover:bg-white/10 transition-colors group"
              >
                <CloseIcon size={20} className="text-white group-hover:text-gray-400 transition-colors" />
              </motion.button>

              {/* Swipe hint text */}
              <div className="mt-2 flex flex-col items-center">
                <div className="w-8 h-1 rounded-full bg-white/20 mb-1" />
                <p className="text-[10px] text-white/40 font-medium tracking-wider rotate-0">SWIPE</p>
              </div>
            </div>

            {/* Restaurant info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 text-white z-10 pr-20">
              <div className="flex items-center gap-2 mb-2">
                <LocationIcon size={16} />
                <span className="text-sm">{currentRestaurant.distance} miles away</span>
              </div>
              <h2 className="text-3xl mb-2">{currentRestaurant.name}</h2>
              <p className="text-sm opacity-90">{currentRestaurant.cuisine}</p>
            </div>

            {/* Swipe indicators - Minimalist style */}
            <motion.div
              className="absolute top-1/3 left-8 px-5 py-2 border-3 border-red-400/80 text-red-400 text-xl font-bold rounded-xl rotate-[-15deg] bg-black/30 backdrop-blur-md"
              style={{ opacity: nopeOpacity }}
            >
              ✕
            </motion.div>
            <motion.div
              className="absolute top-1/3 right-8 px-5 py-2 border-3 border-green-400/80 text-green-400 text-xl font-bold rounded-xl rotate-[15deg] bg-black/30 backdrop-blur-md"
              style={{ opacity: loveOpacity }}
            >
              ♡
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-around items-center px-6 py-4 bg-gradient-to-t from-black/90 to-transparent backdrop-blur-sm border-t border-white/10">
        <button
          onClick={() => navigate("/swipe")}
          className="flex flex-col items-center gap-1 text-white"
        >
          <HomeIcon size={24} />
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => navigate("/map")}
          className="flex flex-col items-center gap-1 text-white/60 hover:text-white"
        >
          <MapIcon size={24} />
          <span className="text-xs">Map</span>
        </button>
        <button
          onClick={() => navigate("/saved")}
          className="flex flex-col items-center gap-1 text-white/60 hover:text-white"
        >
          <SavedIcon size={24} />
          <span className="text-xs">Saved</span>
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center gap-1 text-white/60 hover:text-white"
        >
          <ProfileIcon size={24} />
          <span className="text-xs">Profile</span>
        </button>
      </div>

      {/* Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        radius={radius}
        setRadius={setRadius}
        onLocationDetected={setUserLocation}
      />
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
}