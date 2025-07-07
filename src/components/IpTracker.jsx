import { useEffect, useState } from 'react';
import { L } from 'leaflet';
import 'leaflet/dist/leaflet.css';


function IpTracker() {
  const [ipData, setIpData] = useState({});
  const [input, setInput] = useState('');
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const fetchIpData = async (ip = '') => {
    try {
      const res = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_EhcO3LW6hxJbFvBU1TNo31Usx5URC&ipAddress=${ip}`
      );
      const data = await res.json();
      setIpData(data);

      const { lat, lng } = data.location;
      if (!map) {
        const newMap = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(newMap);
        setMap(newMap);

        const newMarker = L.marker([lat, lng])
          .addTo(newMap)
          .bindPopup(`${data.ip}<br>${data.location.city}, ${data.location.country}`)
          .openPopup();
        setMarker(newMarker);
      } else {
        map.setView([lat, lng], 13);
        if (marker) {
          map.removeLayer(marker);
        }
        const newMarker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`${data.ip}<br>${data.location.city}, ${data.location.country}`)
          .openPopup();
        setMarker(newMarker);
      }
    } catch (err) {
      console.error('Failed to fetch IP info', err);
      alert('Error fetching IP data');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchIpData(input);
    setInput('');
  };

  useEffect(() => {
    fetchIpData();
  }, []);

  return (
    <>
      <div className="header-bg">
        <div className="header-content">
          <h1>IP Address Tracker</h1>
          <form className="search-container" onSubmit={handleSubmit}>
            <input
              id="info"
              placeholder="Search for any IP address or domain"
              className="search-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button id="searchBtn" className="search-button" type="submit">
              <img src="/images/icon-arrow.svg" alt="arrow" />
            </button>
          </form>
        </div>
      </div>

      <div className="info-card">
        <div className="info-item">
          <h2>IP ADDRESS</h2>
          <p id="ipDisplay">{ipData.ip || 'N/A'}</p>
        </div>
        <div className="info-item">
          <h2>LOCATION</h2>
          <p id="location">
            {ipData.location
              ? `${ipData.location.city}, ${ipData.location.region}`
              : 'N/A'}
          </p>
        </div>
        <div className="info-item">
          <h2>TIMEZONE</h2>
          <p id="timeZone">UTC {ipData.location?.timezone || 'N/A'}</p>
        </div>
        <div className="info-item">
          <h2>ISP</h2>
          <p id="isp">{ipData.isp || 'N/A'}</p>
        </div>
      </div>

      <div id="map" style={{ height: '500px', width: '100%' }}></div>
    </>
  );
}

export default IpTracker;
