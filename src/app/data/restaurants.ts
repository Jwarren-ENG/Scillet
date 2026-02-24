export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  distance: number; // in miles
  rating: number;
  cuisine: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl: string;
  lat: number;
  lng: number;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  category: string; // "healthy" | "american" | "mexican" | "italian" | "asian" | "desserts" | "bars"
  orderingServices?: {
    website?: string;
    doordash?: string;
    ubereats?: string;
    grubhub?: string;
    postmates?: string;
  };
}

export const foodCategories = [
  { id: "all", label: "All", emoji: "🍽️" },
  { id: "healthy", label: "Healthy", emoji: "🥗" },
  { id: "american", label: "American", emoji: "🍔" },
  { id: "mexican", label: "Mexican", emoji: "🌮" },
  { id: "italian", label: "Italian", emoji: "🍕" },
  { id: "asian", label: "Asian", emoji: "🍜" },
  { id: "desserts", label: "Desserts", emoji: "🍰" },
  { id: "bars", label: "Bars", emoji: "🍸" },
];

export const cities = [
  { id: "all", label: "All Cities", emoji: "🌎" },
  { id: "san-francisco", label: "San Francisco", emoji: "🌉" },
  { id: "new-york", label: "New York", emoji: "🗽" },
  { id: "los-angeles", label: "Los Angeles", emoji: "🌴" },
];

