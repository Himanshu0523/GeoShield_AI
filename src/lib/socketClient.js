import { io } from "socket.io-client";
import { getStoredToken } from "@/lib/apiClient";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080";

let socketInstance = null;

/**
 * Initializes or returns the single app-wide Socket.io client
 */
export function getSocket() {
  if (typeof window === "undefined") return null;

  if (!socketInstance) {
    const token = getStoredToken();
    socketInstance = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ["websocket", "polling"],
    });
  }

  return socketInstance;
}

/**
 * Updates auth token before connecting or reconnecting
 */
export function connectSocket() {
  const socket = getSocket();
  if (!socket) return null;

  const token = getStoredToken();
  socket.auth = { token };

  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

/**
 * Disconnects socket cleanly on user logout
 */
export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
