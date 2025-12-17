import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function LeafletMap({ city, places = [], coordinates = null }) {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default to London
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Predefined coordinates for major cities
  const cityCoordinates = {
    "Paris": [48.8566, 2.3522],
    "London": [51.5074, -0.1278],
    "New York": [40.7128, -74.0060],
    "Tokyo": [35.6762, 139.6503],
    "Sydney": [-33.8688, 151.2093],
    "Dubai": [25.2048, 55.2708],
    "Singapore": [1.3521, 103.8198],
    "Bangkok": [13.7563, 100.5018],
    "Barcelona": [41.3851, 2.1734],
    "Rome": [41.9028, 12.4964],
    "Hyderabad": [17.3850, 78.4867],
    "Delhi": [28.6139, 77.2090],
    "Mumbai": [19.0760, 72.8777],
    "Bangalore": [12.9716, 77.5946],
    "Chennai": [13.0827, 80.2707],
    "Kolkata": [22.5726, 88.3639],
  };

  useEffect(() => {
    if (city) {
      getCityCoordinates();
    }
  }, [city]);

  const getCityCoordinates = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we have predefined coordinates
      if (cityCoordinates[city]) {
        setMapCenter(cityCoordinates[city]);
        // Create markers for places
        const placeMarkers = places.map((place, index) => ({
          id: index,
          position: [
            cityCoordinates[city][0] + (Math.random() - 0.5) * 0.1,
            cityCoordinates[city][1] + (Math.random() - 0.5) * 0.1
          ],
          name: place
        }));
        setMarkers(placeMarkers);
      } else if (coordinates) {
        // Use provided coordinates
        setMapCenter([coordinates.lat, coordinates.lng]);
        // Create markers for places
        const placeMarkers = places.map((place, index) => ({
          id: index,
          position: [
            coordinates.lat + (Math.random() - 0.5) * 0.1,
            coordinates.lng + (Math.random() - 0.5) * 0.1
          ],
          name: place
        }));
        setMarkers(placeMarkers);
      } else {
        // Default to a world view
        setMapCenter([20, 0]);
        setMarkers([]);
      }
    } catch (err) {
      setError("Failed to load map data");
      console.error("Map error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold text-neonBlue mb-2">🗺️ Location Map</h4>
      <div className="bg-black/20 rounded-lg overflow-hidden border border-white/10 h-64">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="border-t-4 border-t-neonBlue animate-spin rounded-full h-8 w-8"></div>
            <span className="ml-3">Loading map...</span>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            {error}
          </div>
        ) : (
          <MapContainer 
            center={mapCenter} 
            zoom={13} 
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker) => (
              <Marker key={marker.id} position={marker.position}>
                <Popup>
                  <div className="font-semibold">{marker.name}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
      
      {places.length > 0 && (
        <div className="mt-3">
          <h5 className="text-sm font-medium text-gray-300 mb-1">📍 Key Locations:</h5>
          <div className="flex flex-wrap gap-1">
            {places.slice(0, 5).map((place, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-white/10 rounded text-xs glow-on-hover"
              >
                {place}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}