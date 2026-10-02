"use client";

import { useEffect } from "react";

export default function LandslideLayer({ map, data }) {
  useEffect(() => {
    if (!map) return;

    const sourceId = "landslide-source";
    const layerId = "landslide-layer";
    const haloId = "landslide-halo";

    const addLayer = () => {
      if (map.getSource(sourceId)) {
        map.getSource(sourceId).setData(data);
      } else {
        map.addSource(sourceId, {
          type: "geojson",
          data: data,
        });
      }

      if (!map.getLayer(haloId)) {
        map.addLayer({
          id: haloId,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-radius": 14,
            "circle-color": "rgba(239, 68, 68, 0.3)",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ef4444",
          },
        });
      }

      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-radius": 7,
            "circle-color": "#ef4444",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
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
        if (map && map.getLayer(layerId)) map.removeLayer(layerId);
        if (map && map.getLayer(haloId)) map.removeLayer(haloId);
        if (map && map.getSource(sourceId)) map.removeSource(sourceId);
      } catch (err) {}
    };
  }, [map, data]);

  return null;
}
