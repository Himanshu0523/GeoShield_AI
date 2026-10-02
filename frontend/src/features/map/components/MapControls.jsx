"use client";

import { useMap } from "../context/MapContext";
import { MAP_CONFIG } from "../map.config";
import { Plus, Minus, RotateCcw, Compass } from "lucide-react";

export default function MapControls() {
  const { map, isLoaded } = useMap();

  if (!map || !isLoaded) return null;

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleResetView = () => {
    map.easeTo({
      center: MAP_CONFIG.center,
      zoom: MAP_CONFIG.zoom,
      bearing: 0,
      pitch: 0,
      duration: 1000,
    });
  };

  const handleResetNorth = () => {
    map.resetNorthPitch();
  };

  return (
    <div className="absolute right-4 top-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-2xl">
      <button
        onClick={handleZoomIn}
        className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        title="Zoom In"
        aria-label="Zoom in"
      >
        <Plus className="w-4 h-4" />
      </button>

      <button
        onClick={handleZoomOut}
        className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        title="Zoom Out"
        aria-label="Zoom out"
      >
        <Minus className="w-4 h-4" />
      </button>

      <div className="w-full h-px bg-slate-800 my-0.5" />

      <button
        onClick={handleResetView}
        className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        title="Reset Initial Extent"
        aria-label="Reset view"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        onClick={handleResetNorth}
        className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        title="Reset North/Bearing"
        aria-label="Reset compass bearing"
      >
        <Compass className="w-4 h-4" />
      </button>
    </div>
  );
}
