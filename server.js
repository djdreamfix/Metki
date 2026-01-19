import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;
let markers = [];

io.on("connection", (socket) => {
  socket.emit("markers:init", markers);
  socket.on("marker:create", (marker) => {
    markers.push(marker);
    io.emit("marker:created", marker);
  });
});

setInterval(() => {
  const now = Date.now();
  markers = markers.filter(m => now - m.createdAt < 30 * 60 * 1000);
  io.emit("markers:update", markers);
}, 30000);

app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

server.listen(PORT, () => console.log("Server running on", PORT));