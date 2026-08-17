# Companion Ride — Spatial Matching Algorithm & Mathematical Formulation

## 1. Overview

Companion Ride does not perform plain text matching or naive boundary queries. Instead, it utilizes high-precision spherical trigonometry and directional vector cosine similarity powered by PostgreSQL + PostGIS.

---

## 2. Multi-Factor Compatibility Formula

Each journey candidate is evaluated across **4 weighted factors**:

$$\text{Total Score} = S_{\text{pickup}} + S_{\text{destination}} + S_{\text{time}} + S_{\text{direction}}$$

```
┌────────────────────────────────────────────────────────┐
│ Factor                  Weight  Formula                │
├────────────────────────────────────────────────────────┤
│ 1. Pickup Proximity      30%    (1 - d_p / R_p) * 30   │
│ 2. Destination Proximity 30%    (1 - d_d / R_d) * 30   │
│ 3. Departure Time Window 20%    (1 - Δt / W_t) * 20    │
│ 4. Route Direction Align 20%    ((cos θ + 1) / 2) * 20 │
└────────────────────────────────────────────────────────┘
```

Where:
- $d_p$: Great-circle distance between passenger pickup and driver pickup (meters)
- $R_p$: Configurable pickup radius (default: $2.0\text{ km} = 2000\text{ m}$)
- $d_d$: Great-circle distance between passenger destination and driver destination (meters)
- $R_d$: Configurable destination radius (default: $3.0\text{ km} = 3000\text{ m}$)
- $\Delta t$: Absolute departure time difference in minutes
- $W_t$: Configurable departure time window (default: $\pm 30\text{ minutes}$)
- $\cos \theta$: 2D directional vector cosine similarity

---

## 3. Directional Bearing Cosine Similarity

Two journeys starting nearby might move in completely opposite directions. To prevent false positives, we compute the directional cosine similarity between the driver trajectory vector $\vec{v}_1$ and passenger trajectory vector $\vec{v}_2$:

$$\vec{v}_1 = \langle \text{dest\_lng}_1 - \text{pickup\_lng}_1,\; \text{dest\_lat}_1 - \text{pickup\_lat}_1 \rangle$$
$$\vec{v}_2 = \langle \text{dest\_lng}_2 - \text{pickup\_lng}_2,\; \text{dest\_lat}_2 - \text{pickup\_lat}_2 \rangle$$

$$\cos \theta = \frac{\vec{v}_1 \cdot \vec{v}_2}{\|\vec{v}_1\| \|\vec{v}_2\|} = \frac{(v_{1x} v_{2x}) + (v_{1y} v_{2y})}{\sqrt{v_{1x}^2 + v_{1y}^2} \sqrt{v_{2x}^2 + v_{2y}^2}}$$

- $\cos \theta \ge 0.85$: Parallel same direction (high alignment).
- $\cos \theta \approx 0.0$: Perpendicular trajectory.
- $\cos \theta < 0.0$: Opposing directions (automatically excluded from results).

---

## 4. PostGIS Database Function (RPC)

Executed directly in PostgreSQL via `find_matching_rides(...)`:

```sql
SELECT * FROM find_matching_rides(
    p_pickup_lat := 12.9784,
    p_pickup_lng := 77.6408,
    p_dest_lat := 12.9866,
    p_dest_lng := 77.7376,
    p_departure_time := '2026-08-17T21:30:00Z',
    p_seats_needed := 1,
    p_pickup_radius_km := 3.0,
    p_dest_radius_km := 4.0,
    p_time_window_minutes := 60,
    p_user_id := 'auth-user-uuid'
);
```

This returns all matching candidates sorted by `compatibility_score DESC`.
