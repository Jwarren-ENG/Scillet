import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Progress } from "../../components/ui/progress";
import { motion } from "motion/react";
import { CheckIcon } from "../../components/Icons";

export function ContactInfo() {
  const [contactType, setContactType] = useState<"phone" | "email">("email");
  const [contact, setContact] = useState("");
  const navigate = useNavigate();
  const { updateUserData } = useUser();

  // Email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  
  // Phone validation (basic - checks for 10+ digits)
  const isPhoneValid = /^\d{10,}$/.test(contact.replace(/[\s\-\(\)]/g, ""));
  
  const isValid = contactType === "email" ? isEmailValid : isPhoneValid;

  const handleContinue = () => {
    updateUserData({ contact, contactType });
    navigate("/onboarding/password");
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="min-h-screen flex flex-col px-6 py-8 max-w-md mx-auto"
    >
      <Progress value={37.5} className="mb-8" />

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-3xl mb-2">How can we reach you?</h2>
        <p className="text-muted-foreground mb-8">We'll never spam you</p>

        <div className="flex gap-2 mb-6">
          <Button
            variant={contactType === "email" ? "default" : "outline"}
            className="flex-1 rounded-full"
            onClick={() => setContactType("email")}
          >
            Email
          </Button>
          <Button
            variant={contactType === "phone" ? "default" : "outline"}
            className="flex-1 rounded-full"
            onClick={() => setContactType("phone")}
          >
            Phone
          </Button>
        </div>

        <div className="relative mb-4">
          <Input
            type={contactType === "email" ? "email" : "tel"}
            placeholder={contactType === "email" ? "you@example.com" : "(555) 123-4567"}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="text-lg py-6 rounded-full pr-12"
          />
          {isValid && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <CheckIcon size={16} className="text-white" />
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Your information is secure and private
        </p>
      </div>

      <Button
        size="lg"
        className="w-full rounded-full"
        disabled={!isValid}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </motion.div>
  );
}