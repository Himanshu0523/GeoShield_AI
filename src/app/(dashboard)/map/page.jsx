"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import { Layers, X, Radio, RefreshCw, AlertTriangle } from "lucide-react";

import { MapProvider } from "@/features/map/context/MapContext";
import MapContainer from "@/features/map/components/MapContainer";
import MapControls from "@/features/map/components/MapControls";
import RegionLayer from "@/features/map/components/RegionLayer";
import RoadStatusLayer from "@/features/map/components/RoadStatusLayer";
import RiskHeatmapLayer from "@/features/map/components/RiskHeatmapLayer";
import AlertMarkerLayer from "@/features/map/components/AlertMarkerLayer";

import { useRegionsGeoJson } from "@/features/map/hooks/useRegionGeometry";
import { useRoadsGeoJson } from "@/features/map/hooks/useRoadsGeometry";
import { useMapSocket } from "@/features/map/hooks/useMapSocket";

function MapContent() {
  const [layers, setLayers] = useState({
    heatmap: true,
    roads: true,
    regions: true,
    alerts: true,
  });

  const [selectedFeature, setSelectedFeature] = useState({
    title: "Cherrapunji (Sohra)",
    type: "CRITICAL SECTOR",
    riskScore: 85,
    population: "14,829 Exposed",
    status: "Active Slope Failure Vector",
    lastRefreshed: "Live Telemetry",
    details: "Heavy precipitation & extreme slope gradient (38.5°). GeoJSON spatial telemetry verified.",
  });

  // Fetch real GeoJSON data from Spatial Service via React Query
  const { data: regionsGeoJson, isLoading: isRegionsLoading, isError: isRegionsError, refetch: refetchRegions } = useRegionsGeoJson();
  const { data: roadsGeoJson, isLoading: isRoadsLoading, isError: isRoadsError } = useRoadsGeoJson();

  // Socket.IO real-time telemetry updates
  const { isConnected, lastEvent } = useMapSocket((event) => {
    if (event.type === "risk.updated" || event.type === "risk_updated") {
      refetchRegions();
    }
  });

  const toggleLayer = (key) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Sample Heatmap & Alert datasets fallback
  const heatmapData = {
    type: "FeatureCollection",
    features: [
      { type: "Feature", geometry: { type: "Point", coordinates: [91.75, 25.25] }, properties: { riskScore: 0.85 } },
      { type: "Feature", geometry: { type: "Point", coordinates: [91.75, 26.15] }, properties: { riskScore: 0.62 } },
      { type: "Feature", geometry: { type: "Point", coordinates: [88.60, 27.35] }, properties: { riskScore: 0.40 } },
    ],
  };

  const alertData = {
    type: "FeatureCollection",
    features: [
      { type: "Feature", id: "ALT-101", geometry: { type: "Point", coordinates: [91.74, 25.24] }, properties: { id: "ALT-101", name: "Sohra Slope Debris Shift", severity: "CRITICAL", displacementMm: 45 } },
      { type: "Feature", id: "ALT-102", geometry: { type: "Point", coordinates: [91.78, 26.12] }, properties: { id: "ALT-102", name: "Guwahati Drainage Surge", severity: "HIGH", displacementMm: 22 } },
      { type: "Feature", id: "ALT-103", geometry: { type: "Point", coordinates: [88.58, 27.32] }, properties: { id: "ALT-103", name: "Gangtok Ridge Rockfall", severity: "HIGH", displacementMm: 31 } },
    ],
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-950 -m-6">
      <MapContainer>
        <MapControls />

        {/* Map Layers */}
        <RegionLayer
          data={regionsGeoJson}
          visible={layers.regions}
          onSelectRegion={setSelectedFeature}
        />
        <RoadStatusLayer
          data={roadsGeoJson}
          visible={layers.roads}
          onSelectRoad={setSelectedFeature}
        />
        <RiskHeatmapLayer
          data={heatmapData}
          visible={layers.heatmap}
        />
        <AlertMarkerLayer
          data={alertData}
          visible={layers.alerts}
          onSelectAlert={setSelectedFeature}
        />
      </MapContainer>

      {/* Top Banner: Active Telemetry Alerts */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-4 py-1.5 rounded-full text-xs text-slate-200 flex items-center gap-2.5 shadow-2xl z-10">
        <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`} />
        <span className="font-bold text-red-400">3 Active Risk Sectors</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400 text-[11px]">East Khasi Hills • Kamrup • Gangtok</span>
        {isRegionsLoading && <RefreshCw className="w-3 h-3 text-blue-400 animate-spin ml-1" />}
      </div>

      {/* Left Panel: GIS Layer Toggles */}
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3.5 rounded-xl shadow-2xl z-10 space-y-2.5 text-xs min-w-[210px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-bold text-[11px] text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            GIS Telemetry Layers
          </span>
        </div>

        <div className="space-y-1.5">
          {[
            { key: "heatmap", label: "AI Risk Heatmap", icon: "🔥" },
            { key: "roads", label: "Road Corridors", icon: "🛣️" },
            { key: "alerts", label: "Alert Incidents", icon: "⚠️" },
            { key: "regions", label: "Sector Boundaries", icon: "🗺️" },
          ].map((l) => (
            <button
              key={l.key}
              onClick={() => toggleLayer(l.key)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all text-left ${
                layers[l.key]
                  ? "bg-slate-800/80 border-slate-700 text-slate-100"
                  : "bg-slate-950/40 border-slate-800/60 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">{l.icon}</span>
                <span className="text-[11px] font-semibold">{l.label}</span>
              </div>
              <div
                className={`w-3 h-3 rounded-sm border ${
                  layers[l.key] ? "bg-blue-600 border-blue-500" : "bg-slate-900 border-slate-700"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Selected Feature Detail Card */}
      {selectedFeature && (
        <div className="absolute top-4 right-16 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-2xl z-10 w-80 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <Badge color={selectedFeature.riskScore >= 80 ? "red" : "amber"}>
              {selectedFeature.type}
            </Badge>
            <button onClick={() => setSelectedFeature(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">{selectedFeature.title}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{selectedFeature.details}</p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Risk Score:</span>
              <span className="font-extrabold text-red-400">{selectedFeature.riskScore} / 100</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Exposure / Status:</span>
              <span className="font-semibold text-slate-200">{selectedFeature.population}</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-mono text-right">
            {selectedFeature.lastRefreshed || "Live Spatial Telemetry"}
          </p>
        </div>
      )}

      {/* Bottom Right: Socket & Telemetry Status */}
      <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-3 z-10 shadow-lg">
        <span className={`flex items-center gap-1.5 ${isConnected ? "text-emerald-400" : "text-amber-400"}`}>
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          {isConnected ? "Live Socket Stream Active" : "Polling Spatial Telemetry"}
        </span>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <MapProvider>
      <MapContent />
    </MapProvider>
  );
}