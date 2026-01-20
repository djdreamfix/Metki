// Utility to generate inline styles for the marker based on its color
export function markerStyle(color) {
  return {
    width: 42,
    height: 42,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontWeight: "bold",
    background:
      color === "blue"
        ? "#1e90ff"
        : color === "green"
        ? "#2ecc71"
        : "linear-gradient(90deg, #1e90ff 50%, #2ecc71 50%)",
  };
}