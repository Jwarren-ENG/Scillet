import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react";
import { Logo } from "../../components/Logo";

export function Welcome() {
  const navigate = useNavigate();
  const { userData } = useUser();

  useEffect(() => {
    if (userData.completedOnboarding) {
      navigate("/swipe");
    }
  }, [userData.completedOnboarding, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mb-8"
        >
          <Logo size={280} />
        </motion.div>

        <h1 className="text-4xl mb-4">Scillet</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Discover food that's cooking nearby.
        </p>

        <Button
          size="lg"
          className="w-full mb-4 rounded-full"
          onClick={() => navigate("/onboarding/name")}
        >
          Get Started
        </Button>

        <button
          className="text-sm text-muted-foreground underline"
          onClick={() => navigate("/login")}
        >
          Already have an account? Log in
        </button>
      </motion.div>
    </div>
  );
}