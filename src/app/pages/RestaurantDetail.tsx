import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getRestaurantById, getRating } from "../data/restaurants";
import { useUser } from "../context/UserContext";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { NavigationIcon, StarIcon, LocationIcon, HeartIcon } from "../components/Icons";
import { motion } from "motion/react";
import { toast } from "sonner";

export function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, saveRestaurant, unsaveRestaurant, rateRestaurant } = useUser();
  const [showNavModal, setShowNavModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const restaurant = id ? getRestaurantById(id) : null;
  const isSaved = restaurant ? userData.savedRestaurants.includes(restaurant.id) : false;
  const existingRating = id ? getRating(id) : null;

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Restaurant not found</h2>
          <Button onClick={() => navigate("/swipe")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleToggleSave = () => {
    if (isSaved) {
      unsaveRestaurant(restaurant.id);
      toast.success("Removed from saved");
    } else {
      saveRestaurant(restaurant.id);
      toast.success("Saved!");
    }
  };

  const handleSubmitRating = () => {
    if (rating > 0) {
      rateRestaurant(restaurant.id, rating, review);
      toast.success("Thanks for your rating!");
      setShowRatingModal(false);
      setRating(0);
      setReview("");
    }
  };

  const openMaps = (app: string) => {
    const address = encodeURIComponent(restaurant.address);
    const urls: Record<string, string> = {
      apple: `https://maps.apple.com/?q=${address}`,
      google: `https://www.google.com/maps/search/?api=1&query=${address}`,
      waze: `https://waze.com/ul?q=${address}`,
    };
    window.open(urls[app], "_blank");
    setShowNavModal(false);
  };

  const openOrderService = (url: string) => {
    window.open(url, "_blank");
    setShowOrderModal(false);
    toast.success("Opening ordering service...");
  };

  const orderingServiceLabels: Record<string, { label: string; emoji: string }> = {
    website: { label: "Restaurant Website", emoji: "🌐" },
    doordash: { label: "DoorDash", emoji: "🏍️" },
    ubereats: { label: "Uber Eats", emoji: "🚗" },
    grubhub: { label: "Grubhub", emoji: "🍔" },
    postmates: { label: "Postmates", emoji: "📦" },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header image */}
      <div className="relative h-80">
        <img
          src={restaurant.thumbnailUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Save button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleSave}
          className={`absolute top-4 right-4 w-10 h-10 backdrop-blur rounded-full flex items-center justify-center ${
            isSaved ? "bg-primary" : "bg-white/90"
          }`}
        >
          <HeartIcon
            size={20}
            className={isSaved ? "text-primary-foreground" : "text-foreground"}
            fill={isSaved ? "currentColor" : "none"}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl mb-2">{restaurant.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <LocationIcon size={16} />
              <span>{restaurant.distance} miles away</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <StarIcon className="text-yellow-500" size={20} fill="currentColor" />
            <span className="text-lg">{restaurant.rating}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            size="lg"
            className="flex-1 rounded-full"
            onClick={() => setShowNavModal(true)}
          >
            <NavigationIcon className="mr-2" size={20} />
            Navigate
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => setShowRatingModal(true)}
          >
            <StarIcon className="mr-2" size={20} />
            {existingRating ? "Update Rating" : "Rate"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => setShowOrderModal(true)}
          >
            <ShoppingBag className="mr-2" size={20} />
            Order
          </Button>
        </div>

        {/* Existing rating */}
        {existingRating && (
          <div className="bg-accent/20 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Your rating:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    size={16}
                    className={i < existingRating.rating ? "text-yellow-500" : "text-gray-300"}
                    fill={i < existingRating.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
            {existingRating.review && (
              <p className="text-sm text-muted-foreground">{existingRating.review}</p>
            )}
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h3 className="mb-2">About</h3>
          <p className="text-muted-foreground">{restaurant.description}</p>
        </div>

        {/* Address */}
        <div className="mb-6">
          <h3 className="mb-2">Location</h3>
          <p className="text-muted-foreground">{restaurant.address}</p>
        </div>

        {/* Hours */}
        <div className="mb-6">
          <h3 className="mb-3">Hours</h3>
          <div className="space-y-2">
            {Object.entries(restaurant.hours).map(([day, hours]) => {
              const isToday = day === new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
              return (
                <div
                  key={day}
                  className={`flex justify-between py-2 px-3 rounded-lg ${
                    isToday ? 'bg-primary/10 font-medium' : ''
                  }`}
                >
                  <span className="capitalize">{day}</span>
                  <span className={isToday ? 'text-primary' : 'text-muted-foreground'}>
                    {hours}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="mb-3">Cuisine & Tags</h3>
          <div className="flex flex-wrap gap-2">
            {restaurant.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-muted rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Modal */}
      <Dialog open={showNavModal} onOpenChange={setShowNavModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose your maps app</DialogTitle>
            <DialogDescription>Select an app to get directions</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-14"
              onClick={() => openMaps("apple")}
            >
              <span className="text-lg mr-3">🗺️</span>
              Apple Maps
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-14"
              onClick={() => openMaps("google")}
            >
              <span className="text-lg mr-3">🌍</span>
              Google Maps
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-14"
              onClick={() => openMaps("waze")}
            >
              <span className="text-lg mr-3">🚗</span>
              Waze
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate {restaurant.name}</DialogTitle>
            <DialogDescription>Share your experience with others</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <StarIcon
                    size={40}
                    className={
                      star <= (hoverRating || rating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                    fill={star <= (hoverRating || rating) ? "currentColor" : "none"}
                  />
                </motion.button>
              ))}
            </div>
            <Textarea
              placeholder="Share your experience (optional)"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
            />
            <Button
              size="lg"
              className="w-full rounded-full"
              disabled={rating === 0}
              onClick={handleSubmitRating}
            >
              <Check className="mr-2" size={20} />
              Submit Rating
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order from {restaurant.name}</DialogTitle>
            <DialogDescription>Choose a delivery service to order</DialogDescription>
          </DialogHeader>
          {restaurant.orderingServices && Object.keys(restaurant.orderingServices).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(restaurant.orderingServices).map(([service, url]) => (
                <Button
                  key={service}
                  variant="outline"
                  className="w-full justify-start h-14"
                  onClick={() => openOrderService(url)}
                >
                  <span className="text-lg mr-3">{orderingServiceLabels[service].emoji}</span>
                  {orderingServiceLabels[service].label}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">Online ordering not available for this restaurant.</p>
              <Button variant="outline" onClick={() => setShowOrderModal(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}