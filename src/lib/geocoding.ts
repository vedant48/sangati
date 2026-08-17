// Geocoding and Reverse Geocoding via OpenStreetMap Nominatim & Photon

export interface GeocodingResult {
  placeId: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
}

const COMMON_CITIES: GeocodingResult[] = [
  { placeId: '1', name: 'Mithapur Bus Stand, Patna', displayName: 'Mithapur, Patna, Bihar, India', lat: 25.5941, lng: 85.1376 },
  { placeId: '2', name: 'Patna Junction Railway Station', displayName: 'Patna Junction, Patna, Bihar, India', lat: 25.6022, lng: 85.1370 },
  { placeId: '3', name: 'Indiranagar 100ft Road, Bangalore', displayName: 'Indiranagar, Bengaluru, Karnataka, India', lat: 12.9784, lng: 77.6408 },
  { placeId: '4', name: 'ITPL Main Gate, Whitefield', displayName: 'ITPL, Whitefield, Bengaluru, Karnataka, India', lat: 12.9866, lng: 77.7376 },
  { placeId: '5', name: 'Connaught Place Inner Circle, Delhi', displayName: 'Connaught Place, New Delhi, Delhi, India', lat: 28.6315, lng: 77.2167 },
  { placeId: '6', name: 'DLF Cyber Hub, Gurgaon', displayName: 'Cyber City, Gurugram, Haryana, India', lat: 28.4950, lng: 77.0895 },
  { placeId: '7', name: 'Dadar TT Circle, Mumbai', displayName: 'Dadar, Mumbai, Maharashtra, India', lat: 19.0178, lng: 72.8478 },
  { placeId: '8', name: 'Bandra Kurla Complex (BKC), Mumbai', displayName: 'BKC, Bandra East, Mumbai, Maharashtra, India', lat: 19.0657, lng: 72.8686 },
  { placeId: '9', name: 'Hinjewadi Phase 1 Circle, Pune', displayName: 'Hinjawadi, Pune, Maharashtra, India', lat: 18.5912, lng: 73.7389 },
  { placeId: '10', name: 'Kothrud Stand, Pune', displayName: 'Kothrud, Pune, Maharashtra, India', lat: 18.5074, lng: 73.8077 },
];

/**
 * Searches places matching user query string using OpenStreetMap Nominatim.
 */
export async function searchPlaces(query: string): Promise<GeocodingResult[]> {
  const cleanQuery = query.trim();
  if (cleanQuery.length < 2) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      cleanQuery
    )}&format=json&addressdetails=1&limit=5&countrycodes=in`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'CompanionRideApp/1.0',
        'Accept-Language': 'en',
      },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          placeId: String(item.place_id),
          name: item.name || item.display_name.split(',')[0],
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        }));
      }
    }
  } catch (err) {
    // Graceful fallback to offline/instant popular results
  }

  // Fallback to local filter
  return COMMON_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(cleanQuery.toLowerCase()) ||
      c.displayName.toLowerCase().includes(cleanQuery.toLowerCase())
  );
}

/**
 * Reverse geocodes latitude and longitude coordinates into a human-readable location name.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'CompanionRideApp/1.0',
      },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(',');
        return parts.slice(0, 3).join(', ').trim();
      }
    }
  } catch (err) {
    // Ignore error and return coordinates string
  }

  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
