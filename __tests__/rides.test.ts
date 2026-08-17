// Unit and Integration tests for Ride Lifecycle, Requests, and Seat Management

import { createRide, requestToJoinRide, acceptRideRequest } from '../src/services/rideService';

describe('Ride Lifecycle & Request State Machine', () => {
  test('createRide successfully creates an active ride', async () => {
    const ride = await createRide({
      creatorId: 'test_user_1',
      pickupName: 'Dadar TT, Mumbai',
      pickupLat: 19.0178,
      pickupLng: 72.8478,
      destinationName: 'BKC, Mumbai',
      destinationLat: 19.0657,
      destinationLng: 72.8686,
      departureTime: new Date(Date.now() + 60 * 60 * 1000),
      availableSeats: 3,
      totalSeats: 4,
      rideType: 'fuel_sharing',
      contributionAmount: 60,
    });

    expect(ride).toBeDefined();
    expect(ride.status).toBe('active');
    expect(ride.available_seats).toBe(3);
  });

  test('requestToJoinRide creates a pending request', async () => {
    const req = await requestToJoinRide({
      rideId: 'aaaa2222-2222-2222-2222-222222222222',
      passengerId: 'passenger_test_1',
      seatsRequested: 1,
      message: 'Hello, going to ITPL too!',
    });

    expect(req).toBeDefined();
    expect(req.status).toBe('pending');
    expect(req.seats_requested).toBe(1);
  });

  test('acceptRideRequest confirms match and transitions request status', async () => {
    const req = await requestToJoinRide({
      rideId: 'aaaa3333-3333-3333-3333-333333333333',
      passengerId: 'passenger_test_2',
      seatsRequested: 2,
    });

    const match = await acceptRideRequest(req.id, '33333333-3333-3333-3333-333333333333');
    expect(match).toBeDefined();
    expect(match.status).toBe('active');
  });
});
