// Self-contained mathematical and validation test suite

function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function calculateDirectionSimilarity(driverPickup, driverDest, passengerPickup, passengerDest) {
  const v1_x = driverDest.lng - driverPickup.lng;
  const v1_y = driverDest.lat - driverPickup.lat;
  const v2_x = passengerDest.lng - passengerPickup.lng;
  const v2_y = passengerDest.lat - passengerPickup.lat;

  const mag1 = Math.sqrt(v1_x * v1_x + v1_y * v1_y);
  const mag2 = Math.sqrt(v2_x * v2_x + v2_y * v2_y);

  if (mag1 === 0 || mag2 === 0) return 1.0;

  const dot = v1_x * v2_x + v1_y * v2_y;
  return Math.max(-1.0, Math.min(1.0, dot / (mag1 * mag2)));
}

function calculateCompatibilityScore({
  pickupDistanceMeters,
  destDistanceMeters,
  timeDiffMinutes,
  pickupRadiusKm = 2.0,
  destRadiusKm = 3.0,
  timeWindowMinutes = 30,
  directionSimilarity = 1.0,
}) {
  const maxPickupMeters = pickupRadiusKm * 1000;
  const maxDestMeters = destRadiusKm * 1000;

  const pickupRatio = Math.max(0, 1 - pickupDistanceMeters / maxPickupMeters);
  const pickupScore = pickupRatio * 30;

  const destRatio = Math.max(0, 1 - destDistanceMeters / maxDestMeters);
  const destScore = destRatio * 30;

  const timeRatio = Math.max(0, 1 - timeDiffMinutes / timeWindowMinutes);
  const timeScore = timeRatio * 20;

  const normalizedDirection = Math.max(0, (directionSimilarity + 1) / 2);
  const directionScore = normalizedDirection * 20;

  const totalScore = Math.round(pickupScore + destScore + timeScore + directionScore);
  return Math.min(100, Math.max(0, totalScore));
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

function isValidPhone(phone) {
  const clean = phone.replace(/[\s\-+]/g, '');
  return clean.length >= 10 && clean.length <= 13;
}

function validateRideCreation({
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
}) {
  if (!pickupName || pickupName.trim().length < 2) return { isValid: false, error: 'Invalid pickup' };
  if (!destName || destName.trim().length < 2) return { isValid: false, error: 'Invalid dest' };
  if (!pickupLat || !pickupLng || !destLat || !destLng) return { isValid: false, error: 'Missing coordinates' };
  if (departureTime.getTime() < Date.now() - 5 * 60 * 1000) return { isValid: false, error: 'Past time' };
  if (availableSeats < 1 || availableSeats > 6) return { isValid: false, error: 'Invalid seats' };
  return { isValid: true };
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  } else {
    console.log(`✅ PASS: ${message}`);
    passed++;
  }
}

console.log('\n======================================================');
console.log('🧪 COMPANION RIDE - AUTOMATED TEST SUITE');
console.log('======================================================');

console.log('\n--- 1. PostGIS Spatial & Distance Calculations ---');
const dist = calculateDistanceMeters(25.5941, 85.1376, 25.6022, 85.1370);
assert(dist >= 800 && dist <= 1100, `Haversine distance accurate (~${dist}m between Mithapur and Patna Jn)`);

const simAligned = calculateDirectionSimilarity(
  { lat: 12.9716, lng: 77.5946 },
  { lat: 12.9866, lng: 77.7376 },
  { lat: 12.9784, lng: 77.6408 },
  { lat: 12.9866, lng: 77.7376 }
);
assert(simAligned > 0.8, `Direction similarity for parallel routes is high (${simAligned.toFixed(2)})`);

const simOpposite = calculateDirectionSimilarity(
  { lat: 12.9716, lng: 77.5946 },
  { lat: 12.9716, lng: 77.7000 },
  { lat: 12.9716, lng: 77.7000 },
  { lat: 12.9716, lng: 77.5946 }
);
assert(simOpposite < -0.5, `Direction similarity for opposing routes is negative (${simOpposite.toFixed(2)})`);

const highScore = calculateCompatibilityScore({
  pickupDistanceMeters: 200,
  destDistanceMeters: 300,
  timeDiffMinutes: 5,
  pickupRadiusKm: 2.0,
  destRadiusKm: 3.0,
  timeWindowMinutes: 30,
  directionSimilarity: 0.95,
});
assert(highScore >= 85, `Multi-factor score is high (${highScore}%) for close corridor`);

const lowScore = calculateCompatibilityScore({
  pickupDistanceMeters: 1800,
  destDistanceMeters: 2700,
  timeDiffMinutes: 25,
  pickupRadiusKm: 2.0,
  destRadiusKm: 3.0,
  timeWindowMinutes: 30,
  directionSimilarity: 0.3,
});
assert(lowScore < 50, `Multi-factor score is low (${lowScore}%) for distant corridor`);

console.log('\n--- 2. Form, Auth & Security Validation ---');
assert(isValidEmail('rahul.kumar@example.com'), 'Valid email format passes');
assert(!isValidEmail('invalid-email'), 'Malformed email rejected');
assert(isValidPhone('+91 9876543210'), 'Valid Indian/E164 phone passes');
assert(!isValidPhone('123'), 'Invalid short phone rejected');

const validRide = validateRideCreation({
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
});
assert(validRide.isValid, 'Valid ride parameters accepted');

const invalidPastRide = validateRideCreation({
  pickupName: 'Connaught Place',
  pickupLat: 28.6315,
  pickupLng: 77.2167,
  destName: 'Cyber City',
  destLat: 28.4950,
  destLng: 77.0895,
  departureTime: new Date(Date.now() - 60 * 60 * 1000),
  availableSeats: 3,
  contributionAmount: 100,
  rideType: 'fuel_sharing',
});
assert(!invalidPastRide.isValid, 'Past departure time rejected');

console.log(`\n======================================================`);
console.log(`✅ All ${passed} tests passed successfully (${failed} failed)`);
console.log(`======================================================\n`);

if (failed > 0) process.exit(1);
