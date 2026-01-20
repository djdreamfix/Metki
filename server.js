import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import crypto from "crypto";

// Determine current directory for static file serving
const __dirname = new URL('.', import.meta.url).pathname;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// In-memory marker store. Each marker has id, lat, lng, color, createdAt.
const markers = [];

// Socket.io events
io.on("connection", (socket) => {
  // Send current marker list on new connection
  socket.emit("init", markers);

  // When a client requests to add a marker
  socket.on("add-marker", ({ lat, lng, color }) => {
    const marker = {
      id: crypto.randomUUID(),
      lat,
      lng,
      color,
      createdAt: Date.now(),
    };
    markers.push(marker);
    io.emit("marker-added", marker);
  });
});

// Periodically remove markers older than 30 minutes
setInterval(() => {
  const now = Date.now();
  let removed = false;
  for (let i = markers.length - 1; i >= 0; i--) {
    if (now - markers[i].createdAt > 30 * 60 * 1000) {
      markers.splice(i, 1);
      removed = true;
    }
  }
  if (removed) {
    // Broadcast updated marker list
    io.emit("markers-updated", markers);
  }
}, 5000);

// Serve static files from the dist directory
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// SPA fallback: return index.html for any unknown route
app.get("*", (_, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});