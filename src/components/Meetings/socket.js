// socket.js (Frontend socket connection setup)
import { io } from "socket.io-client";
// const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL.replace("https://", "wss://");
console.log("WebSocket URL:", BASE_URL);
// const socket = io(`${BASE_URL}`);
const socket = io(BASE_URL, {
  transports: ["websocket"], // Force WebSocket transport
});
export default socket;
