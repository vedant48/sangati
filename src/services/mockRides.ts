// Mock rides repository for local development and offline simulation

import { Ride } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_RIDES_STORAGE_KEY = '@companion_ride_local_rides';

export const INITIAL_SEEDED_RIDES: Ride[] = [
  {
    id: 'aaaa1111-1111-1111-1111-111111111111',
    creator_id: '11111111-1111-1111-1111-111111111111',
    creator: {
      id: '11111111-1111-1111-1111-111111111111',
      full_name: 'Rahul Kumar',
      username: 'rahulk',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      phone: '+91 9876543210',
      bio: 'Daily tech commuter. Quiet rides, punctual, fond of classic rock.',
      gender: 'male',
      rating: 4.90,
      total_ratings: 24,
      total_trips: 38,
      is_phone_verified: true,
      is_identity_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    pickup_name: 'Mithapur Bus Stand, Patna',
    pickup_lat: 25.5941,
    pickup_lng: 85.1376,
    destination_name: 'Patna Junction Railway Station',
    destination_lat: 25.6022,
    destination_lng: 85.1370,
    departure_time: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    available_seats: 2,
    total_seats: 3,
    ride_type: 'free',
    contribution_amount: 0,
    notes: 'Leaving on time from Mithapur gate 2. Clean sedan.',
    vehicle_info: 'White Honda City (BR-01-AB-1234)',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'aaaa2222-2222-2222-2222-222222222222',
    creator_id: '22222222-2222-2222-2222-222222222222',
    creator: {
      id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Priya Sharma',
      username: 'priyas',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      phone: '+91 9812345678',
      bio: 'Design enthusiast traveling between tech hubs. Happy to share fuel costs!',
      gender: 'female',
      rating: 4.85,
      total_ratings: 18,
      total_trips: 29,
      is_phone_verified: true,
      is_identity_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    pickup_name: '100ft Road, Indiranagar, Bangalore',
    pickup_lat: 12.9784,
    pickup_lng: 77.6408,
    destination_name: 'ITPL Main Gate, Whitefield, Bangalore',
    destination_lat: 12.9866,
    destination_lng: 77.7376,
    departure_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    available_seats: 2,
    total_seats: 3,
    ride_type: 'fuel_sharing',
    contribution_amount: 80,
    notes: 'AC on, smooth drive via Old Airport Road. Non-smokers preferred.',
    vehicle_info: 'Silver Hyundai i20 (KA-03-MN-5678)',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'aaaa3333-3333-3333-3333-333333333333',
    creator_id: '33333333-3333-3333-3333-333333333333',
    creator: {
      id: '33333333-3333-3333-3333-333333333333',
      full_name: 'Ananya Singh',
      username: 'ananyas',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      phone: '+91 9870001122',
      bio: 'Medical intern. Friendly and strictly safety-conscious.',
      gender: 'female',
      rating: 4.95,
      total_ratings: 31,
      total_trips: 45,
      is_phone_verified: true,
      is_identity_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    pickup_name: 'Connaught Place Inner Circle, Delhi',
    pickup_lat: 28.6315,
    pickup_lng: 77.2167,
    destination_name: 'Cyber Hub, DLF Cyber City, Gurgaon',
    destination_lat: 28.4950,
    destination_lng: 77.0895,
    departure_time: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
    available_seats: 3,
    total_seats: 4,
    ride_type: 'fuel_sharing',
    contribution_amount: 120,
    notes: 'Daily office commute. Fastag enabled, toll split included.',
    vehicle_info: 'Blue Maruti Baleno (DL-8C-XY-9012)',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'aaaa4444-4444-4444-4444-444444444444',
    creator_id: '44444444-4444-4444-4444-444444444444',
    creator: {
      id: '44444444-4444-4444-4444-444444444444',
      full_name: 'Arjun Mehta',
      username: 'arjunm',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      phone: '+91 9900112233',
      bio: 'Finance professional. Daily commute with AC car.',
      gender: 'male',
      rating: 4.75,
      total_ratings: 12,
      total_trips: 19,
      is_phone_verified: true,
      is_identity_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    pickup_name: 'Dadar TT Circle, Mumbai',
    pickup_lat: 19.0178,
    pickup_lng: 72.8478,
    destination_name: 'Bandra Kurla Complex (BKC), Mumbai',
    destination_lat: 19.0657,
    destination_lng: 72.8686,
    departure_time: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    available_seats: 1,
    total_seats: 2,
    ride_type: 'cab_sharing',
    contribution_amount: 60,
    notes: 'Taking Uber Premier, sharing fare equally.',
    vehicle_info: 'Uber Cab (MH-01-CZ-4433)',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export async function getMockRides(): Promise<Ride[]> {
  try {
    const json = await AsyncStorage.getItem(MOCK_RIDES_STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // fallback
  }
  return INITIAL_SEEDED_RIDES;
}

export async function saveMockRide(ride: Ride): Promise<void> {
  const current = await getMockRides();
  const updated = [ride, ...current];
  await AsyncStorage.setItem(MOCK_RIDES_STORAGE_KEY, JSON.stringify(updated));
}
