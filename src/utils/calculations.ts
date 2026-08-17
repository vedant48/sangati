// Mathematical & Spatial Calculations for Companion Ride

/**
 * Calculates Great-Circle spherical distance between two coordinates in meters (Haversine formula).
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Computes the 2D directional cosine similarity between driver's trajectory vector and passenger's trajectory vector.
 * Returns value between -1.0 (opposite direction) and +1.0 (exact same direction).
 */
export function calculateDirectionSimilarity(
  driverPickup: { lat: number; lng: number },
  driverDest: { lat: number; lng: number },
  passengerPickup: { lat: number; lng: number },
  passengerDest: { lat: number; lng: number }
): number {
  const v1_x = driverDest.lng - driverPickup.lng;
  const v1_y = driverDest.lat - driverPickup.lat;
  const v2_x = passengerDest.lng - passengerPickup.lng;
  const v2_y = passengerDest.lat - passengerPickup.lat;

  const mag1 = Math.sqrt(v1_x * v1_x + v1_y * v1_y);
  const mag2 = Math.sqrt(v2_x * v2_x + v2_y * v2_y);

  if (mag1 === 0 || mag2 === 0) {
    return 1.0;
  }

  const dot = v1_x * v2_x + v1_y * v2_y;
  const cosSim = dot / (mag1 * mag2);
  return Math.max(-1.0, Math.min(1.0, cosSim));
}

/**
 * Calculates complete multi-factor route compatibility score (0 - 100%).
 * 
 * Weights:
 * - Pickup proximity: 30%
 * - Destination proximity: 30%
 * - Departure time window: 20%
 * - Route direction similarity: 20%
 */
export function calculateCompatibilityScore({
  pickupDistanceMeters,
  destDistanceMeters,
  timeDiffMinutes,
  pickupRadiusKm = 2.0,
  destRadiusKm = 3.0,
  timeWindowMinutes = 30,
  directionSimilarity = 1.0,
}: {
  pickupDistanceMeters: number;
  destDistanceMeters: number;
  timeDiffMinutes: number;
  pickupRadiusKm?: number;
  destRadiusKm?: number;
  timeWindowMinutes?: number;
  directionSimilarity?: number;
}): number {
  const maxPickupMeters = pickupRadiusKm * 1000;
  const maxDestMeters = destRadiusKm * 1000;

  // 1. Pickup Proximity (30 points max)
  const pickupRatio = Math.max(0, 1 - pickupDistanceMeters / maxPickupMeters);
  const pickupScore = pickupRatio * 30;

  // 2. Destination Proximity (30 points max)
  const destRatio = Math.max(0, 1 - destDistanceMeters / maxDestMeters);
  const destScore = destRatio * 30;

  // 3. Departure Time Similarity (20 points max)
  const timeRatio = Math.max(0, 1 - timeDiffMinutes / timeWindowMinutes);
  const timeScore = timeRatio * 20;

  // 4. Direction Alignment (20 points max) - mapped from [-1, 1] to [0, 1]
  const normalizedDirection = Math.max(0, (directionSimilarity + 1) / 2);
  const directionScore = normalizedDirection * 20;

  const totalScore = Math.round(pickupScore + destScore + timeScore + directionScore);
  return Math.min(100, Math.max(0, totalScore));
}

/**
 * Formats distance into human-readable string (meters or km).
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