export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Mama's Kitchen",
    description: "Authentic Italian cuisine with homemade pasta and wood-fired pizzas. Family recipes passed down through generations.",
    address: "123 Main St, San Francisco, CA",
    city: "san-francisco",
    distance: 0.8,
    rating: 4.7,
    cuisine: "Italian",
    category: "italian",
    tags: ["Italian", "Pizza", "Pasta", "Fine Dining"],
    videoUrl: "https://example.com/video1.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    lat: 37.7749,
    lng: -122.4194,
    hours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 10:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "11:00 AM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM",
    },
    orderingServices: {
      website: "https://mamaskitchen.com/order",
      doordash: "https://doordash.com/store/mamas-kitchen",
      ubereats: "https://ubereats.com/store/mamas-kitchen",
      grubhub: "https://grubhub.com/restaurant/mamas-kitchen",
    },
  },
  {
    id: "2",
    name: "Sushi Palace",
    description: "Traditional Japanese sushi bar featuring fresh daily catches and omakase experiences.",
    address: "456 Ocean Ave, San Francisco, CA",
    city: "san-francisco",
    distance: 1.2,
    rating: 4.9,
    cuisine: "Japanese",
    category: "asian",
    tags: ["Sushi", "Japanese", "Seafood"],
    videoUrl: "https://example.com/video2.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
    lat: 37.7849,
    lng: -122.4094,
    hours: {
      monday: "5:00 PM - 10:00 PM",
      tuesday: "5:00 PM - 10:00 PM",
      wednesday: "5:00 PM - 10:00 PM",
      thursday: "5:00 PM - 10:00 PM",
      friday: "5:00 PM - 11:00 PM",
      saturday: "12:00 PM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM",
    },
    orderingServices: {
      website: "https://sushipalace.com/order",
      ubereats: "https://ubereats.com/store/sushi-palace",
      postmates: "https://postmates.com/store/sushi-palace",
    },
  },
  {
    id: "3",
    name: "Taco Haven",
    description: "Vibrant street tacos and authentic Mexican flavors. Don't miss the al pastor!",
    address: "789 Mission St, San Francisco, CA",
    city: "san-francisco",
    distance: 0.5,
    rating: 4.6,
    cuisine: "Mexican",
    category: "mexican",
    tags: ["Mexican", "Tacos", "Street Food"],
    videoUrl: "https://example.com/video3.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
    lat: 37.7649,
    lng: -122.4294,
    hours: {
      monday: "10:00 AM - 10:00 PM",
      tuesday: "10:00 AM - 10:00 PM",
      wednesday: "10:00 AM - 10:00 PM",
      thursday: "10:00 AM - 10:00 PM",
      friday: "10:00 AM - 11:00 PM",
      saturday: "10:00 AM - 11:00 PM",
      sunday: "10:00 AM - 9:00 PM",
    },
    orderingServices: {
      doordash: "https://doordash.com/store/taco-haven",
      ubereats: "https://ubereats.com/store/taco-haven",
      grubhub: "https://grubhub.com/restaurant/taco-haven",
    },
  },
  {
    id: "4",
    name: "Burger Bliss",
    description: "Gourmet burgers made with locally sourced beef and creative toppings.",
    address: "321 Market St, San Francisco, CA",
    city: "san-francisco",
    distance: 1.5,
    rating: 4.5,
    cuisine: "American",
    category: "american",
    tags: ["Burgers", "American"],
    videoUrl: "https://example.com/video4.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    lat: 37.7949,
    lng: -122.3994,
    hours: {
      monday: "11:00 AM - 9:00 PM",
      tuesday: "11:00 AM - 9:00 PM",
      wednesday: "11:00 AM - 9:00 PM",
      thursday: "11:00 AM - 9:00 PM",
      friday: "11:00 AM - 10:00 PM",
      saturday: "11:00 AM - 10:00 PM",
      sunday: "11:00 AM - 9:00 PM",
    },
    orderingServices: {
      website: "https://burgerbliss.com/order",
      doordash: "https://doordash.com/store/burger-bliss",
      ubereats: "https://ubereats.com/store/burger-bliss",
    },
  },
  {
    id: "5",
    name: "Sweet Dreams",
    description: "Artisan desserts and pastries crafted daily. Instagram-worthy creations that taste as good as they look.",
    address: "654 Valencia St, San Francisco, CA",
    city: "san-francisco",
    distance: 2.1,
    rating: 4.8,
    cuisine: "Desserts",
    category: "desserts",
    tags: ["Desserts", "Bakery", "Coffee"],
    videoUrl: "https://example.com/video5.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800",
    lat: 37.7549,
    lng: -122.4394,
    hours: {
      monday: "8:00 AM - 8:00 PM",
      tuesday: "8:00 AM - 8:00 PM",
      wednesday: "8:00 AM - 8:00 PM",
      thursday: "8:00 AM - 8:00 PM",
      friday: "8:00 AM - 9:00 PM",
      saturday: "9:00 AM - 9:00 PM",
      sunday: "9:00 AM - 8:00 PM",
    },
    orderingServices: {
      website: "https://sweetdreams.com/order",
      postmates: "https://postmates.com/store/sweet-dreams",
      ubereats: "https://ubereats.com/store/sweet-dreams",
    },
  },
  {
    id: "6",
    name: "Dragon Wok",
    description: "Szechuan spice and authentic Chinese dishes. Family-style dining at its finest.",
    address: "987 Stockton St, San Francisco, CA",
    city: "san-francisco",
    distance: 1.8,
    rating: 4.4,
    cuisine: "Chinese",
    category: "asian",
    tags: ["Chinese", "Asian"],
    videoUrl: "https://example.com/video6.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800",
    lat: 37.7449,
    lng: -122.4494,
    hours: {
      monday: "11:30 AM - 9:30 PM",
      tuesday: "11:30 AM - 9:30 PM",
      wednesday: "11:30 AM - 9:30 PM",
      thursday: "11:30 AM - 9:30 PM",
      friday: "11:30 AM - 10:00 PM",
      saturday: "11:30 AM - 10:00 PM",
      sunday: "12:00 PM - 9:00 PM",
    },
    orderingServices: {
      doordash: "https://doordash.com/store/dragon-wok",
      grubhub: "https://grubhub.com/restaurant/dragon-wok",
      ubereats: "https://ubereats.com/store/dragon-wok",
    },
  },
  {
    id: "7",
    name: "Green Leaf",
    description: "Plant-based paradise with creative vegan dishes that even meat lovers enjoy.",
    address: "111 Hayes St, San Francisco, CA",
    city: "san-francisco",
    distance: 0.9,
    rating: 4.7,
    cuisine: "Vegan",
    category: "healthy",
    tags: ["Vegan", "Vegetarian", "Healthy"],
    videoUrl: "https://example.com/video7.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    lat: 37.7349,
    lng: -122.4594,
    hours: {
      monday: "10:00 AM - 8:00 PM",
      tuesday: "10:00 AM - 8:00 PM",
      wednesday: "10:00 AM - 8:00 PM",
      thursday: "10:00 AM - 8:00 PM",
      friday: "10:00 AM - 9:00 PM",
      saturday: "10:00 AM - 9:00 PM",
      sunday: "10:00 AM - 8:00 PM",
    },
    orderingServices: {
      website: "https://greenleaf.com/order",
      ubereats: "https://ubereats.com/store/green-leaf",
      postmates: "https://postmates.com/store/green-leaf",
    },
  },
  {
    id: "8",
    name: "The Steakhouse",
    description: "Premium cuts aged to perfection. The ultimate fine dining experience.",
    address: "222 Pine St, San Francisco, CA",
    city: "san-francisco",
    distance: 2.5,
    rating: 4.9,
    cuisine: "Steakhouse",
    category: "american",
    tags: ["Fine Dining", "Steakhouse", "American"],
    videoUrl: "https://example.com/video8.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    lat: 37.7249,
    lng: -122.4694,
    hours: {
      monday: "5:00 PM - 10:00 PM",
      tuesday: "5:00 PM - 10:00 PM",
      wednesday: "5:00 PM - 10:00 PM",
      thursday: "5:00 PM - 10:00 PM",
      friday: "5:00 PM - 11:00 PM",
      saturday: "5:00 PM - 11:00 PM",
      sunday: "5:00 PM - 9:00 PM",
    },
    orderingServices: {
      website: "https://thesteakhouse.com/reservations",
      ubereats: "https://ubereats.com/store/the-steakhouse",
    },
  },
  {
    id: "9",
    name: "The Velvet Room",
    description: "Hidden speakeasy with craft cocktails and live jazz. Password required at the door.",
    address: "888 Bourbon St, New Orleans, LA",
    city: "new-york",
    distance: 0.6,
    rating: 4.8,
    cuisine: "Cocktail Bar",
    category: "bars",
    tags: ["Speakeasy", "Cocktails", "Jazz", "Nightlife"],
    videoUrl: "https://example.com/video9.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
    lat: 40.7589,
    lng: -73.9851,
    hours: {
      monday: "Closed",
      tuesday: "Closed",
      wednesday: "6:00 PM - 2:00 AM",
      thursday: "6:00 PM - 2:00 AM",
      friday: "6:00 PM - 3:00 AM",
      saturday: "6:00 PM - 3:00 AM",
      sunday: "6:00 PM - 12:00 AM",
    },
    orderingServices: {
      website: "https://thevelvetroom.com/reservations",
    },
  },
  {
    id: "10",
    name: "Rooftop 21",
    description: "Stunning city views paired with innovative cocktails and small plates.",
    address: "555 Sunset Blvd, Los Angeles, CA",
    city: "los-angeles",
    distance: 1.3,
    rating: 4.7,
    cuisine: "Rooftop Bar",
    category: "bars",
    tags: ["Rooftop", "Cocktails", "Views", "Nightlife"],
    videoUrl: "https://example.com/video10.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800",
    lat: 34.0522,
    lng: -118.2437,
    hours: {
      monday: "Closed",
      tuesday: "5:00 PM - 12:00 AM",
      wednesday: "5:00 PM - 12:00 AM",
      thursday: "5:00 PM - 1:00 AM",
      friday: "5:00 PM - 2:00 AM",
      saturday: "4:00 PM - 2:00 AM",
      sunday: "4:00 PM - 11:00 PM",
    },
    orderingServices: {
      website: "https://rooftop21.com/reservations",
    },
  },
  {
    id: "11",
    name: "The Copper Still",
    description: "Whiskey bar with over 200 selections. Cozy atmosphere and expert bartenders.",
    address: "333 Fillmore St, San Francisco, CA",
    city: "san-francisco",
    distance: 1.1,
    rating: 4.6,
    cuisine: "Whiskey Bar",
    category: "bars",
    tags: ["Whiskey", "Bar", "Cocktails"],
    videoUrl: "https://example.com/video11.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800",
    lat: 37.7849,
    lng: -122.4324,
    hours: {
      monday: "Closed",
      tuesday: "5:00 PM - 12:00 AM",
      wednesday: "5:00 PM - 12:00 AM",
      thursday: "5:00 PM - 1:00 AM",
      friday: "5:00 PM - 2:00 AM",
      saturday: "5:00 PM - 2:00 AM",
      sunday: "5:00 PM - 11:00 PM",
    },
    orderingServices: {
      website: "https://copperstill.com",
    },
  },
];

export function getRestaurantById(id: string): Restaurant | undefined {
  return mockRestaurants.find((r) => r.id === id);
}

export function getRating(id: string): { rating: number; review?: string } | null {
  const ratings = JSON.parse(localStorage.getItem("scillet-ratings") || "{}");
  return ratings[id] || null;
}