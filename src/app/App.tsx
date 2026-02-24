import { RouterProvider } from "react-router";
import { router } from "./routes";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "./components/ui/sonner";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // Register service worker for PWA support
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Service worker registration failed, but app still works
      });
    }
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Scillet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Scillet" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        
        {/* iOS Splash Screens & Icons */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Viewport for mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        
        {/* Prevent iOS text size adjustment */}
        <meta name="format-detection" content="telephone=no" />
      </Helmet>
      
      <UserProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </UserProvider>
    </HelmetProvider>
  );
}