import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Progress } from "../../components/ui/progress";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { CheckIcon } from "../../components/Icons";

export function Password() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { updateUserData } = useUser();

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    
    // Character variety
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    
    return Math.min(strength, 100);
  };

  const getStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength < 40) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength < 40) return "Weak";
    if (strength < 70) return "Good";
    return "Strong";
  };

  const isPasswordValid = getPasswordStrength() >= 70;

  const handleContinue = () => {
    updateUserData({ password });
    navigate("/onboarding/permissions");
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="min-h-screen flex flex-col px-6 py-8 max-w-md mx-auto"
    >
      <Progress value={50} className="mb-8" />

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-3xl mb-2">Create a password</h2>
        <p className="text-muted-foreground mb-8">Keep your account secure</p>

        <div className="relative mb-4">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-lg py-6 pr-20 rounded-full"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isPasswordValid && (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <CheckIcon size={16} className="text-white" />
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {password && (
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Password strength</span>
              <span className={`font-medium ${
                getPasswordStrength() < 40 ? 'text-red-500' : 
                getPasswordStrength() < 70 ? 'text-yellow-600' : 
                'text-green-500'
              }`}>
                {getStrengthText()}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getPasswordStrength()}%` }}
                transition={{ duration: 0.3 }}
                className={`h-full transition-colors ${getStrengthColor()}`}
              />
            </div>
            
            <div className="mt-3 space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className={`w-1 h-1 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                At least 8 characters
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                Upper and lowercase letters
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className={`w-1 h-1 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                At least one number
              </p>
            </div>
          </div>
        )}
      </div>

      <Button
        size="lg"
        className="w-full rounded-full"
        disabled={!isPasswordValid}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </motion.div>
  );
}