"use client";

import { useEffect, useState } from "react";
import { getSocket, connectSocket } from "@/lib/socketClient";

export function useMapSocket(onRealtimeEvent) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    const socket = connectSocket();
    if (!socket) return;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleRiskUpdate = (data) => {
      console.log("Realtime Risk Event Received:", data);
      const eventInfo = { type: "risk.updated", data, timestamp: new Date() };
      setLastEvent(eventInfo);
      if (onRealtimeEvent) onRealtimeEvent(eventInfo);
    };

    const handleAlertNew = (data) => {
      console.log("Realtime Alert Event Received:", data);
      const eventInfo = { type: "alert:new", data, timestamp: new Date() };
      setLastEvent(eventInfo);
      if (onRealtimeEvent) onRealtimeEvent(eventInfo);
    };

    const handleRoadUpdate = (data) => {
      console.log("Realtime Road Status Event Received:", data);
      const eventInfo = { type: "road:updated", data, timestamp: new Date() };
      setLastEvent(eventInfo);
      if (onRealtimeEvent) onRealtimeEvent(eventInfo);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("risk.updated", handleRiskUpdate);
    socket.on("risk_updated", handleRiskUpdate);
    socket.on("alert:new", handleAlertNew);
    socket.on("road:updated", handleRoadUpdate);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("risk.updated", handleRiskUpdate);
      socket.off("risk_updated", handleRiskUpdate);
      socket.off("alert:new", handleAlertNew);
      socket.off("road:updated", handleRoadUpdate);
    };
  }, [onRealtimeEvent]);

  return { isConnected, lastEvent };
}
