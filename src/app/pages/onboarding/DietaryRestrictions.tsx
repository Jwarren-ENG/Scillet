import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { motion } from "motion/react";

const restrictions = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Gluten Free",
  "Dairy Free",
  "Nut Allergy",
  "Shellfish Allergy",
];

export function DietaryRestrictions() {
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();
  const { updateUserData } = useUser();

  const toggleRestriction = (restriction: string) => {
    setSelected((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  };

  const selectNone = () => {
    setSelected([]);
  };

  const handleContinue = () => {
    updateUserData({ dietaryRestrictions: selected });
    navigate("/onboarding/preferences");
  };

  const noneSelected = selected.length === 0;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="min-h-screen flex flex-col px-6 py-8 max-w-md mx-auto"
    >
      <Progress value={75} className="mb-8" />

      <div className="flex-1 flex flex-col">
        <h2 className="text-3xl mb-2">Any dietary needs?</h2>
        <p className="text-muted-foreground mb-8">We'll filter accordingly</p>

        {/* None / I Eat Everything Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={selectNone}
          className={`w-full p-5 rounded-3xl border-2 transition-all mb-4 ${
            noneSelected
              ? "bg-primary text-primary-foreground border-primary shadow-lg"
              : "bg-card border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="text-3xl">🍽️</div>
            <div className="text-lg font-semibold">I eat everything</div>
          </div>
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-sm text-muted-foreground">or select restrictions</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {restrictions.map((restriction) => (
            <motion.button
              key={restriction}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleRestriction(restriction)}
              className={`px-6 py-3 rounded-full border-2 transition-all ${
                selected.includes(restriction)
                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                  : "bg-card border-border hover:border-primary/50"
              }`}
            >
              {restriction}
            </motion.button>
          ))}
        </div>
      </div>

      <Button size="lg" className="w-full rounded-full" onClick={handleContinue}>
        Continue
      </Button>
    </motion.div>
  );
}