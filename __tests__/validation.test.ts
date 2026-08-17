// Unit tests for validation functions

import { isValidEmail, isValidPhone, validateRideCreation } from '../src/utils/validation';

describe('Form and Input Validation', () => {
  test('isValidEmail validates emails correctly', () => {
    expect(isValidEmail('rahul.kumar@example.com')).toBe(true);
    expect(isValidEmail('priya+rides@commute.org')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  test('isValidPhone validates Indian & international phone formats', () => {
    expect(isValidPhone('9876543210')).toBe(true);
    expect(isValidPhone('+91 9876543210')).toBe(true);
    expect(isValidPhone('98765-43210')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
  });

  test('validateRideCreation catches invalid parameters', () => {
    const validParams = {
      pickupName: 'Connaught Place',
      pickupLat: 28.6315,
      pickupLng: 77.2167,
      destName: 'Cyber City',
      destLat: 28.4950,
      destLng: 77.0895,
      departureTime: new Date(Date.now() + 60 * 60 * 1000),
      availableSeats: 3,
      contributionAmount: 100,
      rideType: 'fuel_sharing',
    };

    expect(validateRideCreation(validParams).isValid).toBe(true);

    // Missing coordinates
    expect(
      validateRideCreation({ ...validParams, pickupLat: undefined as any }).isValid
    ).toBe(false);

    // Past departure time
    expect(
      validateRideCreation({
        ...validParams,
        departureTime: new Date(Date.now() - 60 * 60 * 1000),
      }).isValid
    ).toBe(false);

    // Negative seats
    expect(
      validateRideCreation({ ...validParams, availableSeats: 0 }).isValid
    ).toBe(false);

    // Too many seats
    expect(
      validateRideCreation({ ...validParams, availableSeats: 10 }).isValid
    ).toBe(false);
  });
});
