"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket, connectSocket, disconnectSocket } from "@/lib/socketClient";
import { WifiOff } from "lucide-react";

const SocketContext = createContext({
  socket: null,
  isConnected: false,
  isReconnecting: false,
});

export function SocketProvider({ children, token }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const socketRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      socketRef.current = null;
      return;
    }

    const sock = connectSocket();
    socketRef.current = sock;

    const onConnect = () => {
      setIsConnected(true);
      setIsReconnecting(false);
      // Invalidate queries to catch up on any missed events while disconnected
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      queryClient.invalidateQueries({ queryKey: ["roads"] });
    };

    const onDisconnect = (reason) => {
      setIsConnected(false);
      if (reason !== "io client disconnect") {
        setIsReconnecting(true);
      }
    };

    const onReconnectAttempt = () => {
      setIsReconnecting(true);
    };

    // Central Real-Time React Query Cache Handlers
    const onAlertNew = (newAlert) => {
      queryClient.setQueryData(["alerts"], (old) => {
        if (!old) return [newAlert];
        if (Array.isArray(old)) {
          return [newAlert, ...old.filter((a) => a.id !== newAlert.id)];
        }
        return old;
      });
      queryClient.invalidateQueries({ queryKey: ["alerts", "geojson"] });
    };

    const onAlertResolved = ({ id }) => {
      queryClient.setQueryData(["alerts"], (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((a) => (a.id === id ? { ...a, status: "resolved" } : a));
      });
      queryClient.invalidateQueries({ queryKey: ["alerts", "geojson"] });
    };

    const onRegionRiskUpdated = ({ regionId, score }) => {
      queryClient.setQueryData(["regions", regionId], (old) => {
        if (!old) return old;
        return { ...old, riskScore: score };
      });
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      queryClient.invalidateQueries({ queryKey: ["regions", "geojson"] });
    };

    sock.on("connect", onConnect);
    sock.on("disconnect", onDisconnect);
    sock.on("reconnect_attempt", onReconnectAttempt);
    sock.on("alert:new", onAlertNew);
    sock.on("alert:resolved", onAlertResolved);
    sock.on("region:risk-updated", onRegionRiskUpdated);

    if (sock.connected) {
      onConnect();
    }

    return () => {
      sock.off("connect", onConnect);
      sock.off("disconnect", onDisconnect);
      sock.off("reconnect_attempt", onReconnectAttempt);
      sock.off("alert:new", onAlertNew);
      sock.off("alert:resolved", onAlertResolved);
      sock.off("region:risk-updated", onRegionRiskUpdated);
      disconnectSocket();
    };
  }, [token, queryClient]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, isReconnecting }}>
      {/* Reconnection status banner */}
      {isReconnecting && (
        <div className="fixed top-0 inset-x-0 z-50 bg-amber-500/90 backdrop-blur-md text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-lg animate-fade-in">
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          <span>Live updates paused. Reconnecting to GeoShield Telemetry Gateway...</span>
        </div>
      )}
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

/**
 * Custom hook to subscribe to a specific WebSocket event with auto cleanup on unmount
 */
export function useSocketEvent(event, handler) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !event || !handler) return;

    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
}
