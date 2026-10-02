"use client";

import { useEffect } from "react";

export default function RoadStatusLayer({ map, data }) {
  useEffect(() => {
    if (!map) return;

    const sourceId = "road-status-source";
    const layerId = "road-status-layer";

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
              "blocked", "#ef4444",
              "warning", "#f59e0b",
              "open", "#10b981",
              "#3b82f6"
            ],
            "line-width": 4,
            "line-opacity": 0.9,
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
      } catch (err) {}
    };
  }, [map, data]);

  return null;
}
