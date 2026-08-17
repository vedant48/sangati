// Interactive OpenStreetMap / Leaflet Route Visualizer via WebView

import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../../constants/colors';
import { BorderRadius } from '../../constants/theme';

interface MarkerPoint {
  lat: number;
  lng: number;
  label?: string;
  type?: 'pickup' | 'destination' | 'nearby';
}

interface RouteMapProps {
  pickup?: { lat: number; lng: number; label?: string };
  destination?: { lat: number; lng: number; label?: string };
  nearbyMarkers?: Array<{ lat: number; lng: number; title: string }>;
  style?: ViewStyle;
  height?: number;
  interactive?: boolean;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  pickup,
  destination,
  nearbyMarkers = [],
  style,
  height = 220,
  interactive = true,
}) => {
  // Center calculation
  const defaultLat = pickup?.lat || destination?.lat || 28.6139;
  const defaultLng = pickup?.lng || destination?.lng || 77.2090;

  const htmlContent = useMemo(() => {
    const markers: MarkerPoint[] = [];
    if (pickup) {
      markers.push({ ...pickup, type: 'pickup', label: pickup.label || 'Pickup' });
    }
    if (destination) {
      markers.push({ ...destination, type: 'destination', label: destination.label || 'Destination' });
    }
    nearbyMarkers.forEach((nm) => {
      markers.push({ lat: nm.lat, lng: nm.lng, label: nm.title, type: 'nearby' });
    });

    const markersJson = JSON.stringify(markers);
    const hasRoute = pickup && destination;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: #f8fafc;
          }
          .custom-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: white;
            font-weight: bold;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          }
          .pickup-icon { background: #2563EB; border: 2px solid white; width: 26px; height: 26px; }
          .dest-icon { background: #7C3AED; border: 2px solid white; width: 26px; height: 26px; }
          .nearby-icon { background: #14B8A6; border: 2px solid white; width: 20px; height: 20px; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            zoomControl: ${interactive ? 'true' : 'false'},
            dragging: ${interactive ? 'true' : 'false'},
            touchZoom: ${interactive ? 'true' : 'false'},
            scrollWheelZoom: false
          }).setView([${defaultLat}, ${defaultLng}], 13);

          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);

          const markersData = ${markersJson};
          const latLngs = [];

          markersData.forEach(m => {
            latLngs.push([m.lat, m.lng]);
            let iconHtml = '📍';
            let className = 'custom-icon nearby-icon';

            if (m.type === 'pickup') {
              iconHtml = '🟢';
              className = 'custom-icon pickup-icon';
            } else if (m.type === 'destination') {
              iconHtml = '🏁';
              className = 'custom-icon dest-icon';
            }

            const customIcon = L.divIcon({
              className: className,
              html: iconHtml,
              iconSize: [26, 26],
              iconAnchor: [13, 13]
            });

            L.marker([m.lat, m.lng], { icon: customIcon })
              .addTo(map)
              .bindPopup('<b>' + (m.label || '') + '</b>');
          });

          ${
            hasRoute
              ? `
            // Draw route polyline between pickup and destination
            const polyline = L.polyline([
              [${pickup.lat}, ${pickup.lng}],
              [${destination.lat}, ${destination.lng}]
            ], {
              color: '#2563EB',
              weight: 4,
              opacity: 0.85,
              dashArray: '8, 8',
              lineCap: 'round'
            }).addTo(map);
          `
              : ''
          }

          if (latLngs.length > 1) {
            map.fitBounds(L.latLngBounds(latLngs), { padding: [30, 30] });
          } else if (latLngs.length === 1) {
            map.setView(latLngs[0], 14);
          }
        </script>
      </body>
      </html>
    `;
  }, [pickup, destination, nearbyMarkers, defaultLat, defaultLng, interactive]);

  return (
    <View style={[styles.container, { height }, style]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webView}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSubtle,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
