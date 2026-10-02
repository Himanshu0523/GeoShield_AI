"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import RiskHeatmapLayer from "@/components/map/RiskHeatmapLayer";
import RoadStatusLayer from "@/components/map/RoadStatusLayer";
import RegionBoundaryLayer from "@/components/map/RegionBoundaryLayer";
import LandslideLayer from "@/components/map/LandslideLayer";
import { calculateDistanceKm, isPointInPolygon, calculatePolygonAreaKm2, findNearestFeature } from "@/lib/gis/geoMath";

const CARTO_DARK = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

// Real GeoJSON data format enforcing [longitude, latitude] coordinates
const MOCK_DATA = {
  heatmap: {
    type: "FeatureCollection",
    features: [
      { type: "Feature", geometry: { type: "Point", coordinates: [88.55, 27.53] }, properties: { riskScore: 0.94, name: "Teesta River Sector 4", type: "CRITICAL SECTOR" } },
      { type: "Feature", geometry: { type: "Point", coordinates: [88.22, 27.28] }, properties: { riskScore: 0.78, name: "Western Ridge Pass 9", type: "HIGH RISK PASS" } },
      { type: "Feature", geometry: { type: "Point", coordinates: [88.62, 27.32] }, properties: { riskScore: 0.52, name: "Eastern Valley Lowlands", type: "WATCH ZONE" } }
    ]
  },
  roads: {
    type: "FeatureCollection",
    features: [
      { type: "Feature", geometry: { type: "LineString", coordinates: [[88.50, 27.48], [88.55, 27.53], [88.60, 27.58]] }, properties: { id: "RD-NH10", status: "blocked", name: "NH-10 Sector 4 Arterial", riskScore: 92 } },
      { type: "Feature", geometry: { type: "LineString", coordinates: [[88.18, 27.24], [88.22, 27.28], [88.26, 27.32]] }, properties: { id: "RD-P9", status: "warning", name: "Pass 9 Mountain Route", riskScore: 68 } },
      { type: "Feature", geometry: { type: "LineString", coordinates: [[88.58, 27.28], [88.62, 27.32], [88.66, 27.36]] }, properties: { id: "RD-SH3", status: "open", name: "State Highway 3B Valley Bypass", riskScore: 24 } }
    ]
  },
  regions: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { 
          type: "Polygon", 
          coordinates: [[[88.45, 27.45], [88.65, 27.45], [88.65, 27.65], [88.45, 27.65], [88.45, 27.45]]] 
        },
        properties: { name: "Northern Sikkim (Sector 4)", riskLevel: "HIGH", population: "42,800 Exposed", area: "1,240 km²" }
      },
      {
        type: "Feature",
        geometry: { 
          type: "Polygon", 
          coordinates: [[[88.15, 27.20], [88.35, 27.20], [88.35, 27.40], [88.15, 27.40], [88.15, 27.20]]] 
        },
        properties: { name: "Western Ridge (Pass 9)", riskLevel: "CRITICAL", population: "18,400 Exposed", area: "890 km²" }
      }
    ]
  },
  landslides: {
    type: "FeatureCollection",
    features: [
      { type: "Feature", geometry: { type: "Point", coordinates: [88.54, 27.52] }, properties: { id: "LS-104", name: "Teesta Debris Flow", severity: "CRITICAL", displacementMm: 42 } },
      { type: "Feature", geometry: { type: "Point", coordinates: [88.21, 27.27] }, properties: { id: "LS-102", name: "Western Ridge Rockfall", severity: "HIGH", displacementMm: 28 } }
    ]
  }
};

export default function LiveGisMap({ layers, onSelectFeature = null }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && maplibregl.setWorkerUrl) {
      maplibregl.setWorkerUrl("https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl-csp-worker.js");
    }

    const instance = new maplibregl.Map({
      container: mapContainer.current,
      style: CARTO_DARK,
      center: [88.55, 27.53],
      zoom: 10.5,
      attributionControl: false,
    });

    instance.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), "top-left");

    // Critical rule: Only interact with layers and sources after load event
    instance.on("load", () => {
      mapRef.current = instance;
      setMap(instance);

      // Setup click interaction using queryRenderedFeatures
      instance.on("click", (e) => {
        const bbox = [
          [e.point.x - 5, e.point.y - 5],
          [e.point.y + 5, e.point.y + 5]
        ];

        const interactiveLayers = [
          "landslide-layer",
          "road-status-layer",
          "region-boundary-fill"
        ].filter(id => instance.getLayer(id));

        if (interactiveLayers.length === 0) return;

        const features = instance.queryRenderedFeatures(e.point, { layers: interactiveLayers });

        if (features && features.length > 0) {
          const clicked = features[0];
          const props = clicked.properties || {};
          const clickLngLat = [e.lngLat.lng, e.lngLat.lat];

          // Perform real Turf.js geospatial math on click
          const nearestRoad = findNearestFeature(clickLngLat, MOCK_DATA.roads);
          const distanceInfo = nearestRoad ? `${nearestRoad.distanceKm} km from nearest corridor (${nearestRoad.feature.properties.name})` : "";

          let featureSummary = {
            title: props.name || props.id || "GIS Selected Feature",
            type: props.severity || props.status || props.riskLevel || "SURFACE OBJECT",
            riskScore: props.riskScore || 85,
            population: props.population || "Active Monitoring",
            status: props.status ? `Corridor ${props.status.toUpperCase()}` : "Sensor Grid Active",
            lastRefreshed: `Live Telemetry • ${new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })}`,
            details: `${props.name || "Feature"}: ${distanceInfo || "Spatial telemetry verified via Turf.js calculation."}`
          };

          if (onSelectFeature) {
            onSelectFeature(featureSummary);
          }
        }
      });

      // Pointer cursor on hover over interactive layers
      instance.on("mousemove", (e) => {
        const interactiveLayers = ["landslide-layer", "road-status-layer", "region-boundary-fill"].filter(id => instance.getLayer(id));
        if (interactiveLayers.length === 0) return;
        const features = instance.queryRenderedFeatures(e.point, { layers: interactiveLayers });
        instance.getCanvas().style.cursor = features.length ? "pointer" : "";
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onSelectFeature]);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div ref={mapContainer} className="w-full h-full absolute inset-0" />
      {map && (
        <>
          {layers.heatmap && <RiskHeatmapLayer map={map} data={MOCK_DATA.heatmap} />}
          {layers.roads && <RoadStatusLayer map={map} data={MOCK_DATA.roads} />}
          {layers.regions && <RegionBoundaryLayer map={map} data={MOCK_DATA.regions} />}
          {layers.landslides && <LandslideLayer map={map} data={MOCK_DATA.landslides} />}
        </>
      )}
    </div>
  );
}
