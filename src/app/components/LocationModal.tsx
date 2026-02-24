import { motion, AnimatePresence } from "motion/react";
import { CloseIcon, LocationIcon, NavigationIcon, SearchIcon } from "./Icons";
import { cities } from "../data/restaurants";
import { useState, useMemo } from "react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  radius: number;
  setRadius: (radius: number) => void;
}

export function LocationModal({
  isOpen,
  onClose,
  selectedCity,
  setSelectedCity,
  radius,
  setRadius,
}: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Add "Current Location" as the first option - memoized
  const allCities = useMemo(
    () => [{ id: "current", label: "Current Location", emoji: "📍" }, ...cities],
    []
  );

  // Filter cities based on search - memoized
  const filteredCities = useMemo(
    () =>
      allCities.filter((city) =>
        city.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [allCities, searchQuery]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - more transparent to show video */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal - more transparent glass effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl z-50 overflow-hidden border border-white/20"
          >
            {/* Header - semi-transparent dark glass */}
            <div className="relative bg-black/80 backdrop-blur-xl text-white p-6 border-b border-white/10">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
              >
                <CloseIcon size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <LocationIcon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Location</h2>
                  <p className="text-sm opacity-80">Choose your city & radius</p>
                </div>
              </div>
            </div>

            {/* Content - semi-transparent */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Search bar */}
              <div className="mb-6">
                <div className="relative">
                  <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm focus:bg-white/80 border-2 border-gray-200/50 focus:border-black transition-all outline-none"
                  />
                </div>
              </div>

              {/* Cities */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">SELECT CITY</h3>
                <div className="grid grid-cols-1 gap-2">
                  {filteredCities.map((city) => (
                    <motion.button
                      key={city.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCity(city.id)}
                      className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${
                        selectedCity === city.id
                          ? "bg-black text-white shadow-lg"
                          : "bg-white/60 backdrop-blur-sm text-gray-800 hover:bg-white/80 border border-gray-200/50"
                      }`}
                    >
                      {city.id === "current" ? (
                        <NavigationIcon size={24} />
                      ) : (
                        <span className="text-2xl">{city.emoji}</span>
                      )}
                      <span className="font-medium">{city.label}</span>
                      {selectedCity === city.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs"
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
                {filteredCities.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No cities found</p>
                )}
              </div>

              {/* Radius Slider */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-700">SEARCH RADIUS</h3>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Distance</span>
                    <span className="text-2xl font-bold text-black">{radius} mi</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer accent-black"
                    style={{
                      background: `linear-gradient(to right, black 0%, black ${(radius / 50) * 100}%, #d1d5db ${(radius / 50) * 100}%, #d1d5db 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>1 mi</span>
                    <span>50 mi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-4 bg-black text-white rounded-2xl font-semibold shadow-lg hover:bg-gray-800 transition-all"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}