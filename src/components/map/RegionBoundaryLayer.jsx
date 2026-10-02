"use client";

import { useEffect } from "react";

export default function RegionBoundaryLayer({ map, data }) {
  useEffect(() => {
    if (!map) return;

    const sourceId = "region-boundary-source";
    const fillLayerId = "region-boundary-fill";
    const lineLayerId = "region-boundary-line";

    const addLayer = () => {
      if (map.getSource(sourceId)) {
        map.getSource(sourceId).setData(data);
      } else {
        map.addSource(sourceId, {
          type: "geojson",
          data: data,
        });
      }

      if (!map.getLayer(fillLayerId)) {
        map.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": "#3b82f6",
            "fill-opacity": 0.15,
          },
        });
      }

      if (!map.getLayer(lineLayerId)) {
        map.addLayer({
          id: lineLayerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": "#60a5fa",
            "line-width": 2,
            "line-dasharray": [2, 2],
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
        if (map && map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
        if (map && map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
        if (map && map.getSource(sourceId)) map.removeSource(sourceId);
      } catch (err) {}
    };
  }, [map, data]);

  return null;
}
