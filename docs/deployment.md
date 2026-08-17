# Companion Ride — Deployment & Production Guide

This guide outlines step-by-step instructions for deploying all three components of the Companion Ride platform:

1. **Mobile Application** (Android APK / AAB via Expo & EAS)
2. **Backend & Database** (Supabase PostgreSQL + PostGIS)
3. **Landing Website** (Vercel Next.js)

---

## 1. Supabase Database Deployment

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Database > Extensions** and enable `postgis` and `uuid-ossp`.
3. Go to the **SQL Editor** and run the initial migration:
   ```sql
   -- Copy and paste content of supabase/migrations/20240101000000_initial_schema.sql
   ```
4. Optionally run the seed data for testing:
   ```sql
   -- Copy and paste content of supabase/seed.sql
   ```
5. Retrieve your project URL and public anon key from **Project Settings > API**.

---

## 2. Mobile Application Build (Android APK / AAB)

### Prerequisites
- Node.js 18+
- EAS CLI installed globally (`npm install -g eas-cli`)

### Local Testing & Expo Go
```bash
# Install dependencies
npm install

# Start local bundler
npm start

# Run on Android emulator / physical device with Expo Go
npm run android
```

### Building Android Release APK
```bash
# Log in to Expo Application Services
eas login

# Configure project
eas build:configure

# Build standalone Android APK for direct testing / installation
eas build --platform android --profile preview

# Build production Android App Bundle (.aab) for Google Play Console
eas build --platform android --profile production
```

---

## 3. Landing Website Deployment (Vercel)

### Local Development
```bash
cd website
npm install
npm run dev
```

### Deploying to Vercel
1. Push this repository to GitHub/GitLab.
2. Go to [vercel.com](https://vercel.com/new).
3. Import the repository and set the **Root Directory** to `website`.
4. Deploy! Next.js App Router will generate optimized static assets, robots.txt, and sitemap.
