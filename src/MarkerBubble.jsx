import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { markerStyle } from "./markerStyle";

// Component to render a marker with live countdown inside a Leaflet div icon
export default function MarkerBubble({ marker }) {
  useEffect(() => {
    const el = document.getElementById(`marker-${marker.id}`);
    if (!el) return;
    const root = createRoot(el);
    const update = () => {
      const elapsed = Date.now() - marker.createdAt;
      const remaining = Math.max(0, 30 * 60 * 1000 - elapsed);
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
      root.render(
        <div style={markerStyle(marker.color)}>{formatted}</div>
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [marker]);
  return null;
}