"use client";

import { useEffect } from "react";
import { useMap } from "../context/MapContext";
import { LAYER_IDS } from "../map.config";

export default function RoadStatusLayer({ data, visible = true, onSelectRoad }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !data) return;

    const sourceId = LAYER_IDS.ROADS_SOURCE;
    const lineId = LAYER_IDS.ROADS_LINE;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data,
      });

      map.addLayer({
        id: lineId,
        type: "line",
        source: sourceId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": [
            "match",
            ["get", "status"],
            "blocked",
            "#ef4444",
            "at_risk",
            "#f59e0b",
            "warning",
            "#f59e0b",
            "open",
            "#10b981",
            "#64748b",
          ],
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });

      map.on("click", lineId, (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        if (onSelectRoad) {
          onSelectRoad({
            id: feature.properties.id || "ROAD",
            title: feature.properties.name || "Road Corridor",
            type: `CORRIDOR ${String(feature.properties.status || "").toUpperCase()}`,
            riskScore: feature.properties.riskScore || 50,
            population: "Transport Corridor",
            status: feature.properties.status || "MONITORED",
            details: `District: ${feature.properties.district || "N/A"}. Live status telemetry verified.`,
            properties: feature.properties,
          });
        }
      });

      map.on("mouseenter", lineId, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", lineId, () => {
        map.getCanvas().style.cursor = "";
      });
    } else {
      const source = map.getSource(sourceId);
      if (source) {
        source.setData(data);
      }
    }

    if (map.getLayer(lineId)) {
      map.setLayoutProperty(lineId, "visibility", visible ? "visible" : "none");
    }
  }, [map, isLoaded, data, visible, onSelectRoad]);

  useEffect(() => {
    return () => {
      if (!map || !map.isStyleLoaded()) return;
      const lineId = LAYER_IDS.ROADS_LINE;
      const sourceId = LAYER_IDS.ROADS_SOURCE;

      if (map.getLayer(lineId)) map.removeLayer(lineId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map]);

  return null;
}
