-- Companion Ride Seed Data
-- Creates realistic mock profiles, rides across urban hubs, sample match, messages and ratings

-- 1. Mock Users / Profiles
-- Assuming test UUIDs for demonstration & testing
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'rahul.kumar@example.com', '{"full_name": "Rahul Kumar", "username": "rahulk"}'::jsonb),
    ('22222222-2222-2222-2222-222222222222', 'priya.sharma@example.com', '{"full_name": "Priya Sharma", "username": "priyas"}'::jsonb),
    ('33333333-3333-3333-3333-333333333333', 'ananya.singh@example.com', '{"full_name": "Ananya Singh", "username": "ananyas"}'::jsonb),
    ('44444444-4444-4444-4444-444444444444', 'arjun.mehta@example.com', '{"full_name": "Arjun Mehta", "username": "arjunm"}'::jsonb),
    ('55555555-5555-5555-5555-555555555555', 'vikram.patel@example.com', '{"full_name": "Vikram Patel", "username": "vikramp"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, username, avatar_url, phone, bio, gender, rating, total_ratings, total_trips, is_phone_verified, is_identity_verified)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Rahul Kumar', 'rahulk', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', '+91 9876543210', 'Daily tech commuter. Quiet rides, punctual, fond of classic rock.', 'male', 4.90, 24, 38, true, true),
    ('22222222-2222-2222-2222-222222222222', 'Priya Sharma', 'priyas', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', '+91 9812345678', 'Design enthusiast traveling between tech hubs. Happy to share fuel costs!', 'female', 4.85, 18, 29, true, true),
    ('33333333-3333-3333-3333-333333333333', 'Ananya Singh', 'ananyas', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', '+91 9870001122', 'Medical intern. Friendly and strictly safety-conscious.', 'female', 4.95, 31, 45, true, true),
    ('44444444-4444-4444-4444-444444444444', 'Arjun Mehta', 'arjunm', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', '+91 9900112233', 'Finance professional. Daily commute with AC car.', 'male', 4.75, 12, 19, true, false),
    ('55555555-5555-5555-5555-555555555555', 'Vikram Patel', 'vikramp', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', '+91 9899887766', 'Consultant traveling across major corridors. Eco-conscious carpooler.', 'male', 4.80, 15, 22, true, true)
ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    rating = EXCLUDED.rating;

-- 2. Sample Active Rides
-- Patna Corridor (Mithapur -> Patna Junction)
INSERT INTO public.rides (
    id, creator_id, pickup_name, pickup_lat, pickup_lng, destination_name, destination_lat, destination_lng,
    departure_time, available_seats, total_seats, ride_type, contribution_amount, notes, vehicle_info, status
)
VALUES 
    (
        'aaaa1111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111111',
        'Mithapur Bus Stand, Patna',
        25.5941, 85.1376,
        'Patna Junction Railway Station',
        25.6022, 85.1370,
        NOW() + INTERVAL '2 hours',
        2, 3,
        'free', 0.00,
        'Leaving on time from Mithapur gate 2. Clean sedan.', 'White Honda City (BR-01-AB-1234)',
        'active'
    ),
    -- Bangalore Corridor (Indiranagar -> ITPL Whitefield)
    (
        'aaaa2222-2222-2222-2222-222222222222',
        '22222222-2222-2222-2222-222222222222',
        '100ft Road, Indiranagar, Bangalore',
        12.9784, 77.6408,
        'ITPL Main Gate, Whitefield, Bangalore',
        12.9866, 77.7376,
        NOW() + INTERVAL '1 hour 30 minutes',
        2, 3,
        'fuel_sharing', 80.00,
        'AC on, smooth drive via Old Airport Road. Non-smokers preferred.', 'Silver Hyundai i20 (KA-03-MN-5678)',
        'active'
    ),
    -- Delhi NCR Corridor (Connaught Place -> Cyber City Gurgaon)
    (
        'aaaa3333-3333-3333-3333-333333333333',
        '33333333-3333-3333-3333-333333333333',
        'Connaught Place Inner Circle, Delhi',
        28.6315, 77.2167,
        'Cyber Hub, DLF Cyber City, Gurgaon',
        28.4950, 77.0895,
        NOW() + INTERVAL '3 hours',
        3, 4,
        'fuel_sharing', 120.00,
        'Daily office commute. Fastag enabled, toll split included.', 'Blue Maruti Baleno (DL-8C-XY-9012)',
        'active'
    ),
    -- Mumbai Corridor (Dadar TT Circle -> BKC)
    (
        'aaaa4444-4444-4444-4444-444444444444',
        '44444444-4444-4444-4444-444444444444',
        'Dadar TT Circle, Mumbai',
        19.0178, 72.8478,
        'Bandra Kurla Complex (BKC), Mumbai',
        19.0657, 72.8686,
        NOW() + INTERVAL '45 minutes',
        1, 2,
        'cab_sharing', 60.00,
        'Taking Uber Premier, sharing fare equally.', 'Uber Cab (MH-01-CZ-4433)',
        'active'
    ),
    -- Pune Corridor (Hinjewadi Phase 1 -> Kothrud)
    (
        'aaaa5555-5555-5555-5555-555555555555',
        '55555555-5555-5555-5555-555555555555',
        'Hinjewadi Phase 1 Circle, Pune',
        18.5912, 73.7389,
        'Kothrud Stand, Pune',
        18.5074, 73.8077,
        NOW() + INTERVAL '4 hours',
        2, 3,
        'free', 0.00,
        'Heading home post shift. Pleasant music.', 'Grey Tata Nexon (MH-12-PQ-8899)',
        'active'
    )
ON CONFLICT (id) DO NOTHING;

-- 3. Sample Match & Messages
INSERT INTO public.matches (
    id, ride_id, driver_id, passenger_id, status, matched_at
)
VALUES (
    'bbbb1111-1111-1111-1111-111111111111',
    'aaaa2222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'active',
    NOW() - INTERVAL '15 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, match_id, sender_id, message, created_at, read_at)
VALUES 
    (
        'cccc1111-1111-1111-1111-111111111111',
        'bbbb1111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111111',
        'Hi Priya! I will be waiting near the 100ft road Starbucks.',
        NOW() - INTERVAL '10 minutes',
        NOW() - INTERVAL '8 minutes'
    ),
    (
        'cccc2222-2222-2222-2222-222222222222',
        'bbbb1111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        'Perfect Rahul! I am in a silver i20, see you in 15 mins.',
        NOW() - INTERVAL '7 minutes',
        NOW() - INTERVAL '5 minutes'
    )
ON CONFLICT (id) DO NOTHING;

-- 4. Sample Completed Ratings
INSERT INTO public.ratings (id, ride_id, from_user_id, to_user_id, rating, review, created_at)
VALUES 
    (
        'dddd1111-1111-1111-1111-111111111111',
        'aaaa2222-2222-2222-2222-222222222222',
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        5.0,
        'Super smooth ride and on time! Highly recommended companion.',
        NOW() - INTERVAL '2 days'
    )
ON CONFLICT (id) DO NOTHING;
