// Pure Supabase Matching Service with Spatial & Routing Engine

import { supabase } from '../lib/supabase';
import { RideSearchResult, SearchFilters, Ride } from '../types';
import { 
  calculateDistanceMeters, 
  calculateDirectionSimilarity, 
  calculateCompatibilityScore 
} from '../utils/calculations';
import { AppConfig } from '../constants/config';

export async function searchMatchingRides(
  filters: SearchFilters,
  currentUserId?: string
): Promise<RideSearchResult[]> {
  const {
    pickup,
    destination,
    departureTime,
    seatsNeeded = 1,
    pickupRadiusKm = AppConfig.matching.defaultPickupRadiusKm,
    destRadiusKm = AppConfig.matching.defaultDestRadiusKm,
    timeWindowMinutes = AppConfig.matching.defaultTimeWindowMinutes,
  } = filters;

  // 1. Try PostgreSQL PostGIS RPC if created
  try {
    const { data, error } = await supabase.rpc('find_matching_rides', {
      p_pickup_lat: pickup.latitude,
      p_pickup_lng: pickup.longitude,
      p_dest_lat: destination.latitude,
      p_dest_lng: destination.longitude,
      p_departure_time: departureTime.toISOString(),
      p_seats_needed: seatsNeeded,
      p_pickup_radius_km: pickupRadiusKm,
      p_dest_radius_km: destRadiusKm,
      p_time_window_minutes: timeWindowMinutes,
      p_user_id: currentUserId || null,
    });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((r: any) => ({
        id: r.r_id,
        creator_id: r.r_creator_id,
        creator_name: r.r_creator_name,
        creator_avatar: r.r_creator_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        creator_rating: Number(r.r_creator_rating) || 5.0,
        creator_total_ratings: Number(r.r_creator_total_ratings) || 0,
        creator_is_verified: Boolean(r.r_creator_is_verified),
        pickup_name: r.r_pickup_name,
        pickup_lat: r.r_pickup_lat,
        pickup_lng: r.r_pickup_lng,
        destination_name: r.r_destination_name,
        destination_lat: r.r_destination_lat,
        destination_lng: r.r_destination_lng,
        departure_time: r.r_departure_time,
        available_seats: r.r_available_seats,
        total_seats: r.r_total_seats,
        ride_type: r.r_ride_type,
        contribution_amount: Number(r.r_contribution_amount) || 0,
        notes: r.r_notes,
        vehicle_info: r.r_vehicle_info,
        status: r.r_status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        pickup_distance_meters: r.p_dist,
        dest_distance_meters: r.d_dist,
        time_diff_minutes: r.t_diff,
        compatibility_score: Number(r.compatibility_score) || 80,
      }));
    }
  } catch (e) {
    console.warn('RPC matching check, querying direct Supabase table:', e);
  }

  // 2. Direct Supabase Query with client-side Spatial Geometry Engine
  let candidateRides: Ride[] = [];
  try {
    const { data, error } = await supabase
      .from('rides')
      .select('*, creator:profiles(*)')
      .eq('status', 'active');

    if (!error && data) {
      candidateRides = data as Ride[];
    }
  } catch (e) {
    console.warn('Error querying Supabase rides table:', e);
  }

  const results: RideSearchResult[] = [];

  for (const ride of candidateRides) {
    if (ride.status !== 'active') continue;
    if (ride.available_seats < seatsNeeded) continue;
    if (currentUserId && ride.creator_id === currentUserId) continue;

    // 1. Pickup Spherical Distance
    const pDist = calculateDistanceMeters(
      ride.pickup_lat,
      ride.pickup_lng,
      pickup.latitude,
      pickup.longitude
    );

    // 2. Destination Spherical Distance
    const dDist = calculateDistanceMeters(
      ride.destination_lat,
      ride.destination_lng,
      destination.latitude,
      destination.longitude
    );

    // 3. Departure Time Difference (minutes)
    const rideTime = new Date(ride.departure_time).getTime();
    const filterTime = departureTime.getTime();
    const tDiff = Math.abs(rideTime - filterTime) / (60 * 1000);

    // Filter thresholds
    if (pDist > pickupRadiusKm * 1000) continue;
    if (dDist > destRadiusKm * 1000) continue;
    if (tDiff > timeWindowMinutes) continue;

    // 4. Directional Bearing Cosine Similarity
    const dirSim = calculateDirectionSimilarity(
      { lat: ride.pickup_lat, lng: ride.pickup_lng },
      { lat: ride.destination_lat, lng: ride.destination_lng },
      { lat: pickup.latitude, lng: pickup.longitude },
      { lat: destination.latitude, lng: destination.longitude }
    );

    if (dirSim < 0.1) continue;

    // 5. Total Compatibility Score
    const score = calculateCompatibilityScore({
      pickupDistanceMeters: pDist,
      destDistanceMeters: dDist,
      timeDiffMinutes: tDiff,
      pickupRadiusKm,
      destRadiusKm,
      timeWindowMinutes,
      directionSimilarity: dirSim,
    });

    results.push({
      ...ride,
      creator_name: ride.creator?.full_name || 'Driver',
      creator_avatar: ride.creator?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      creator_rating: ride.creator?.rating || 5.0,
      creator_total_ratings: ride.creator?.total_ratings || 0,
      creator_is_verified: ride.creator?.is_identity_verified ?? false,
      pickup_distance_meters: pDist,
      dest_distance_meters: dDist,
      time_diff_minutes: tDiff,
      compatibility_score: score,
    });
  }

  // Sort by highest compatibility score descending, then closest pickup
  return results.sort((a, b) => (b.compatibility_score || 0) - (a.compatibility_score || 0));
}
