import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Progress } from "../../components/ui/progress";
import { motion } from "motion/react";
import { CheckIcon } from "../../components/Icons";

export function NameInput() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { updateUserData } = useUser();

  const isNameValid = name.trim().length >= 2;

  const handleContinue = () => {
    updateUserData({ name });
    navigate("/onboarding/username");
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="min-h-screen flex flex-col px-6 py-8 max-w-md mx-auto"
    >
      <Progress value={12.5} className="mb-8" />

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-3xl mb-2">What's your name?</h2>
        <p className="text-muted-foreground mb-8">Let's get to know you</p>

        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg py-6 rounded-full pr-12"
            autoFocus
          />
          {isNameValid && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <CheckIcon size={16} className="text-white" />
            </div>
          )}
        </div>
      </div>

      <Button
        size="lg"
        className="w-full rounded-full"
        disabled={!isNameValid}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </motion.div>
  );
}