import { useState } from 'react';

const LocationSearch = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchLocation = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length < 3) { setResults([]); return; }

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&countrycodes=in`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Location search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (place) => {
    onLocationSelect({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      name: place.display_name,
    });
    setQuery(place.display_name.split(',')[0]);
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center bg-gray-800 border border-gray-600 rounded-lg px-3 py-2">
        <svg className="w-4 h-4 text-orange-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={searchLocation}
          placeholder="Search a location..."
          className="bg-transparent text-white placeholder-gray-400 text-sm outline-none w-full"
        />
        {loading && (
          <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin ml-2" />
        )}
      </div>

      {results.length > 0 && (
        <ul className="absolute z-[1000] mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden">
          {results.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;