import { motion, AnimatePresence } from "motion/react";
import { CloseIcon } from "./Icons";
import { foodCategories } from "../data/restaurants";
import { useCallback } from "react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export function FilterModal({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
}: FilterModalProps) {
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
      onClose();
    },
    [setSelectedCategory, onClose]
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
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
                  S
                </div>
                <div>
                  <h2 className="text-xl font-bold">Scillet</h2>
                  <p className="text-sm opacity-80">Filter your feed</p>
                </div>
              </div>
            </div>

            {/* Content - semi-transparent */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">FOOD CATEGORIES</h3>
              <div className="grid grid-cols-2 gap-3">
                {foodCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all relative ${
                      selectedCategory === category.id
                        ? "bg-black text-white shadow-lg scale-105"
                        : "bg-white/60 backdrop-blur-sm text-gray-800 hover:bg-white/80 border border-gray-200/50"
                    }`}
                  >
                    <span className="text-3xl">{category.emoji}</span>
                    <span className="font-medium text-sm">{category.label}</span>
                    {selectedCategory === category.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-4 bg-black text-white rounded-2xl font-semibold shadow-lg hover:bg-gray-800 transition-all"
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}