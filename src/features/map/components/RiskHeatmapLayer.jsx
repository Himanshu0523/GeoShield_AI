"use client";

import { useEffect } from "react";
import { useMap } from "../context/MapContext";
import { LAYER_IDS } from "../map.config";

export default function RiskHeatmapLayer({ data, visible = true }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !data) return;

    const sourceId = LAYER_IDS.HEATMAP_SOURCE;
    const heatmapId = LAYER_IDS.HEATMAP_LAYER;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data,
      });

      map.addLayer({
        id: heatmapId,
        type: "heatmap",
        source: sourceId,
        maxzoom: 15,
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "riskScore"],
            0, 0,
            1, 1
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 1,
            9, 3
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(33,102,172,0)",
            0.2, "rgb(103,169,207)",
            0.4, "rgb(209,229,240)",
            0.6, "rgb(253,219,199)",
            0.8, "rgb(239,138,98)",
            1, "rgb(178,24,43)"
          ],
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 4,
            9, 25
          ],
          "heatmap-opacity": 0.8,
        },
      });
    } else {
      const source = map.getSource(sourceId);
      if (source) {
        source.setData(data);
      }
    }

    if (map.getLayer(heatmapId)) {
      map.setLayoutProperty(heatmapId, "visibility", visible ? "visible" : "none");
    }
  }, [map, isLoaded, data, visible]);

  useEffect(() => {
    return () => {
      if (!map || !map.isStyleLoaded()) return;
      const heatmapId = LAYER_IDS.HEATMAP_LAYER;
      const sourceId = LAYER_IDS.HEATMAP_SOURCE;

      if (map.getLayer(heatmapId)) map.removeLayer(heatmapId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map]);

  return null;
}
