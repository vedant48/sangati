# 🚗 Companion Ride — Location-based Ride Companion & Carpooling

> *"Find someone who is already going your way."*

Companion Ride is a production-ready, location-based carpooling and companion ride application. Instead of commercial taxi booking, it empowers everyday commuters who are already travelling from Point A to Point B to share their journeys, split fuel or cab expenses, reduce road congestion, and travel in a verified, community-driven ecosystem.

---

## ✨ Key Features

- **🎯 PostGIS Spatial Matching**: Evaluates Pickup Proximity (30%), Destination Proximity (30%), Departure Time Window (20%), and Directional Bearing Cosine Similarity (20%) to rank compatible corridor journeys.
- **⚡ Instant Discovery & Join Requests**: A $\rightarrow$ B search with live geocoding, seat reservation state machine, and driver request management.
- **💬 Realtime 1-on-1 Chat**: Private Supabase Realtime messaging between confirmed companions.
- **🛡️ First-Class Safety Hub**: Emergency SOS (112 universal & 1091 women helpline), live trip sharing via OS share sheets, phone & ID verification badges, reporting, and blocking.
- **🌟 Reputation & Rating System**: Automated trigger-based post-ride ratings preventing self-ratings and recalculating user reputation.
- **🎨 Premium Light Theme UI**: Strictly designed light palette (`#F8FAFC`, `#FFFFFF`, `#101828`, AI Blue `#2563EB`, AI Violet `#7C3AED`, Commerce Teal `#14B8A6`, Light Slate `#E2E8F0`).
- **🌐 Responsive Landing Site**: Next.js 14 App Router + Tailwind CSS landing website with interactive corridor preview, SEO meta tags, sitemap, and robots.txt.

---

## 🏗️ Architecture & Tech Stack

```
companion-ride/
├── src/                    # React Native / Expo Mobile Application
│   ├── components/         # Reusable UI & Safety widgets
│   ├── constants/          # Light design tokens & config
│   ├── context/            # Auth, Ride, & Notification context providers
│   ├── lib/                # Supabase & Geocoding clients
│   ├── navigation/         # React Navigation stack & bottom tabs
│   ├── screens/            # Auth, Home, Search, Offer, Trips, Chat, Profile
│   ├── services/           # PostGIS Matching, Ride, Chat, Safety services
│   ├── types/              # Full TypeScript schema & interfaces
│   └── utils/              # Haversine, Bearing similarity, Validation
├── supabase/
│   ├── migrations/         # PostgreSQL schema with PostGIS RPC & RLS
│   └── seed.sql            # Realistic corridor seed data
├── website/                # Next.js 14 + Tailwind CSS Landing Website
├── docs/                   # Full Technical Documentation
│   ├── architecture.md     # Subsystem diagrams & data flow
│   ├── database.md         # Full schema, triggers & RLS policies
│   ├── matching.md         # Mathematical formula & spatial queries
│   └── deployment.md       # Android EAS & Vercel deployment guides
└── __tests__/              # Jest automated test suite
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Mobile application dependencies
npm install

# Landing website dependencies
cd website && npm install && cd ..
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Mobile App Locally
```bash
npm start
# Press 'a' for Android, 'w' for Web, or scan the QR code with Expo Go
```

### 4. Run Automated Tests
```bash
npm test
```

### 5. Run Landing Website
```bash
npm run website:dev
# Open http://localhost:3000 in your browser
```

---

## 🧪 Testing Suite Coverage

- **Distance & Spatial Spherical Trig**: Haversine distance accuracy.
- **Directional Bearing Cosine Similarity**: Same-direction vs opposing vector classification.
- **Multi-Factor Score Calculation**: 30% Pickup + 30% Drop + 20% Time + 20% Vector Direction.
- **Seat Management & State Machine**: Overbooking prevention, pending $\rightarrow$ accepted transitions.
- **Safety & Moderation**: Self-rating prevention, blocked user exclusion from matching.
- **Input Validation**: Coordinate validation, future departure time checks, email/phone format checks.

---

## 📱 Android Build (APK & AAB)

```bash
# Build standalone test APK
eas build --platform android --profile preview

# Build production Google Play AAB bundle
eas build --platform android --profile production
```

---

## 📄 License & Credits

Built with precision for Companion Ride. Community carpooling that respects safety, simplicity, and efficiency.
