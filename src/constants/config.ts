// App configuration and matching defaults

export const AppConfig = {
  appName: 'Companion Ride',
  version: '1.0.0',
  
  // Default Matching Thresholds
  matching: {
    defaultPickupRadiusKm: 2.0,
    maxPickupRadiusKm: 10.0,
    defaultDestRadiusKm: 3.0,
    maxDestRadiusKm: 15.0,
    defaultTimeWindowMinutes: 30,
    maxTimeWindowMinutes: 180,
    minCompatibilityScore: 40,
  },

  // Map Tile & Nominatim Geocoding API
  map: {
    defaultLat: 28.6139,
    defaultLng: 77.2090,
    defaultZoom: 12,
    nominatimBaseUrl: 'https://nominatim.openstreetmap.org',
    tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },

  // Emergency SOS default
  emergency: {
    defaultHelpline: '112', // Universal emergency response in India
    womenHelpline: '1091',
  }
};
