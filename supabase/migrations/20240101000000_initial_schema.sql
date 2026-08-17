-- Companion Ride Database Schema & PostGIS Extensions
-- Production-Ready Schema Migration

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE,
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    date_of_birth DATE,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 1.00 AND rating <= 5.00),
    total_ratings INTEGER NOT NULL DEFAULT 0 CHECK (total_ratings >= 0),
    total_trips INTEGER NOT NULL DEFAULT 0 CHECK (total_trips >= 0),
    is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_identity_verified BOOLEAN NOT NULL DEFAULT FALSE,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. RIDES
CREATE TABLE IF NOT EXISTS public.rides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    pickup_name TEXT NOT NULL,
    pickup_lat DOUBLE PRECISION NOT NULL,
    pickup_lng DOUBLE PRECISION NOT NULL,
    pickup_geom GEOMETRY(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(pickup_lng, pickup_lat), 4326)) STORED,
    destination_name TEXT NOT NULL,
    destination_lat DOUBLE PRECISION NOT NULL,
    destination_lng DOUBLE PRECISION NOT NULL,
    destination_geom GEOMETRY(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(destination_lng, destination_lat), 4326)) STORED,
    departure_time TIMESTAMPTZ NOT NULL,
    available_seats INTEGER NOT NULL CHECK (available_seats >= 0),
    total_seats INTEGER NOT NULL DEFAULT 3 CHECK (total_seats >= 1),
    ride_type TEXT NOT NULL CHECK (ride_type IN ('free', 'fuel_sharing', 'cab_sharing')),
    contribution_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (contribution_amount >= 0),
    notes TEXT,
    vehicle_info TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'full', 'started', 'completed', 'cancelled', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. RIDE REQUESTS
CREATE TABLE IF NOT EXISTS public.ride_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
    passenger_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    seats_requested INTEGER NOT NULL DEFAULT 1 CHECK (seats_requested >= 1),
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure a passenger cannot have multiple active pending requests for the same ride
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pending_ride_request 
ON public.ride_requests (ride_id, passenger_id) 
WHERE status = 'pending';

-- 4. MATCHES
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    passenger_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.ride_requests(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
    matched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 5. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- 6. RATINGS
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
    from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    review TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT no_self_rating CHECK (from_user_id <> to_user_id),
    CONSTRAINT unique_ride_rating UNIQUE (ride_id, from_user_id, to_user_id)
);

-- 7. REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ride_id UUID REFERENCES public.rides(id) ON DELETE SET NULL,
    reason TEXT NOT NULL CHECK (reason IN ('harassment', 'unsafe_behavior', 'fake_profile', 'inappropriate_behavior', 'scam', 'other')),
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. BLOCKED USERS
CREATE TABLE IF NOT EXISTS public.blocked_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT no_self_block CHECK (blocker_id <> blocked_user_id),
    CONSTRAINT unique_block UNIQUE (blocker_id, blocked_user_id)
);

-- 9. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::JSONB,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DEVICE TOKENS
CREATE TABLE IF NOT EXISTS public.device_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    platform TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_token UNIQUE (user_id, token)
);

-- SPATIAL & PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_rides_pickup_geom ON public.rides USING GIST (pickup_geom);
CREATE INDEX IF NOT EXISTS idx_rides_dest_geom ON public.rides USING GIST (destination_geom);
CREATE INDEX IF NOT EXISTS idx_rides_creator ON public.rides (creator_id);
CREATE INDEX IF NOT EXISTS idx_rides_departure ON public.rides (departure_time);
CREATE INDEX IF NOT EXISTS idx_rides_status ON public.rides (status);
CREATE INDEX IF NOT EXISTS idx_ride_requests_ride ON public.ride_requests (ride_id);
CREATE INDEX IF NOT EXISTS idx_ride_requests_passenger ON public.ride_requests (passenger_id);
CREATE INDEX IF NOT EXISTS idx_matches_driver ON public.matches (driver_id);
CREATE INDEX IF NOT EXISTS idx_matches_passenger ON public.matches (passenger_id);
CREATE INDEX IF NOT EXISTS idx_matches_ride ON public.matches (ride_id);
CREATE INDEX IF NOT EXISTS idx_messages_match ON public.messages (match_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id, read);
CREATE INDEX IF NOT EXISTS idx_blocked_users_lookup ON public.blocked_users (blocker_id, blocked_user_id);

-- TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER update_rides_modtime BEFORE UPDATE ON public.rides FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER update_ride_requests_modtime BEFORE UPDATE ON public.ride_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER update_device_tokens_modtime BEFORE UPDATE ON public.device_tokens FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- TRIGGER FOR AUTO-CREATING PROFILE ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, username, avatar_url, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
        COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- TRIGGER FOR RECALCULATING PROFILE RATING AFTER A RATING IS INSERTED
CREATE OR REPLACE FUNCTION public.handle_new_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_score NUMERIC(3, 2);
    score_count INTEGER;
