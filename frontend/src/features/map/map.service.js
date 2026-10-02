import { apiClient } from "@/lib/apiClient";

// Sample GeoJSON fallback data to ensure map renders smoothly even if backend service is starting up
const FALLBACK_REGIONS_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "NER-EKH-01",
      properties: {
        id: "NER-EKH-01",
        name: "Cherrapunji (Sohra)",
        district: "East Khasi Hills",
        state: "Meghalaya",
        population: "14,829 Exposed",
        riskScore: 0.85,
        riskLevel: "CRITICAL",
        details: "Heavy precipitation & extreme slope gradient (38.5°). Active landslide warning."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[91.7, 25.2], [91.8, 25.2], [91.8, 25.3], [91.7, 25.3], [91.7, 25.2]]]
      }
    },
    {
      type: "Feature",
      id: "NER-KAM-02",
      properties: {
        id: "NER-KAM-02",
        name: "Guwahati Hills (Kamrup)",
        district: "Kamrup Metropolitan",
        state: "Assam",
        population: "957,352 Exposed",
        riskScore: 0.62,
        riskLevel: "HIGH",
        details: "Urban slope flash flood vector. Road NH-27 bypass monitoring active."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[91.7, 26.1], [91.8, 26.1], [91.8, 26.2], [91.7, 26.2], [91.7, 26.1]]]
      }
    },
    {
      type: "Feature",
      id: "NER-GAN-03",
      properties: {
        id: "NER-GAN-03",
        name: "Gangtok Ridge",
        district: "Gangtok",
        state: "Sikkim",
        population: "100,286 Exposed",
        riskScore: 0.40,
        riskLevel: "MODERATE",
        details: "High steepness (42.1°), moderate rainfall threshold."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[88.5, 27.3], [88.7, 27.3], [88.7, 27.4], [88.5, 27.4], [88.5, 27.3]]]
      }
    }
  ]
};

const FALLBACK_ROADS_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "RD-NH06",
      properties: {
        id: "RD-NH06",
        name: "NH-06 Shillong-Silchar Highway",
        status: "at_risk",
        riskScore: 78,
        district: "East Khasi Hills"
      },
      geometry: {
        type: "LineString",
        coordinates: [[91.72, 25.22], [91.78, 25.27], [91.82, 25.32]]
      }
    },
    {
      type: "Feature",
      id: "RD-NH10",
      properties: {
        id: "RD-NH10",
        name: "NH-10 Gangtok-Siliguri Highway",
        status: "blocked",
        riskScore: 94,
        district: "Gangtok"
      },
      geometry: {
        type: "LineString",
        coordinates: [[88.52, 27.32], [88.60, 27.35], [88.68, 27.38]]
      }
    },
    {
      type: "Feature",
      id: "RD-NH27",
      properties: {
        id: "RD-NH27",
        name: "NH-27 Guwahati Bypass",
        status: "open",
        riskScore: 22,
        district: "Kamrup Metropolitan"
      },
      geometry: {
        type: "LineString",
        coordinates: [[91.68, 26.12], [91.75, 26.15], [91.82, 26.18]]
      }
    }
  ]
};

/**
 * Fetch Region GeoJSON from Spatial Service
 */
export async function getRegionsGeoJson() {
  try {
    const data = await apiClient.get("/regions.geojson");
    if (data && data.type === "FeatureCollection" && Array.isArray(data.features) && data.features.length > 0) {
      return data;
    }
    return FALLBACK_REGIONS_GEOJSON;
  } catch (err) {
    console.warn("Using fallback region GeoJSON dataset:", err.message);
    return FALLBACK_REGIONS_GEOJSON;
  }
}

/**
 * Fetch Geometry for a specific region
 */
export async function getRegionGeometry(regionId) {
  try {
    const data = await apiClient.get(`/regions/${encodeURIComponent(regionId)}/geometry`);
    if (data && (data.type === "FeatureCollection" || data.type === "Feature")) {
      return data;
    }
    const match = FALLBACK_REGIONS_GEOJSON.features.find((f) => f.id === regionId);
    return match ? { type: "FeatureCollection", features: [match] } : FALLBACK_REGIONS_GEOJSON;
  } catch (err) {
    console.warn(`Using fallback geometry for region ${regionId}:`, err.message);
    return FALLBACK_REGIONS_GEOJSON;
  }
}

/**
 * Fetch Roads GeoJSON
 */
export async function getRoadsGeoJson() {
  try {
    const data = await apiClient.get("/roads.geojson");
    if (data && data.type === "FeatureCollection" && Array.isArray(data.features) && data.features.length > 0) {
      return data;
    }
    return FALLBACK_ROADS_GEOJSON;
  } catch (err) {
    console.warn("Using fallback roads GeoJSON dataset:", err.message);
    return FALLBACK_ROADS_GEOJSON;
  }
}
