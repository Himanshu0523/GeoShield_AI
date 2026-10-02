export const FALLBACK_MAP_STYLE = {
  version: 8,
  name: "GeoShield Base Tile Fallback",
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors"
    }
  },
  layers: [
    {
      id: "osm-tiles-layer",
      type: "raster",
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

export const MAP_CONFIG = {
  style:
    process.env.NEXT_PUBLIC_MAP_STYLE_URL ||
    "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  fallbackStyle: FALLBACK_MAP_STYLE,
  center: [91.75, 25.7], // North-East India [longitude, latitude]
  zoom: 7.5,
  minZoom: 3,
  maxZoom: 19,
  pitch: 0,
  bearing: 0,
};

export const LAYER_IDS = {
  REGIONS_SOURCE: "geoshield-regions-source",
  REGIONS_FILL: "geoshield-regions-fill",
  REGIONS_OUTLINE: "geoshield-regions-outline",
  ROADS_SOURCE: "geoshield-roads-source",
  ROADS_LINE: "geoshield-roads-line",
  HEATMAP_SOURCE: "geoshield-heatmap-source",
  HEATMAP_LAYER: "geoshield-heatmap-layer",
  ALERTS_SOURCE: "geoshield-alerts-source",
  ALERTS_CLUSTERS: "geoshield-alerts-clusters",
  ALERTS_CLUSTER_COUNT: "geoshield-alerts-cluster-count",
  ALERTS_UNCLUSTERED: "geoshield-alerts-unclustered-point",
};
