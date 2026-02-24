import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function Ready() {
  const navigate = useNavigate();
  const { updateUserData, userData } = useUser();

  const handleStart = () => {
    updateUserData({ completedOnboarding: true });
    navigate("/swipe");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-primary/20 via-background to-accent/20">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center max-w-md"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            times: [0, 0.5, 1],
          }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl mb-4"
        >
          You're all set, {userData.name}!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-muted-foreground mb-12"
        >
          Let's find some amazing food
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="w-full"
        >
          <Button
            size="lg"
            className="w-full rounded-full"
            onClick={handleStart}
          >
            Start Swiping
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
