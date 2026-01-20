import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { socket } from "./socket";
import MarkerBubble from "./MarkerBubble";

// Component to handle click events on the map
function ClickHandler({ onAdd }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng);
    },
  });
  return null;
}

// Main map view component
export default function MapView() {
  // State to hold current markers received from server
  const [markers, setMarkers] = useState([]);
  // State to hold currently selected color for new markers
  const [color, setColor] = useState("blue");

  // Subscribe to socket events on mount
  useEffect(() => {
    // Receive initial marker list
    socket.on("init", (list) => setMarkers(list));
    // When a marker is added, append to the list
    socket.on("marker-added", (marker) => setMarkers((prev) => [...prev, marker]));
    // When markers are updated (due to cleanup), replace list
    socket.on("markers-updated", (list) => setMarkers(list));
    return () => {
      socket.off("init");
      socket.off("marker-added");
      socket.off("markers-updated");
    };
  }, []);

  // Send a request to the server to add a marker at the clicked location
  const addMarkerAt = (latlng) => {
    socket.emit("add-marker", { lat: latlng.lat, lng: latlng.lng, color });
  };

  // Create a custom div icon for each marker, with a placeholder element for React rendering
  const createDivIcon = (id) =>
    L.divIcon({
      html: `<div id="marker-${id}"></div>`,
      className: "",
    });

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* Color selection buttons */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          display: "flex",
          gap: 8,
        }}
      >
        <button onClick={() => setColor("blue")}>🔵</button>
        <button onClick={() => setColor("green")}>🟢</button>
        <button onClick={() => setColor("split")}>🔵🟢</button>
      </div>

      {/* Leaflet map */}
      <MapContainer
        center={[50.45, 30.52]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onAdd={addMarkerAt} />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={createDivIcon(m.id)}>
            <MarkerBubble marker={m} />
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}