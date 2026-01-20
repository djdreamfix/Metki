import { useEffect, useState } from 'react';
import L from 'leaflet';

type Marker = {
  id: string;
  lat: number;
  lng: number;
  color: string;
  created: number;
};

export default function App() {
  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    const map = L.map('map').setView([50.45, 30.52], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    map.on('click', (e: any) => {
      const color = ['blue', 'green', 'purple'][Math.floor(Math.random() * 3)];
      const marker = {
        id: crypto.randomUUID(),
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        color,
        created: Date.now()
      };

      setMarkers(m => [...m, marker]);

      const circle = L.circleMarker(e.latlng, {
        radius: 18,
        color,
        fillColor: color,
        fillOpacity: 0.8
      }).addTo(map);

      setTimeout(() => {
        map.removeLayer(circle);
      }, 30 * 60 * 1000);
    });

    return () => map.remove();
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100vw' }} />;
}