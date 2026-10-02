"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { MAP_CONFIG } from "../map.config";
import { useMap } from "../context/MapContext";

export default function MapContainer({ children }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const { setMap, setIsLoaded } = useMap();

  useEffect(() => {
    if (typeof window !== "undefined" && maplibregl.setWorkerUrl) {
      maplibregl.setWorkerUrl("https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl-csp-worker.js");
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_CONFIG.style,
      center: MAP_CONFIG.center,
      zoom: MAP_CONFIG.zoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
      pitch: MAP_CONFIG.pitch,
      bearing: MAP_CONFIG.bearing,
      attributionControl: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      console.log("GeoShield MapLibre GL instance initialized and loaded.");
      setMap(map);
      setIsLoaded(true);
    });

    map.on("error", (event) => {
      const errMsg = event?.error?.message || "";
      if (errMsg.includes("crimea") || errMsg.includes("is not a valid GeoJSON object")) {
        return; // Suppress non-fatal legacy demotiles boundary notice
      }

      if (
        event?.error?.message?.includes("style") ||
        event?.error?.status === 404 ||
        event?.error?.status === 0
      ) {
        console.warn("Switching to high-availability inline OpenStreetMap tile fallback style...");
        try {
          map.setStyle(MAP_CONFIG.fallbackStyle);
        } catch (e) {
          console.error("Fallback style load error:", e);
        }
      } else if (errMsg) {
        console.warn("MapLibre GL Notice:", errMsg);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMap(null);
        setIsLoaded(false);
      }
    };
  }, [setMap, setIsLoaded]);

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-slate-950">
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0"
        aria-label="GeoShield interactive map container"
      />
      {children}
    </div>
  );
}
