// TypeScript Types and Interfaces for Companion Ride

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type RideType = 'free' | 'fuel_sharing' | 'cab_sharing';

export type RideStatus = 'active' | 'full' | 'started' | 'completed' | 'cancelled' | 'expired';

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export type MatchStatus = 'active' | 'cancelled' | 'completed';

export type ReportReason = 
  | 'harassment'
  | 'unsafe_behavior'
  | 'fake_profile'
  | 'inappropriate_behavior'
  | 'scam'
  | 'other';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface Profile {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string | null;
  phone?: string | null;
  bio?: string | null;
  gender?: Gender | null;
  date_of_birth?: string | null;
  rating: number;
  total_ratings: number;
  total_trips: number;
  is_phone_verified: boolean;
  is_identity_verified: boolean;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Ride {
  id: string;
  creator_id: string;
  creator?: Profile;
  pickup_name: string;
  pickup_lat: number;
  pickup_lng: number;
  destination_name: string;
  destination_lat: number;
  destination_lng: number;
  departure_time: string;
  available_seats: number;
  total_seats: number;
  ride_type: RideType;
  contribution_amount: number;
  notes?: string | null;
  vehicle_info?: string | null;
  status: RideStatus;
  created_at: string;
  updated_at: string;
  // Computed fields from matching query
  compatibility_score?: number;
  pickup_distance_meters?: number;
  dest_distance_meters?: number;
  time_diff_minutes?: number;
}

export interface RideSearchResult extends Ride {
  creator_name: string;
  creator_avatar: string;
  creator_rating: number;
  creator_total_ratings: number;
  creator_is_verified: boolean;
}

export interface RideRequest {
  id: string;
  ride_id: string;
  ride?: Ride;
  passenger_id: string;
  passenger?: Profile;
  seats_requested: number;
  message?: string | null;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  ride_id: string;
  ride?: Ride;
  driver_id: string;
  driver?: Profile;
  passenger_id: string;
  passenger?: Profile;
  request_id?: string | null;
  status: MatchStatus;
  matched_at: string;
  completed_at?: string | null;
  unread_count?: number;
  last_message?: Message;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  sender?: Profile;
  message: string;
  created_at: string;
  read_at?: string | null;
}

export interface Rating {
  id: string;
  ride_id: string;
  from_user_id: string;
  to_user_id: string;
  rating: number;
  review?: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  ride_id?: string | null;
  reason: ReportReason;
  description?: string | null;
  status: ReportStatus;
  created_at: string;
}

export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_user_id: string;
  blocked_user?: Profile;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
}

export interface LocationCoordinate {
  latitude: number;
  longitude: number;
  name: string;
}

export interface SearchFilters {
  pickup: LocationCoordinate;
  destination: LocationCoordinate;
  departureTime: Date;
  seatsNeeded: number;
  pickupRadiusKm?: number;
  destRadiusKm?: number;
  timeWindowMinutes?: number;
}
