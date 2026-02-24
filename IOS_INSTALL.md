# Foodie - iOS PWA Installation Guide

## 📱 How to Install on iPhone/iPad

Your Foodie app is now iOS-friendly! Here's how to add it to your home screen:

### Installation Steps:

1. **Open Safari** on your iPhone or iPad
2. Navigate to your Foodie app URL
3. Tap the **Share** button (square with arrow pointing up) at the bottom
4. Scroll down and tap **"Add to Home Screen"**
5. Customize the name if desired (default: "Foodie")
6. Tap **"Add"** in the top right corner

### Features When Installed:

✅ **Full-screen experience** - No browser UI, feels like a native app
✅ **Home screen icon** - Launch directly from your home screen
✅ **Fast loading** - Offline support with service worker caching
✅ **iOS optimizations** - Safe area support, no bounce scroll, smooth gestures
✅ **Purple theme** - Modern, food-friendly color scheme (no more orange!)

### iOS-Specific Optimizations:

- **Safe area insets** for notch/island support
- **Prevents pull-to-refresh** for better swipe experience
- **No text selection** except in inputs (more native feel)
- **Black translucent status bar** for immersive design
- **Viewport fit cover** for full-screen display

## 🎨 Theme Colors

- **Primary:** Purple (#8b5cf6)
- **Accent:** Light Purple (#a78bfa)
- **Background:** Cream (#faf9f7)

## 🔧 Technical Details

This is a Progressive Web App (PWA) built with:
- React + Vite
- React Router for navigation
- Service Worker for offline support
- Web App Manifest for installation
- iOS-specific meta tags for native feel

---

**Note:** This works best in Safari on iOS. Chrome and other browsers on iOS have limited PWA support due to Apple restrictions.
