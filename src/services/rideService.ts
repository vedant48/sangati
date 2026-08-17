// Ride Management Service

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Ride, RideRequest, Match, RideType } from '../types';
import { saveMockRide, getMockRides } from './mockRides';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_DEMO_USER } from './authService';

const MOCK_REQUESTS_KEY = '@companion_ride_mock_requests';
const MOCK_MATCHES_KEY = '@companion_ride_mock_matches';

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
  const newRide: Ride = {
    id: `ride_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
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

    if (error) throw error;
    return data as Ride;
  }

  await saveMockRide(newRide);
  return newRide;
}

export async function getRideById(rideId: string): Promise<Ride | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('rides')
      .select('*, creator:profiles(*)')
      .eq('id', rideId)
      .single();

    if (error) return null;
    return data as Ride;
  }

  const rides = await getMockRides();
  return rides.find((r) => r.id === rideId) || null;
}

export async function requestToJoinRide(params: {
  rideId: string;
  passengerId: string;
  seatsRequested: number;
  message?: string;
}): Promise<RideRequest> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('ride_requests')
      .insert({
        ride_id: params.rideId,
        passenger_id: params.passengerId,
        seats_requested: params.seatsRequested,
        message: params.message,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data as RideRequest;
  }

  // Local Mock Flow
  const cachedRequests = await getMockRequests();
  const existingPending = cachedRequests.find(
    (r) => r.ride_id === params.rideId && r.passenger_id === params.passengerId && r.status === 'pending'
  );
  if (existingPending) {
    throw new Error('You already have a pending request for this journey.');
  }

  const newRequest: RideRequest = {
    id: `req_${Date.now()}`,
    ride_id: params.rideId,
    passenger_id: params.passengerId,
    passenger: DEFAULT_DEMO_USER,
    seats_requested: params.seatsRequested,
    message: params.message,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  await AsyncStorage.setItem(
    MOCK_REQUESTS_KEY,
    JSON.stringify([newRequest, ...cachedRequests])
  );
  return newRequest;
}

export async function getDriverIncomingRequests(driverId: string): Promise<RideRequest[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('ride_requests')
      .select('*, passenger:profiles(*), ride:rides(*)')
      .eq('rides.creator_id', driverId)
      .eq('status', 'pending');

    if (error) return [];
    return data as RideRequest[];
  }

  const allRequests = await getMockRequests();
  return allRequests.filter((r) => r.status === 'pending');
}

export async function acceptRideRequest(requestId: string, driverId: string): Promise<Match> {
  if (isSupabaseConfigured) {
    // 1. Get request
    const { data: request, error: reqErr } = await supabase
      .from('ride_requests')
      .select('*, ride:rides(*)')
      .eq('id', requestId)
      .single();
    if (reqErr || !request) throw new Error('Request not found');

    const ride = request.ride;
    if (ride.available_seats < request.seats_requested) {
      throw new Error('Not enough available seats left on this ride.');
    }

    // 2. Update request status
    await supabase
      .from('ride_requests')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', requestId);

    // 3. Decrement seats
    const newSeats = ride.available_seats - request.seats_requested;
    await supabase
      .from('rides')
      .update({
        available_seats: newSeats,
        status: newSeats === 0 ? 'full' : ride.status,
      })
      .eq('id', ride.id);

    // 4. Create match
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

    if (matchErr) throw matchErr;
    return match as Match;
  }

  // Local simulation
  const requests = await getMockRequests();
  const reqIndex = requests.findIndex((r) => r.id === requestId);
  if (reqIndex === -1) throw new Error('Request not found');

  const req = requests[reqIndex];
  req.status = 'accepted';
  await AsyncStorage.setItem(MOCK_REQUESTS_KEY, JSON.stringify(requests));

  const newMatch: Match = {
    id: `match_${Date.now()}`,
    ride_id: req.ride_id,
    driver_id: driverId,
    passenger_id: req.passenger_id,
    passenger: req.passenger || DEFAULT_DEMO_USER,
    status: 'active',
    matched_at: new Date().toISOString(),
  };

  const matches = await getMockMatches();
  await AsyncStorage.setItem(MOCK_MATCHES_KEY, JSON.stringify([newMatch, ...matches]));

  return newMatch;
}

export async function rejectRideRequest(requestId: string): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase
      .from('ride_requests')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', requestId);
    return;
  }

  const requests = await getMockRequests();
  const target = requests.find((r) => r.id === requestId);
  if (target) {
    target.status = 'rejected';
    await AsyncStorage.setItem(MOCK_REQUESTS_KEY, JSON.stringify(requests));
  }
}

export async function getUserMatches(userId: string): Promise<Match[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('matches')
      .select('*, ride:rides(*), driver:profiles!driver_id(*), passenger:profiles!passenger_id(*)')
      .or(`driver_id.eq.${userId},passenger_id.eq.${userId}`)
      .order('matched_at', { ascending: false });

    if (error) return [];
    return data as Match[];
  }

  return await getMockMatches();
}

export async function updateRideStatus(rideId: string, status: Ride['status']): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.from('rides').update({ status }).eq('id', rideId);
    return;
  }

  const rides = await getMockRides();
  const target = rides.find((r) => r.id === rideId);
  if (target) {
    target.status = status;
    await AsyncStorage.setItem('@companion_ride_local_rides', JSON.stringify(rides));
  }
}

async function getMockRequests(): Promise<RideRequest[]> {
  try {
    const json = await AsyncStorage.getItem(MOCK_REQUESTS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    return [];
  }
}

async function getMockMatches(): Promise<Match[]> {
  try {
    const json = await AsyncStorage.getItem(MOCK_MATCHES_KEY);
    if (json) return JSON.parse(json);
  } catch (e) {
    // fallback
  }

  return [
    {
      id: 'bbbb1111-1111-1111-1111-111111111111',
      ride_id: 'aaaa2222-2222-2222-2222-222222222222',
      driver_id: '22222222-2222-2222-2222-222222222222',
      driver: {
        id: '22222222-2222-2222-2222-222222222222',
        full_name: 'Priya Sharma',
        username: 'priyas',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        phone: '+91 9812345678',
        rating: 4.85,
        total_ratings: 18,
        total_trips: 29,
        is_phone_verified: true,
        is_identity_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      passenger_id: '11111111-1111-1111-1111-111111111111',
      passenger: DEFAULT_DEMO_USER,
      status: 'active',
      matched_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
  ];
}
