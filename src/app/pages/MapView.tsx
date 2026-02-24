import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { mockRestaurants, Restaurant, foodCategories } from "../data/restaurants";
import { useNavigate } from "react-router";
import { Clock } from "lucide-react";
import { CloseIcon, HomeIcon, SavedIcon, ProfileIcon, MapIcon as MapIconCustom, StarIcon, NavigationIcon } from "../components/Icons";
import { useUser } from "../context/UserContext";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icon creator
function createCustomIcon(category: string) {
  const categoryEmoji = foodCategories.find((c) => c.id === category)?.emoji || "🍽️";
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="
        background: white;
        border: 3px solid #000000;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translate(-50%, -50%);
      ">
        ${categoryEmoji}
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
}

export function MapView() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [userLocation] = useState({ lat: 37.7749, lng: -122.4194 }); // San Francisco
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  
  const navigate = useNavigate();
  const { userData, saveRestaurant, isSaved } = useUser();

  // Redirect if not completed onboarding
  useEffect(() => {
    if (!userData.completedOnboarding) {
      navigate("/");
    }
  }, [userData.completedOnboarding, navigate]);

  // Filter restaurants based on category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredRestaurants(mockRestaurants);
    } else {
      setFilteredRestaurants(mockRestaurants.filter((r) => r.category === selectedCategory));
    }
  }, [selectedCategory]);

  // Initialize map on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Already initialized

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 13,
      zoomControl: false,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Create markers layer
    const markersLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, [userLocation.lat, userLocation.lng]);

  // Update markers when filtered restaurants change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    // Add new markers
    filteredRestaurants.forEach((restaurant) => {
      const marker = L.marker([restaurant.lat, restaurant.lng], {
        icon: createCustomIcon(restaurant.category),
      });

      marker.bindPopup(`
        <div style="text-align: center; padding: 4px;">
          <strong>${restaurant.name}</strong><br/>
          <span style="color: #666; font-size: 14px;">${restaurant.cuisine}</span>
        </div>
      `);

      marker.on("click", () => {
        setSelectedRestaurant(restaurant);
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [filteredRestaurants]);

  // Pan to selected restaurant
  useEffect(() => {
    if (selectedRestaurant && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedRestaurant.lat, selectedRestaurant.lng], 15, {
        animate: true,
      });
    }
  }, [selectedRestaurant]);

  // Get current day for hours
  const getCurrentDay = () => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[new Date().getDay()];
  };

  const handleRecenter = () => {
    setSelectedRestaurant(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 13, {
        animate: true,
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header with filters */}
      <div className="px-4 py-4 bg-card border-b relative z-10">
        <h1 className="text-2xl mb-3">Nearby Restaurants</h1>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {foodCategories.map((category) => (
            <motion.button
              key={category.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <span>{category.emoji}</span>
              <span className="text-sm font-medium">{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Recenter Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleRecenter}
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center z-[400]"
        >
          <NavigationIcon size={20} className="text-primary" />
        </motion.button>
      </div>

      {/* Restaurant Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedRestaurant && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-20 left-0 right-0 bg-card rounded-t-3xl shadow-2xl p-6 z-[500]"
          >
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <CloseIcon size={16} />
            </button>

            <div className="flex gap-4">
              {/* Restaurant Thumbnail */}
              <div
                className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer"
                onClick={() => navigate(`/restaurant/${selectedRestaurant.id}`)}
              >
                <img
                  src={selectedRestaurant.thumbnailUrl}
                  alt={selectedRestaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Restaurant Info */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-xl mb-1 truncate cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate(`/restaurant/${selectedRestaurant.id}`)}
                >
                  {selectedRestaurant.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{selectedRestaurant.cuisine}</p>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <StarIcon size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm">{selectedRestaurant.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedRestaurant.distance} mi
                  </span>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock size={14} />
                  <span>
                    {selectedRestaurant.hours[getCurrentDay() as keyof typeof selectedRestaurant.hours]}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/restaurant/${selectedRestaurant.id}`)}
                    className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    View Reels
                  </motion.button>
                  {!isSaved(selectedRestaurant.id) && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => saveRestaurant(selectedRestaurant.id)}
                      className="py-2 px-4 bg-muted text-foreground rounded-full text-sm font-medium hover:bg-muted/80 transition-colors"
                    >
                      Save
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="flex justify-around items-center px-6 py-4 bg-card border-t relative z-10">
        <button
          onClick={() => navigate("/swipe")}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <HomeIcon size={24} />
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => navigate("/map")}
          className="flex flex-col items-center gap-1 text-primary"
        >
          <MapIconCustom size={24} />
          <span className="text-xs">Map</span>
        </button>
        <button
          onClick={() => navigate("/saved")}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <SavedIcon size={24} />
          <span className="text-xs">Saved</span>
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ProfileIcon size={24} />
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </div>
  );
}