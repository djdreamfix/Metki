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
  // List of markers received from the server
  const [markers, setMarkers] = useState([]);
  // Currently selected map center (defaults to Kyiv)
  const [center, setCenter] = useState([50.45, 30.52]);
  // Whether the color picker dialog is visible
  const [showPicker, setShowPicker] = useState(false);
  // Coordinates where the user clicked to add a marker
  const [clickedLatLng, setClickedLatLng] = useState(null);

  // Subscribe to socket events on mount
  useEffect(() => {
    socket.on("init", (list) => setMarkers(list));
    socket.on("marker-added", (marker) => setMarkers((prev) => [...prev, marker]));
    socket.on("markers-updated", (list) => setMarkers(list));
    return () => {
      socket.off("init");
      socket.off("marker-added");
      socket.off("markers-updated");
    };
  }, []);

  // On mount, attempt to get the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCenter([latitude, longitude]);
        },
        () => {
          // If location access fails, keep default center
        }
      );
    }
  }, []);

  // Handler for map clicks: record position and show picker
  const handleMapClick = (latlng) => {
    setClickedLatLng(latlng);
    setShowPicker(true);
  };

  // When a color is selected, emit marker creation and hide picker
  const selectColor = (choice) => {
    if (clickedLatLng) {
      socket.emit("add-marker", {
        lat: clickedLatLng.lat,
        lng: clickedLatLng.lng,
        color: choice,
      });
    }
    setShowPicker(false);
  };

  // Create a custom div icon for each marker, with a placeholder element for React rendering
  const createDivIcon = (id) =>
    L.divIcon({
      html: `<div id="marker-${id}"></div>`,
      className: "",
    });

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* Color picker dialog shown when clicking on the map */}
      {showPicker && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            backgroundColor: "white",
            padding: "8px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            display: "flex",
            gap: 8,
          }}
        >
          <button onClick={() => selectColor("blue")} aria-label="Додати синю мітку">
            🔵
          </button>
          <button onClick={() => selectColor("green")} aria-label="Додати зелену мітку">
            🟢
          </button>
          <button onClick={() => selectColor("split")} aria-label="Додати синьо-зелену мітку">
            🔵🟢
          </button>
        </div>
      )}

      {/* Leaflet map */}
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onAdd={handleMapClick} />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={createDivIcon(m.id)}>
            <MarkerBubble marker={m} />
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}