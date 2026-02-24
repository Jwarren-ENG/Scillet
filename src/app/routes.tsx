import { createBrowserRouter } from "react-router";
import { Welcome } from "./pages/onboarding/Welcome";
import { Login } from "./pages/Login";
import { NameInput } from "./pages/onboarding/NameInput";
import { Username } from "./pages/onboarding/Username";
import { ProfilePhoto } from "./pages/onboarding/ProfilePhoto";
import { ContactInfo } from "./pages/onboarding/ContactInfo";
import { Password } from "./pages/onboarding/Password";
import { Permissions } from "./pages/onboarding/Permissions";
import { DietaryRestrictions } from "./pages/onboarding/DietaryRestrictions";
import { FoodPreferences } from "./pages/onboarding/FoodPreferences";
import { Ready } from "./pages/onboarding/Ready";
import { Swipe } from "./pages/Swipe";
import { SavedList } from "./pages/SavedList";
import { RestaurantDetail } from "./pages/RestaurantDetail";
import { Profile } from "./pages/Profile";
import { MapView } from "./pages/MapView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/onboarding/name",
    Component: NameInput,
  },
  {
    path: "/onboarding/username",
    Component: Username,
  },
  {
    path: "/onboarding/profile-photo",
    Component: ProfilePhoto,
  },
  {
    path: "/onboarding/contact",
    Component: ContactInfo,
  },
  {
    path: "/onboarding/password",
    Component: Password,
  },
  {
    path: "/onboarding/permissions",
    Component: Permissions,
  },
  {
    path: "/onboarding/dietary",
    Component: DietaryRestrictions,
  },
  {
    path: "/onboarding/preferences",
    Component: FoodPreferences,
  },
  {
    path: "/onboarding/ready",
    Component: Ready,
  },
  {
    path: "/swipe",
    Component: Swipe,
  },
  {
    path: "/map",
    Component: MapView,
  },
  {
    path: "/saved",
    Component: SavedList,
  },
  {
    path: "/restaurant/:id",
    Component: RestaurantDetail,
  },
  {
    path: "/profile",
    Component: Profile,
  },
]);