"use client";

import { useEffect } from "react";
import { useMap } from "../context/MapContext";
import { LAYER_IDS } from "../map.config";

export default function RegionLayer({ data, visible = true, onSelectRegion }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !data) return;

    const sourceId = LAYER_IDS.REGIONS_SOURCE;
    const fillId = LAYER_IDS.REGIONS_FILL;
    const lineId = LAYER_IDS.REGIONS_OUTLINE;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data,
      });

      // Polygon fill layer styled by risk level / score
      map.addLayer({
        id: fillId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "risk_level"], "CRITICAL"],
            "#ef4444",
            ["==", ["get", "risk_level"], "HIGH"],
            "#f97316",
            ["==", ["get", "risk_level"], "MODERATE"],
            "#eab308",
            "#3b82f6",
          ],
          "fill-opacity": 0.25,
        },
      });

      // Polygon outline border
      map.addLayer({
        id: lineId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "risk_level"], "CRITICAL"],
            "#dc2626",
            ["==", ["get", "risk_level"], "HIGH"],
            "#ea580c",
            ["==", ["get", "risk_level"], "MODERATE"],
            "#ca8a04",
            "#2563eb",
          ],
          "line-width": 2,
        },
      });

      // Click event on region fill
      map.on("click", fillId, (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        if (onSelectRegion) {
          onSelectRegion({
            id: feature.properties.id || feature.properties.region_code,
            title: feature.properties.name || "Region Boundary",
            type: feature.properties.risk_level || "SECTOR",
            riskScore: Math.round((feature.properties.risk_score || 0.5) * 100),
            population: feature.properties.population ? `${feature.properties.population} Exposed` : "Active Grid",
            status: `Sector ${feature.properties.district || feature.properties.state || ""}`,
            details: feature.properties.details || `Slope: ${feature.properties.slope_deg || "N/A"}°. GeoJSON boundary verified.`,
            properties: feature.properties,
          });
        }
      });

      // Mouseenter / Mouseleave hover cursor
      map.on("mouseenter", fillId, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", fillId, () => {
        map.getCanvas().style.cursor = "";
      });
    } else {
      const source = map.getSource(sourceId);
      if (source) {
        source.setData(data);
      }
    }

    // Set visibility
    if (map.getLayer(fillId)) {
      map.setLayoutProperty(fillId, "visibility", visible ? "visible" : "none");
    }
    if (map.getLayer(lineId)) {
      map.setLayoutProperty(lineId, "visibility", visible ? "visible" : "none");
    }
  }, [map, isLoaded, data, visible, onSelectRegion]);

  // Clean up layer and source on component unmount
  useEffect(() => {
    return () => {
      if (!map || !map.isStyleLoaded()) return;
      const fillId = LAYER_IDS.REGIONS_FILL;
      const lineId = LAYER_IDS.REGIONS_OUTLINE;
      const sourceId = LAYER_IDS.REGIONS_SOURCE;

      if (map.getLayer(fillId)) map.removeLayer(fillId);
      if (map.getLayer(lineId)) map.removeLayer(lineId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map]);

  return null;
}
