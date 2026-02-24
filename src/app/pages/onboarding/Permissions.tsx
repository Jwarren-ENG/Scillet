import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { motion } from "motion/react";
import { MapPin, Bell, Check } from "lucide-react";

export function Permissions() {
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  const navigate = useNavigate();

  const handleEnableLocation = () => {
    // In a real app, this would trigger native permission prompt
    setLocationGranted(true);
  };

  const handleEnableNotifications = () => {
    // In a real app, this would trigger native permission prompt
    setNotificationsGranted(true);
  };

  const handleContinue = () => {
    navigate("/onboarding/dietary");
  };

  const handleSkip = () => {
    navigate("/onboarding/dietary");
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="min-h-screen flex flex-col px-6 py-8 max-w-md mx-auto"
    >
      <Progress value={62.5} className="mb-8" />

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-3xl mb-2">A couple permissions</h2>
        <p className="text-muted-foreground mb-8">To make your experience great</p>

        <div className="space-y-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-3xl border-2 transition-colors ${
              locationGranted
                ? "border-accent bg-accent/10"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${
                locationGranted ? "bg-accent" : "bg-muted"
              }`}>
                {locationGranted ? (
                  <Check className="w-6 h-6 text-accent-foreground" />
                ) : (
                  <MapPin className="w-6 h-6 text-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="mb-1">Location</h3>
                <p className="text-sm text-muted-foreground">
                  So we can notify you when you're nearby
                </p>
                {!locationGranted && (
                  <Button
                    size="sm"
                    className="mt-3 rounded-full"
                    onClick={handleEnableLocation}
                  >
                    Enable
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-3xl border-2 transition-colors ${
              notificationsGranted
                ? "border-accent bg-accent/10"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${
                notificationsGranted ? "bg-accent" : "bg-muted"
              }`}>
                {notificationsGranted ? (
                  <Check className="w-6 h-6 text-accent-foreground" />
                ) : (
                  <Bell className="w-6 h-6 text-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="mb-1">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  So you don't miss food you saved
                </p>
                {!notificationsGranted && (
                  <Button
                    size="sm"
                    className="mt-3 rounded-full"
                    onClick={handleEnableNotifications}
                  >
                    Enable
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {locationGranted && notificationsGranted ? (
        <Button size="lg" className="w-full rounded-full" onClick={handleContinue}>
          Continue
        </Button>
      ) : (
        <div className="space-y-3">
          <Button
            size="lg"
            variant="outline"
            className="w-full rounded-full"
            onClick={handleSkip}
          >
            Skip for now
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Limited functionality without permissions
          </p>
        </div>
      )}
    </motion.div>
  );
}