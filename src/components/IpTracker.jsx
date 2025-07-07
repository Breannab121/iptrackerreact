import { useEffect, useRef, useState } from 'react';




const IpTracker = () => {
  const [ipData, setIpData] = useState(null);
  const [input, setInput] = useState('');
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const fetchIpData = async (ipAddress = '') => {
    const apiKey = 'at_EhcO3LW6hxJbFvBU1TNo31Usx5URC';
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setIpData(data);
      updateMap(data.location.lat, data.location.lng, `${data.ip}<br>${data.location.city}, ${data.location.country}`);
    } catch (err) {
      console.error('Failed to fetch IP data:', err);
      setIpData(null);
    }
  };

  const updateMap = (lat, lng, popupText) => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView([lat, lng], 13);
    }

    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
    }

    markerRef.current = L.marker([lat, lng]).addTo(mapRef.current).bindPopup(popupText).openPopup();
  };

  useEffect(() => {
    fetchIpData(); // Fetch user's current IP info on mount
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      fetchIpData(input.trim());
      setInput('');
    }
  };

  return (
    <div className="w-full">
      <header className="bg-gray-800 text-white p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">IP Address Tracker</h1>
        <form onSubmit={handleSearch} className="flex justify-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for any IP address or domain"
            className="px-4 py-2 rounded w-96 text-black"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
            🔍
          </button>
        </form>
      </header>

      {ipData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center p-6 bg-white shadow-md">
          <div>
            <h2 className="font-semibold text-gray-600">IP Address</h2>
            <p>{ipData.ip}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-600">Location</h2>
            <p>{ipData.location.region}, {ipData.location.city}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-600">Timezone</h2>
            <p>UTC {ipData.location.timezone}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-600">ISP</h2>
            <p>{ipData.isp}</p>
          </div>
        </div>
      )}

      <div id="map" className="h-[400px] w-full mt-6" />
    </div>
  );
};

export default IpTracker;
