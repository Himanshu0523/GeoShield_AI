"use client";

import { useEffect } from "react";

export default function RiskHeatmapLayer({ map, data }) {
  useEffect(() => {
    if (!map) return;

    const sourceId = "risk-heatmap-source";
    const layerId = "risk-heatmap-layer";

    const addLayer = () => {
      if (map.getSource(sourceId)) {
        map.getSource(sourceId).setData(data);
      } else {
        map.addSource(sourceId, {
          type: "geojson",
          data: data,
        });
      }

      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "heatmap",
          source: sourceId,
          maxzoom: 15,
          paint: {
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["coalesce", ["get", "riskScore"], 0],
              0, 0,
              1, 1
            ],
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 1,
              15, 3
            ],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(0, 0, 0, 0)",
              0.2, "rgb(59, 130, 246)",
              0.4, "rgb(16, 185, 129)",
              0.6, "rgb(245, 158, 11)",
              0.8, "rgb(239, 68, 68)",
              1, "rgb(220, 38, 38)"
            ],
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 4,
              15, 30
            ],
            "heatmap-opacity": 0.85,
          },
        });
      }
    };

    if (map.isStyleLoaded()) {
      addLayer();
    } else {
      map.once("styledata", addLayer);
    }

    return () => {
      try {
        if (map && map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map && map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      } catch (err) {
        // map instance might already be torn down
      }
    };
  }, [map, data]);

  return null;
}
