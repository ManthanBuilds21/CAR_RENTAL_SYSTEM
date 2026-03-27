import { useState, useEffect, useCallback } from 'react';
import MapView from '../components/MapView';
import LocationSearch from '../components/LocationSearch';
import carService from '../services/carService';
import toast from 'react-hot-toast';

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(20);

  const fetchNearbyCars = useCallback(async (lat, lng, r = radius) => {
    setLoading(true);
    try {
      const data = await carService.getNearbyCars(lat, lng, r);
      setCars(data.cars || []);
      if ((data.cars || []).length === 0) {
        toast('No cars found nearby. Try a larger radius.', { icon: '🚗' });
      }
    } catch (err) {
      toast.error('Failed to fetch nearby cars');
    } finally {
      setLoading(false);
    }
  }, [radius]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          // Use user's real location to show on map, but search from car hub
          setMapCenter({ lat: 16.9902, lng: 73.3120 });
          fetchNearbyCars(16.9902, 73.3120, radius);
        },
        () => {
          // Geolocation denied — use Ratnagiri car hub
          const fallback = { lat: 16.9902, lng: 73.3120 };
          setMapCenter(fallback);
          fetchNearbyCars(fallback.lat, fallback.lng, radius);
          toast('Showing cars in Ratnagiri area', { icon: '📍' });
        }
      );
    } else {
      const fallback = { lat: 16.9902, lng: 73.3120 };
      setMapCenter(fallback);
      fetchNearbyCars(fallback.lat, fallback.lng, radius);
    }
  }, []); // eslint-disable-line

  const handleLocationSelect = ({ lat, lng }) => {
    setMapCenter({ lat, lng });
    fetchNearbyCars(lat, lng, radius);
  };

  const handleRadiusChange = (e) => {
    const r = parseInt(e.target.value);
    setRadius(r);
    if (mapCenter) fetchNearbyCars(mapCenter.lat, mapCenter.lng, r);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Top bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">

          <h1 className="text-lg font-bold text-white whitespace-nowrap">
            🗺️ Find Cars Near You
          </h1>

          <div className="flex-1 w-full">
            <LocationSearch onLocationSelect={handleLocationSelect} />
          </div>

          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-sm text-gray-400">Radius:</span>
            <select
              value={radius}
              onChange={handleRadiusChange}
              className="bg-gray-700 text-white text-sm border border-gray-600 rounded-lg px-2 py-1.5 outline-none"
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
              <option value={50}>50 km</option>
            </select>
          </div>

          <div className="text-sm whitespace-nowrap">
            {loading ? (
              <span className="text-orange-400 animate-pulse">Searching...</span>
            ) : (
              <span className="text-gray-400">
                {cars.length} car{cars.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div
          className="rounded-xl overflow-hidden border border-gray-700 shadow-2xl"
          style={{ height: 'calc(100vh - 148px)' }}
        >
          {mapCenter ? (
            <MapView cars={cars} userLocation={userLocation} center={mapCenter} />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;