// Pure Supabase Ride Management Service

import { supabase } from '../lib/supabase';
import { Ride, RideRequest, Match, RideType } from '../types';

export async function createRide(params: {
  creatorId: string;
  pickupName: string;
  pickupLat: number;
  pickupLng: number;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  departureTime: Date;
  availableSeats: number;
  totalSeats: number;
  rideType: RideType;
  contributionAmount: number;
  notes?: string;
  vehicleInfo?: string;
}): Promise<Ride> {
  const { data, error } = await supabase
    .from('rides')
    .insert({
      creator_id: params.creatorId,
      pickup_name: params.pickupName,
      pickup_lat: params.pickupLat,
      pickup_lng: params.pickupLng,
      destination_name: params.destinationName,
      destination_lat: params.destinationLat,
      destination_lng: params.destinationLng,
      departure_time: params.departureTime.toISOString(),
      available_seats: params.availableSeats,
      total_seats: params.totalSeats,
      ride_type: params.rideType,
      contribution_amount: params.contributionAmount,
      notes: params.notes,
      vehicle_info: params.vehicleInfo,
      status: 'active',
    })
    .select('*, creator:profiles(*)')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Ride;
}

export async function getActiveRides(limit: number = 10): Promise<Ride[]> {
  const { data, error } = await supabase
    .from('rides')
    .select('*, creator:profiles(*)')
    .eq('status', 'active')
    .gte('departure_time', new Date().toISOString())
    .order('departure_time', { ascending: true })
    .limit(limit);

  if (error) {
    console.warn('Error fetching active rides:', error.message);
    return [];
  }

  return (data || []) as Ride[];
}

export async function getRideById(rideId: string): Promise<Ride | null> {
  const { data, error } = await supabase
    .from('rides')
    .select('*, creator:profiles(*)')
    .eq('id', rideId)
    .maybeSingle();

  if (error) {
    console.warn('Error fetching ride by ID:', error.message);
    return null;
  }

  return data as Ride | null;
}

export async function requestToJoinRide(params: {
  rideId: string;
  passengerId: string;
  seatsRequested: number;
  message?: string;
}): Promise<RideRequest> {
  // Check if existing pending request exists
  const { data: existing } = await supabase
    .from('ride_requests')
    .select('id')
    .eq('ride_id', params.rideId)
    .eq('passenger_id', params.passengerId)
    .eq('status', 'pending')
    .maybeSingle();

  if (existing) {
    throw new Error('You already have a pending request for this ride.');
  }

  const { data, error } = await supabase
    .from('ride_requests')
    .insert({
      ride_id: params.rideId,
      passenger_id: params.passengerId,
      seats_requested: params.seatsRequested,
      message: params.message,
      status: 'pending',
    })
    .select('*, passenger:profiles(*), ride:rides(*)')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as RideRequest;
}

export async function getDriverIncomingRequests(driverId: string): Promise<RideRequest[]> {
  const { data: driverRides, error: ridesErr } = await supabase
    .from('rides')
    .select('id')
    .eq('creator_id', driverId);

  if (ridesErr || !driverRides || driverRides.length === 0) {
    return [];
  }

  const rideIds = driverRides.map((r) => r.id);

  const { data, error } = await supabase
    .from('ride_requests')
    .select('*, passenger:profiles(*), ride:rides(*)')
    .in('ride_id', rideIds)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Error fetching driver requests:', error.message);
    return [];
  }

  return (data || []) as RideRequest[];
}

export async function acceptRideRequest(requestId: string, driverId: string): Promise<Match> {
  // 1. Get request
  const { data: request, error: reqErr } = await supabase
    .from('ride_requests')
    .select('*, ride:rides(*)')
    .eq('id', requestId)
    .single();

  if (reqErr || !request) {
    throw new Error('Request not found.');
  }

  const ride = request.ride;
  if (ride.available_seats < request.seats_requested) {
    throw new Error('Not enough available seats left on this ride.');
  }

  // 2. Update request status to accepted
  await supabase
    .from('ride_requests')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', requestId);

  // 3. Decrement available seats
  const newSeats = Math.max(0, ride.available_seats - request.seats_requested);
  await supabase
    .from('rides')
    .update({
      available_seats: newSeats,
      status: newSeats === 0 ? 'full' : ride.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', ride.id);

  // 4. Create match record
  const { data: match, error: matchErr } = await supabase
    .from('matches')
    .insert({
      ride_id: ride.id,
      driver_id: driverId,
      passenger_id: request.passenger_id,
      request_id: requestId,
      status: 'active',
    })
    .select('*, ride:rides(*), driver:profiles!driver_id(*), passenger:profiles!passenger_id(*)')
    .single();

  if (matchErr) {
    throw new Error(matchErr.message);
  }

  return match as Match;
}

export async function rejectRideRequest(requestId: string): Promise<void> {
  const { error } = await supabase
    .from('ride_requests')
    .update({ status: 'rejected', updated_at: new Date().toISOString() })
    .eq('id', requestId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getUserMatches(userId: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*, ride:rides(*), driver:profiles!driver_id(*), passenger:profiles!passenger_id(*)')
    .or(`driver_id.eq.${userId},passenger_id.eq.${userId}`)
    .order('matched_at', { ascending: false });

  if (error) {
    console.warn('Error fetching user matches:', error.message);
    return [];
  }

  return (data || []) as Match[];
}

export async function updateRideStatus(rideId: string, status: Ride['status']): Promise<void> {
  const { error } = await supabase
    .from('rides')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', rideId);

  if (error) {
    throw new Error(error.message);
  }
}
