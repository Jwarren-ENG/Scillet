import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { motion } from "motion/react";
import { CameraIcon } from "../../components/Icons";

export function ProfilePhoto() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { updateUserData } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (photoUrl) {
      updateUserData({ profilePhoto: photoUrl });
    }
    navigate("/onboarding/contact");
  };

  const handleSkip = () => {
    navigate("/onboarding/contact");
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="min-h-screen flex flex-col px-6 py-8 max-w-md mx-auto"
    >
      <Progress value={30} className="mb-8" />

      <div className="flex-1 flex flex-col justify-center items-center">
        <h2 className="text-3xl mb-2 text-center">Add a profile photo</h2>
        <p className="text-muted-foreground mb-12 text-center">
          Let others see your face (optional)
        </p>

        {/* Photo preview/upload area */}
        <label htmlFor="photo-upload" className="cursor-pointer mb-12">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-gray-200 hover:border-black transition-all"
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <CameraIcon size={40} className="text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">Add Photo</span>
              </div>
            )}
            
            {/* Edit overlay when photo exists */}
            {photoUrl && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <CameraIcon size={32} className="text-white" />
              </div>
            )}
          </motion.div>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <p className="text-xs text-gray-500 text-center max-w-xs">
          Choose a clear photo where your face is visible. You can always change this later.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          size="lg"
          className="w-full rounded-full"
          onClick={handleContinue}
          disabled={!photoUrl}
        >
          Continue
        </Button>
        
        <Button
          size="lg"
          variant="ghost"
          className="w-full rounded-full text-muted-foreground"
          onClick={handleSkip}
        >
          Skip for now
        </Button>
      </div>
    </motion.div>
  );
}
