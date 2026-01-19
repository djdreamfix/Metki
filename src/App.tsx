import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";

const socket = io();

export default function App() {
  const [markers, setMarkers] = useState<any[]>([]);
  useEffect(() => {
    socket.on("markers:init", setMarkers);
    socket.on("marker:created", m => setMarkers(p => [...p, m]));
    socket.on("markers:update", setMarkers);
    return () => socket.off();
  }, []);

  const add = (e:any) => {
    socket.emit("marker:create", {
      id: crypto.randomUUID(),
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      createdAt: Date.now(),
      color: "blue"
    });
  };

  return (
    <MapContainer center={[50.45,30.52]} zoom={13} style={{height:"100vh"}}
      whenCreated={map => map.on("click", add)}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      {markers.map(m=>(
        <CircleMarker key={m.id} center={[m.lat,m.lng]} radius={15}/>
      ))}
    </MapContainer>
  );
}