// Input validation utilities

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  // Checks standard 10-digit Indian numbers or E.164 formats
  const clean = phone.replace(/[\s\-+]/g, '');
  return clean.length >= 10 && clean.length <= 13;
}

export function validateRideCreation({
  pickupName,
  pickupLat,
  pickupLng,
  destName,
  destLat,
  destLng,
  departureTime,
  availableSeats,
  contributionAmount,
  rideType,
}: {
  pickupName: string;
  pickupLat?: number;
  pickupLng?: number;
  destName: string;
  destLat?: number;
  destLng?: number;
  departureTime: Date;
  availableSeats: number;
  contributionAmount: number;
  rideType: string;
}): { isValid: boolean; error?: string } {
  if (!pickupName || pickupName.trim().length < 2) {
    return { isValid: false, error: 'Please enter a valid pickup location.' };
  }
  if (!destName || destName.trim().length < 2) {
    return { isValid: false, error: 'Please enter a valid destination.' };
  }
  if (!pickupLat || !pickupLng || !destLat || !destLng) {
    return { isValid: false, error: 'Please select valid locations with coordinates.' };
  }
  if (departureTime.getTime() < Date.now() - 5 * 60 * 1000) {
    return { isValid: false, error: 'Departure time cannot be in the past.' };
  }
  if (availableSeats < 1 || availableSeats > 6) {
    return { isValid: false, error: 'Available seats must be between 1 and 6.' };
  }
  if (rideType !== 'free' && contributionAmount < 0) {
    return { isValid: false, error: 'Contribution amount cannot be negative.' };
  }

  return { isValid: true };
}