BEGIN
    SELECT AVG(rating), COUNT(id)
    INTO avg_score, score_count
    FROM public.ratings
    WHERE to_user_id = NEW.to_user_id;

    UPDATE public.profiles
    SET rating = ROUND(avg_score, 2),
        total_ratings = score_count
    WHERE id = NEW.to_user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_rating_added
    AFTER INSERT ON public.ratings
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_rating();

-- POSTGIS MATCHING ALGORITHM RPC: find_matching_rides
CREATE OR REPLACE FUNCTION public.find_matching_rides(
    p_pickup_lat DOUBLE PRECISION,
    p_pickup_lng DOUBLE PRECISION,
    p_dest_lat DOUBLE PRECISION,
    p_dest_lng DOUBLE PRECISION,
    p_departure_time TIMESTAMPTZ,
    p_seats_needed INTEGER DEFAULT 1,
    p_pickup_radius_km DOUBLE PRECISION DEFAULT 3.0,
    p_dest_radius_km DOUBLE PRECISION DEFAULT 4.0,
    p_time_window_minutes INTEGER DEFAULT 60,
    p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    creator_id UUID,
    creator_name TEXT,
    creator_avatar TEXT,
    creator_rating NUMERIC,
    creator_total_ratings INTEGER,
    creator_is_verified BOOLEAN,
    pickup_name TEXT,
    pickup_lat DOUBLE PRECISION,
    pickup_lng DOUBLE PRECISION,
    destination_name TEXT,
    destination_lat DOUBLE PRECISION,
    destination_lng DOUBLE PRECISION,
    departure_time TIMESTAMPTZ,
    available_seats INTEGER,
    total_seats INTEGER,
    ride_type TEXT,
    contribution_amount NUMERIC,
    notes TEXT,
    vehicle_info TEXT,
    status TEXT,
    pickup_distance_meters DOUBLE PRECISION,
    dest_distance_meters DOUBLE PRECISION,
    time_diff_minutes DOUBLE PRECISION,
    compatibility_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH calculated_rides AS (
        SELECT 
            r.id AS r_id,
            r.creator_id AS r_creator_id,
            p.full_name AS r_creator_name,
            p.avatar_url AS r_creator_avatar,
            p.rating AS r_creator_rating,
            p.total_ratings AS r_creator_total_ratings,
            (p.is_phone_verified OR p.is_identity_verified) AS r_creator_is_verified,
            r.pickup_name AS r_pickup_name,
            r.pickup_lat AS r_pickup_lat,
            r.pickup_lng AS r_pickup_lng,
            r.destination_name AS r_destination_name,
            r.destination_lat AS r_destination_lat,
            r.destination_lng AS r_destination_lng,
            r.departure_time AS r_departure_time,
            r.available_seats AS r_available_seats,
            r.total_seats AS r_total_seats,
            r.ride_type AS r_ride_type,
            r.contribution_amount AS r_contribution_amount,
            r.notes AS r_notes,
            r.vehicle_info AS r_vehicle_info,
            r.status AS r_status,
            -- Spherical distance from passenger pickup to driver pickup
            ST_DistanceSphere(r.pickup_geom, ST_SetSRID(ST_MakePoint(p_pickup_lng, p_pickup_lat), 4326)) AS p_dist,
            -- Spherical distance from passenger destination to driver destination
            ST_DistanceSphere(r.destination_geom, ST_SetSRID(ST_MakePoint(p_dest_lng, p_dest_lat), 4326)) AS d_dist,
            -- Absolute departure time difference in minutes
            ABS(EXTRACT(EPOCH FROM (r.departure_time - p_departure_time)) / 60.0) AS t_diff,
            -- Vector direction comparison (Bearing cosine similarity)
            -- Vector 1: Driver route (pickup -> dest)
            (r.destination_lng - r.pickup_lng) AS v1_x,
            (r.destination_lat - r.pickup_lat) AS v1_y,
            -- Vector 2: Passenger route (p_pickup -> p_dest)
            (p_dest_lng - p_pickup_lng) AS v2_x,
            (p_dest_lat - p_pickup_lat) AS v2_y
        FROM public.rides r
        JOIN public.profiles p ON r.creator_id = p.id
        WHERE r.status = 'active'
          AND r.available_seats >= p_seats_needed
          -- Exclude own rides
          AND (p_user_id IS NULL OR r.creator_id <> p_user_id)
          -- Exclude blocked users both ways
          AND (p_user_id IS NULL OR NOT EXISTS (
              SELECT 1 FROM public.blocked_users b 
              WHERE (b.blocker_id = p_user_id AND b.blocked_user_id = r.creator_id)
                 OR (b.blocker_id = r.creator_id AND b.blocked_user_id = p_user_id)
          ))
    ),
    scored_rides AS (
        SELECT 
            *,
            -- Compute Vector dot product and magnitudes
            CASE 
                WHEN (SQRT(v1_x*v1_x + v1_y*v1_y) * SQRT(v2_x*v2_x + v2_y*v2_y)) > 0
                THEN ((v1_x * v2_x + v1_y * v2_y) / (SQRT(v1_x*v1_x + v1_y*v1_y) * SQRT(v2_x*v2_x + v2_y*v2_y)))
                ELSE 1.0
            END AS cos_similarity
        FROM calculated_rides
        WHERE p_dist <= (p_pickup_radius_km * 1000.0)
          AND d_dist <= (p_dest_radius_km * 1000.0)
          AND t_diff <= p_time_window_minutes
    )
    SELECT 
        r_id,
        r_creator_id,
        r_creator_name,
        r_creator_avatar,
        r_creator_rating,
        r_creator_total_ratings,
        r_creator_is_verified,
        r_pickup_name,
        r_pickup_lat,
        r_pickup_lng,
        r_destination_name,
        r_destination_lat,
        r_destination_lng,
        r_departure_time,
        r_available_seats,
        r_total_seats,
        r_ride_type,
        r_contribution_amount,
        r_notes,
        r_vehicle_info,
        r_status,
        p_dist,
        d_dist,
        t_diff,
        -- Weighted compatibility score (0 to 100)
        -- Pickup (30%) + Destination (30%) + Time (20%) + Direction Similarity (20%)
        ROUND(
            (
                (GREATEST(0.0, 1.0 - (p_dist / (p_pickup_radius_km * 1000.0))) * 30.0) +
                (GREATEST(0.0, 1.0 - (d_dist / (p_dest_radius_km * 1000.0))) * 30.0) +
                (GREATEST(0.0, 1.0 - (t_diff / p_time_window_minutes)) * 20.0) +
                (GREATEST(0.0, ((cos_similarity + 1.0) / 2.0)) * 20.0)
            )::numeric, 
            0
        ) AS compatibility_score
    FROM scored_rides
    WHERE cos_similarity >= 0.0 -- Filter out trips going in opposing directions
    ORDER BY compatibility_score DESC, p_dist ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Rides Policies
CREATE POLICY "Active and completed rides are viewable by authenticated users" 
ON public.rides FOR SELECT USING (true);

CREATE POLICY "Users can create rides" 
ON public.rides FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Ride creators can update their own rides" 
ON public.rides FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Ride creators can delete their own rides" 
ON public.rides FOR DELETE USING (auth.uid() = creator_id);

-- 3. Ride Requests Policies
CREATE POLICY "Users can view requests they sent or received for their rides" 
ON public.ride_requests FOR SELECT USING (
    auth.uid() = passenger_id OR 
    EXISTS (SELECT 1 FROM public.rides WHERE rides.id = ride_requests.ride_id AND rides.creator_id = auth.uid())
);

CREATE POLICY "Passengers can create requests" 
ON public.ride_requests FOR INSERT WITH CHECK (auth.uid() = passenger_id);

CREATE POLICY "Passengers and Ride Creators can update requests" 
ON public.ride_requests FOR UPDATE USING (
    auth.uid() = passenger_id OR 
    EXISTS (SELECT 1 FROM public.rides WHERE rides.id = ride_requests.ride_id AND rides.creator_id = auth.uid())
);

-- 4. Matches Policies
CREATE POLICY "Matched users can view their matches" 
ON public.matches FOR SELECT USING (auth.uid() = driver_id OR auth.uid() = passenger_id);

CREATE POLICY "Drivers can insert matches" 
ON public.matches FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Participants can update matches" 
ON public.matches FOR UPDATE USING (auth.uid() = driver_id OR auth.uid() = passenger_id);

-- 5. Messages Policies
CREATE POLICY "Participants of a match can view messages" 
ON public.messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.matches 
        WHERE matches.id = messages.match_id 
          AND (matches.driver_id = auth.uid() OR matches.passenger_id = auth.uid())
    )
);

