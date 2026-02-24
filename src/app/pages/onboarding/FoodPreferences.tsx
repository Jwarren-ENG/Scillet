import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { motion } from "motion/react";

const preferences = [
  { name: "Burgers", emoji: "🍔" },
  { name: "Sushi", emoji: "🍣" },
  { name: "Tacos", emoji: "🌮" },
  { name: "Pizza", emoji: "🍕" },
  { name: "Desserts", emoji: "🍰" },
  { name: "Street Food", emoji: "🥘" },
  { name: "Fine Dining", emoji: "🍽️" },
  { name: "Asian", emoji: "🥢" },
  { name: "Italian", emoji: "🍝" },
  { name: "Mexican", emoji: "🌯" },
  { name: "Seafood", emoji: "🦞" },
  { name: "BBQ", emoji: "🍖" },
];

export function FoodPreferences() {
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();
  const { updateUserData } = useUser();

  const togglePreference = (preference: string) => {
    setSelected((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference]
    );
  };

  const selectAll = () => {
    if (selected.length === preferences.length) {
      setSelected([]);
    } else {
      setSelected(preferences.map((p) => p.name));
    }
  };

  const handleContinue = () => {
    updateUserData({ foodPreferences: selected });
    navigate("/onboarding/ready");
  };

  const allSelected = selected.length === preferences.length;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="min-h-screen flex flex-col px-6 py-8 max-w-md mx-auto"
    >
      <Progress value={87.5} className="mb-8" />

      <div className="flex-1 flex flex-col">
        <h2 className="text-3xl mb-2">What do you love?</h2>
        <p className="text-muted-foreground mb-8">
          Select as many as you want
        </p>

        {/* I Like It All Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={selectAll}
          className={`w-full p-5 rounded-3xl border-2 transition-all mb-4 ${
            allSelected
              ? "bg-primary text-primary-foreground border-primary shadow-lg"
              : "bg-card border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="text-3xl">✨</div>
            <div className="text-lg font-semibold">I like it all</div>
          </div>
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-sm text-muted-foreground">or choose specific types</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {preferences.map((pref) => (
            <motion.button
              key={pref.name}
              whileTap={{ scale: 0.95 }}
              onClick={() => togglePreference(pref.name)}
              className={`p-6 rounded-3xl border-2 transition-all ${
                selected.includes(pref.name)
                  ? "bg-primary text-primary-foreground border-primary shadow-lg -translate-y-1"
                  : "bg-card border-border hover:border-primary/50"
              }`}
            >
              <div className="text-4xl mb-2">{pref.emoji}</div>
              <div className="text-sm font-medium">{pref.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        className="w-full rounded-full"
        disabled={selected.length === 0}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </motion.div>
  );
}