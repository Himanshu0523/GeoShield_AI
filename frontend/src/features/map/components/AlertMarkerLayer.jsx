"use client";

import { useEffect } from "react";
import * as maplibregl from "maplibre-gl";
import { useMap } from "../context/MapContext";
import { LAYER_IDS } from "../map.config";

export default function AlertMarkerLayer({ data, visible = true, onSelectAlert }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !data) return;

    const sourceId = LAYER_IDS.ALERTS_SOURCE;
    const clusterId = LAYER_IDS.ALERTS_CLUSTERS;
    const clusterCountId = LAYER_IDS.ALERTS_CLUSTER_COUNT;
    const unclusteredId = LAYER_IDS.ALERTS_UNCLUSTERED;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Cluster circles
      map.addLayer({
        id: clusterId,
        type: "circle",
        source: sourceId,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#f59e0b",
            5,
            "#f97316",
            15,
            "#ef4444",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            18,
            5,
            24,
            15,
            30,
          ],
        },
      });

      // Cluster text count
      map.addLayer({
        id: clusterCountId,
        type: "symbol",
        source: sourceId,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Unclustered individual alert points
      map.addLayer({
        id: unclusteredId,
        type: "circle",
        source: sourceId,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#ef4444",
          "circle-radius": 7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Click on cluster expands zoom
      map.on("click", clusterId, (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: [clusterId] });
        const clusterIdVal = features[0].properties.cluster_id;
        map.getSource(sourceId).getClusterExpansionZoom(clusterIdVal, (err, zoom) => {
          if (err) return;
          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
      });

      // Click on individual point opens popup/detail
      map.on("click", unclusteredId, (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const coordinates = feature.geometry.coordinates.slice();
        const props = feature.properties;

        // Render MapLibre Popup
        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div style="font-family: sans-serif; padding: 4px; color: #0f172a;">
              <strong style="color: #dc2626; display: block; font-size: 13px;">${props.name || "Incident Alert"}</strong>
              <div style="font-size: 11px; margin-top: 2px;">Severity: <b>${props.severity || "HIGH"}</b></div>
              <div style="font-size: 11px;">Displacement: ${props.displacementMm || 0}mm</div>
            </div>
          `)
          .addTo(map);

        if (onSelectAlert) {
          onSelectAlert({
            id: props.id || "ALERT",
            title: props.name || "Telemetry Alert Marker",
            type: `ALERT ${props.severity || "CRITICAL"}`,
            riskScore: props.displacementMm ? Math.min(100, props.displacementMm * 2) : 88,
            population: "Sensor Zone Active",
            status: "Field Incident Verified",
            details: `Alert event at [${coordinates[0].toFixed(2)}, ${coordinates[1].toFixed(2)}]. Displacement: ${props.displacementMm || "N/A"}mm.`,
            properties: props,
          });
        }
      });

      map.on("mouseenter", clusterId, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", clusterId, () => { map.getCanvas().style.cursor = ""; });
      map.on("mouseenter", unclusteredId, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", unclusteredId, () => { map.getCanvas().style.cursor = ""; });
    } else {
      const source = map.getSource(sourceId);
      if (source) {
        source.setData(data);
      }
    }

    [clusterId, clusterCountId, unclusteredId].forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", visible ? "visible" : "none");
      }
    });
  }, [map, isLoaded, data, visible, onSelectAlert]);

  useEffect(() => {
    return () => {
      if (!map || !map.isStyleLoaded()) return;
      const ids = [LAYER_IDS.ALERTS_CLUSTERS, LAYER_IDS.ALERTS_CLUSTER_COUNT, LAYER_IDS.ALERTS_UNCLUSTERED];
      const sourceId = LAYER_IDS.ALERTS_SOURCE;

      ids.forEach((id) => { if (map.getLayer(id)) map.removeLayer(id); });
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map]);

  return null;
}
