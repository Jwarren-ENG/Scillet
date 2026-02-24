import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Progress } from "../../components/ui/progress";
import { motion } from "motion/react";
import { CheckIcon } from "../../components/Icons";

export function Username() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { updateUserData } = useUser();

  const isUsernameValid = username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);

  const handleContinue = () => {
    updateUserData({ username });
    navigate("/onboarding/profile-photo");
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="min-h-screen flex flex-col px-6 py-8 max-w-md mx-auto"
    >
      <Progress value={25} className="mb-8" />

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-3xl mb-2">Pick a username</h2>
        <p className="text-muted-foreground mb-8">Make it unique and memorable</p>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-medium">
            @
          </div>
          <Input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            className="text-lg py-6 rounded-full pl-10 pr-12"
            autoFocus
          />
          {isUsernameValid && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <CheckIcon size={16} className="text-white" />
            </div>
          )}
        </div>
        
        {username && !isUsernameValid && (
          <p className="text-xs text-muted-foreground mt-2 ml-4">
            Username must be at least 3 characters (letters, numbers, underscore)
          </p>
        )}
      </div>

      <Button
        size="lg"
        className="w-full rounded-full"
        disabled={!isUsernameValid}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </motion.div>
  );
}