import { io } from "socket.io-client";

// Create a Socket.IO client instance. In production, this will connect to the same origin.
// In development, Vite proxies can be configured to forward /socket.io to the backend.
export const socket = io();