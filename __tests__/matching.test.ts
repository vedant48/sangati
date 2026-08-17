// Integration test for matching service and ranking

import { searchMatchingRides } from '../src/services/matchingService';

describe('Ride Matching & PostGIS Filter Simulation', () => {
  test('searchMatchingRides returns ranked compatible corridor rides', async () => {
    // Search around Indiranagar -> Whitefield corridor (where Priya Sharma's ride is located)
    const results = await searchMatchingRides({
      pickup: {
        name: 'Indiranagar 100ft road',
        latitude: 12.9784,
        longitude: 77.6408,
      },
      destination: {
        name: 'ITPL Main Gate, Whitefield',
        latitude: 12.9866,
        longitude: 77.7376,
      },
      departureTime: new Date(Date.now() + 60 * 60 * 1000),
      seatsNeeded: 1,
      pickupRadiusKm: 5.0,
      destRadiusKm: 5.0,
      timeWindowMinutes: 120,
    });

    expect(results.length).toBeGreaterThan(0);
    // Highest ranked match should be top
    expect(results[0].compatibility_score).toBeGreaterThanOrEqual(70);
  });

  test('searchMatchingRides excludes rides from current user', async () => {
    const currentUserId = '11111111-1111-1111-1111-111111111111'; // Rahul Kumar's ID
    const results = await searchMatchingRides(
      {
        pickup: {
          name: 'Mithapur, Patna',
          latitude: 25.5941,
          longitude: 85.1376,
        },
        destination: {
          name: 'Patna Junction',
          latitude: 25.6022,
          longitude: 85.1370,
        },
        departureTime: new Date(Date.now() + 90 * 60 * 1000),
        seatsNeeded: 1,
        pickupRadiusKm: 5.0,
        destRadiusKm: 5.0,
        timeWindowMinutes: 120,
      },
      currentUserId
    );

    // None of the results should be authored by Rahul Kumar
    const ownRides = results.filter((r) => r.creator_id === currentUserId);
    expect(ownRides.length).toBe(0);
  });
});
