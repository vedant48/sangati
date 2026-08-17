# Companion Ride — System Architecture

## 1. High-Level Architecture Overview

Companion Ride is architected around a modern decoupled client-server model:

```
┌────────────────────────────────────────────────────────────┐
│                    Client Applications                     │
│  ┌──────────────────────────────┐  ┌────────────────────┐  │
│  │ React Native (Expo) Mobile   │  │ Next.js 14 Web     │  │
│  │ (Android APK / iOS / Web)    │  │ Landing Website    │  │
│  └──────────────┬───────────────┘  └────────────────────┘  │
└─────────────────┼──────────────────────────────────────────┘
                  │
                  ▼ HTTPS / WebSockets (WSS)
┌────────────────────────────────────────────────────────────┐
│               Supabase Backend Platform                    │
│  ┌─────────────────┐ ┌──────────────────┐ ┌──────────────┐ │
│  │ GoTrue Auth     │ │ Realtime Engine  │ │ Storage      │ │
│  │ (Email/OAuth)   │ │ (1-on-1 Messages)│ │ (Avatars)    │ │
│  └────────┬────────┘ └────────┬─────────┘ └──────────────┘ │
│           │                   │                            │
│           ▼                   ▼                            │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ PostgreSQL 15+ with PostGIS Spatial Engine            │ │
│  │                                                       │ │
│  │ - Spatial Spherical Indexing (GIST)                   │ │
│  │ - find_matching_rides() Custom RPC Stored Procedure   │ │
│  │ - Automated Triggers (Rating sync, Seats management)  │ │
│  │ - Row Level Security (RLS) Policies                   │ │
│  └───────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

---

## 2. Core Subsystems

### A. Mobile Application (React Native + Expo)
- **Framework**: React Native 0.74 with Expo SDK 51.
- **Strict Light Theme Design System**: Backgrounds (`#F8FAFC`, `#FFFFFF`), Text (`#101828`), Accents (AI Blue `#2563EB`, AI Violet `#7C3AED`, Commerce Teal `#14B8A6`, Light Slate `#E2E8F0`).
- **Navigation Architecture**: React Navigation v6 with typed `NativeStackNavigator` wrapping a 5-tab `BottomTabNavigator` (`Home`, `Explore`, `Trips`, `Messages`, `Profile`).
- **State Management**: Minimal React Context with cached asynchronous persistence via `@react-native-async-storage/async-storage`.
- **Maps & Geocoding**: Interactive OpenStreetMap / Leaflet tile rendering within WebView, coupled with Nominatim geocoding.

### B. Database & Spatial Matching (Supabase + PostGIS)
- PostgreSQL relational tables with UUID primary keys and foreign key constraints.
- Generated PostGIS point geometry columns (`pickup_geom`, `destination_geom`) with GIST spatial indexing.
- Direct spatial RPC function `find_matching_rides` for sub-100ms multi-factor corridor calculations.

### C. Realtime Messaging & In-App Alerts
- Supabase Realtime WebSocket subscriptions on PostgreSQL write-ahead logs (`INSERT` on `public.messages` where `match_id = eq.X`).
- Driver join request alerts and post-match event listeners.

### D. Safety & Moderation Layer
- Multi-tier verification indicators (Phone verified, Identity verified).
- Direct OS dialing integration to 112 (Universal Emergency) and 1091 (Women Safety).
- Native OS Share Sheet integration for real-time trip status sharing.
- User blocking with automated exclusion from spatial matching RPC results.
