import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { ArrowLeft, Mail, Lock } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"identifier" | "password">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleIdentifierNext = () => {
    if (!identifier.trim()) {
      setIdentifierError("Please enter your email, username, or phone");
      return;
    }
    setIdentifierError("");
    setStep("password");
  };

  const handleLogin = () => {
    if (!password.trim()) {
      setPasswordError("Please enter your password");
      return;
    }
    setPasswordError("");
    // Simulate login success
    navigate("/swipe");
  };

  const handleBack = () => {
    if (step === "password") {
      setStep("identifier");
      setPasswordError("");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background safe-area-inset">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-6 pt-safe"
      >
        <button
          onClick={handleBack}
          className="p-2 -ml-2 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-sm text-muted-foreground">
          {step === "identifier" ? "Log In" : "Enter Password"}
        </span>
        <div className="w-6" />
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-safe">
        <AnimatePresence mode="wait">
          {step === "identifier" ? (
            <motion.div
              key="identifier"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h1 className="text-3xl mb-2">Welcome back</h1>
                  <p className="text-muted-foreground">
                    Enter your email, username, or phone number
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setIdentifierError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleIdentifierNext();
                    }}
                    placeholder="Email, username, or phone"
                    className="w-full px-4 py-4 bg-foreground/5 rounded-2xl outline-none focus:ring-2 focus:ring-foreground/20 transition-all text-base"
                    autoFocus
                  />
                  {identifierError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-2"
                    >
                      {identifierError}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  size="lg"
                  className="w-full rounded-full"
                  onClick={handleIdentifierNext}
                >
                  Next
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h1 className="text-3xl mb-2">Enter password</h1>
                  <p className="text-muted-foreground">
                    Logging in as{" "}
                    <span className="text-foreground font-medium">
                      {identifier}
                    </span>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleLogin();
                    }}
                    placeholder="Password"
                    className="w-full px-4 py-4 bg-foreground/5 rounded-2xl outline-none focus:ring-2 focus:ring-foreground/20 transition-all text-base"
                    autoFocus
                  />
                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-2"
                    >
                      {passwordError}
                    </motion.p>
                  )}
                  <button className="text-sm text-muted-foreground underline mt-3">
                    Forgot password?
                  </button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  size="lg"
                  className="w-full rounded-full"
                  onClick={handleLogin}
                >
                  Log In
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
