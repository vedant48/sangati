# Companion Ride — Database Schema & Security Specification

Companion Ride utilizes Supabase PostgreSQL with the **PostGIS** spatial extension.

---

## 1. Relational Schema Summary

| Table | Primary Key | Description | Key Relationships |
|---|---|---|---|
| `public.profiles` | `id` (UUID) | User profiles, reputation, safety verification | FK to `auth.users(id)` |
| `public.rides` | `id` (UUID) | Journey listings with PostGIS geometries | FK `creator_id` to `profiles(id)` |
| `public.ride_requests` | `id` (UUID) | Passenger join requests & requested seats | FKs to `rides(id)`, `profiles(id)` |
| `public.matches` | `id` (UUID) | Confirmed journey matches between driver & passenger | FKs to `rides`, `profiles` |
| `public.messages` | `id` (UUID) | 1-on-1 private messages for confirmed matches | FKs to `matches(id)`, `profiles(id)` |
| `public.ratings` | `id` (UUID) | Post-ride 1-5 star reviews & reputation updates | FKs to `rides(id)`, `profiles(id)` |
| `public.reports` | `id` (UUID) | User misconduct and safety incident reports | FKs to `profiles(id)`, `rides(id)` |
| `public.blocked_users` | `id` (UUID) | User blocking relationship (excludes from matching) | FKs to `profiles(id)` |
| `public.notifications` | `id` (UUID) | In-app alerts, request status updates, trip reminders | FK to `profiles(id)` |
| `public.device_tokens` | `id` (UUID) | Push notification tokens for mobile devices | FK to `profiles(id)` |

---

## 2. Spatial PostGIS Columns & GIST Indexing

The `rides` table utilizes generated spatial columns stored as WGS84 Point geometries:

```sql
pickup_geom GEOMETRY(Point, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(pickup_lng, pickup_lat), 4326)
) STORED;

destination_geom GEOMETRY(Point, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(destination_lng, destination_lat), 4326)
) STORED;

CREATE INDEX idx_rides_pickup_geom ON public.rides USING GIST (pickup_geom);
CREATE INDEX idx_rides_dest_geom ON public.rides USING GIST (destination_geom);
```

---

## 3. Database Triggers & Automations

1. **Auto Profile Initialization on Signup**:
   `on_auth_user_created` trigger inserts a new profile row on `auth.users` creation.
2. **Reputation Recalculation**:
   `on_rating_added` trigger recalculates `rating` and `total_ratings` on `public.profiles` automatically when a review is submitted.
3. **Timestamp Sync**:
   `update_*_modtime` triggers update `updated_at` timestamps on row modification.

---

## 4. Row Level Security (RLS) Rules

- **Profiles**: Viewable publicly, editable only by owning user (`auth.uid() = id`).
- **Rides**: Active rides viewable by authenticated users; modifications restricted to ride creator (`auth.uid() = creator_id`).
- **Requests**: Viewable only by the passenger who created the request and the driver who owns the ride.
- **Matches & Messages**: Viewable and insertable only by matched driver and passenger (`auth.uid() = driver_id OR auth.uid() = passenger_id`).
- **Ratings**: Rated trips restricted to verified participants with self-rating constraints (`from_user_id <> to_user_id`).
- **Blocked Users**: Private to the blocker (`auth.uid() = blocker_id`).