CREATE POLICY "Participants of a match can send messages" 
ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.matches 
        WHERE matches.id = match_id 
          AND (matches.driver_id = auth.uid() OR matches.passenger_id = auth.uid())
    )
);

-- 6. Ratings Policies
CREATE POLICY "Ratings are viewable by everyone" 
ON public.ratings FOR SELECT USING (true);

CREATE POLICY "Users can create ratings for trips they participated in" 
ON public.ratings FOR INSERT WITH CHECK (
    auth.uid() = from_user_id AND
    EXISTS (
        SELECT 1 FROM public.matches 
        WHERE matches.ride_id = ratings.ride_id 
          AND (matches.driver_id = auth.uid() OR matches.passenger_id = auth.uid())
    )
);

-- 7. Reports Policies
CREATE POLICY "Users can create reports" 
ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Reporters can view their submitted reports" 
ON public.reports FOR SELECT USING (auth.uid() = reporter_id);

-- 8. Blocked Users Policies
CREATE POLICY "Users can view and manage their blocked users" 
ON public.blocked_users FOR ALL USING (auth.uid() = blocker_id);

-- 9. Notifications Policies
CREATE POLICY "Users can view and update their own notifications" 
ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- 10. Device Tokens Policies
CREATE POLICY "Users can manage their device tokens" 
ON public.device_tokens FOR ALL USING (auth.uid() = user_id);
