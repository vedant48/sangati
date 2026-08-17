// Unit tests for spatial calculations and distance estimation

import {
  calculateDistanceMeters,
  calculateDirectionSimilarity,
  calculateCompatibilityScore,
  formatDistance,
} from '../src/utils/calculations';

describe('Spatial & Directional Calculations', () => {
  test('calculateDistanceMeters calculates accurate spherical distance', () => {
    // Distance between Mithapur (25.5941, 85.1376) and Patna Junction (25.6022, 85.1370) is ~900m
    const dist = calculateDistanceMeters(25.5941, 85.1376, 25.6022, 85.1370);
    expect(dist).toBeGreaterThan(800);
    expect(dist).toBeLessThan(1100);
  });

  test('calculateDirectionSimilarity gives high score for aligned directions', () => {
    // Both moving North-East
    const sim = calculateDirectionSimilarity(
      { lat: 12.9716, lng: 77.5946 }, // Bangalore pickup
      { lat: 12.9866, lng: 77.7376 }, // Whitefield dest
      { lat: 12.9784, lng: 77.6408 }, // Indiranagar pickup
      { lat: 12.9866, lng: 77.7376 }  // Whitefield dest
    );
    expect(sim).toBeGreaterThan(0.8);
  });

  test('calculateDirectionSimilarity gives negative score for opposite directions', () => {
    // Driver moving East, Passenger moving West
    const sim = calculateDirectionSimilarity(
      { lat: 12.9716, lng: 77.5946 },
      { lat: 12.9716, lng: 77.7000 },
      { lat: 12.9716, lng: 77.7000 },
      { lat: 12.9716, lng: 77.5946 }
    );
    expect(sim).toBeLessThan(-0.5);
  });

  test('calculateCompatibilityScore weighs all 4 factors accurately', () => {
    // High compatibility case: 200m pickup distance, 300m dest distance, 5 mins time diff, aligned vector
    const high = calculateCompatibilityScore({
      pickupDistanceMeters: 200,
      destDistanceMeters: 300,
      timeDiffMinutes: 5,
      pickupRadiusKm: 2.0,
      destRadiusKm: 3.0,
      timeWindowMinutes: 30,
      directionSimilarity: 0.95,
    });
    expect(high).toBeGreaterThanOrEqual(85);

    // Poor compatibility case: 1.8km pickup distance, 2.7km dest distance, 25 mins time diff
    const low = calculateCompatibilityScore({
      pickupDistanceMeters: 1800,
      destDistanceMeters: 2700,
      timeDiffMinutes: 25,
      pickupRadiusKm: 2.0,
      destRadiusKm: 3.0,
      timeWindowMinutes: 30,
      directionSimilarity: 0.3,
    });
    expect(low).toBeLessThan(50);
  });

  test('formatDistance handles meters and kilometers correctly', () => {
    expect(formatDistance(450)).toBe('450 m');
    expect(formatDistance(1250)).toBe('1.3 km');
    expect(formatDistance(5000)).toBe('5.0 km');
  });
});
