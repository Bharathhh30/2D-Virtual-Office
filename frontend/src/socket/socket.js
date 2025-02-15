import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Change if deployed

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;