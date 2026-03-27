    import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Fix Leaflet marker icons broken by Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Orange car marker matching your theme
const carIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    background:#f97316;border:2px solid white;
    border-radius:50% 50% 50% 0;width:36px;height:36px;
    transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4);
    display:flex;align-items:center;justify-content:center;
  "><span style="transform:rotate(45deg);font-size:16px;">🚗</span></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
});

// Blue dot for user's location
const userIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    background:#3b82f6;border:3px solid white;border-radius:50%;
    width:18px;height:18px;box-shadow:0 0 0 4px rgba(59,130,246,0.3);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Moves map when center prop changes
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
};

const MapView = ({ cars = [], userLocation, center }) => {
  const navigate = useNavigate();
  const defaultCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [19.076, 72.8777]; // Mumbai fallback

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Recenter on search */}
      {center && <RecenterMap lat={center.lat} lng={center.lng} />}

      {/* Your location */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup><strong>📍 You are here</strong></Popup>
        </Marker>
      )}

      {/* Car markers */}
      {cars.map((car) =>
        car.latitude && car.longitude ? (
          <Marker key={car._id} position={[car.latitude, car.longitude]} icon={carIcon}>
            <Popup minWidth={210}>
              <div style={{ fontFamily: 'sans-serif', padding: '4px' }}>
                <img
                  src={car.image}
                  alt={car.model}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200x100?text=Car'; }}
                  style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
                />
                <p style={{ fontWeight: '700', fontSize: '15px', margin: '0 0 2px' }}>
                  {car.brand} {car.model}
                </p>
                <p style={{ color: '#f97316', fontWeight: '600', fontSize: '13px', margin: '0 0 2px' }}>
                  ₹{car.pricePerDay}/day
                </p>
                <p style={{ color: '#666', fontSize: '12px', margin: '0 0 10px' }}>
                  {car.type} • {car.seats} seats • {car.fuelType}
                  {car.distance !== undefined && <span> • 📍 {car.distance} km away</span>}
                </p>
                <button
                  onClick={() => navigate(`/cars/${car._id}`)}
                  style={{
                    background: '#f97316', color: 'white', border: 'none',
                    borderRadius: '6px', padding: '7px 0', fontSize: '13px',
                    fontWeight: '600', cursor: 'pointer', width: '100%',
                  }}
                >
                  Book Now →
                </button>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default MapView;