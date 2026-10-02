import * as turf from "@turf/turf";

/**
 * GeoShield Turf.js Spatial Math Utility Library
 * Enforces [longitude, latitude] coordinate ordering standard.
 */

/**
 * Validates coordinate order [longitude, latitude]
 */
export function validateCoordinates(lng, lat) {
  if (typeof lng !== "number" || typeof lat !== "number") {
    throw new Error(`Invalid coordinates: [${lng}, ${lat}] must be numbers.`);
  }
  if (lng < -180 || lng > 180) {
    throw new Error(`Longitude ${lng} out of range [-180, 180]. Check [lng, lat] order.`);
  }
  if (lat < -90 || lat > 90) {
    throw new Error(`Latitude ${lat} out of range [-90, 90]. Check [lng, lat] order.`);
  }
  return [lng, lat];
}

/**
 * Calculates distance between two point coordinates in kilometers
 * @param {[number, number]} fromCoords - [longitude, latitude]
 * @param {[number, number]} toCoords - [longitude, latitude]
 * @returns {number} Distance in kilometers (rounded to 2 decimals)
 */
export function calculateDistanceKm(fromCoords, toCoords) {
  validateCoordinates(fromCoords[0], fromCoords[1]);
  validateCoordinates(toCoords[0], toCoords[1]);

  const from = turf.point(fromCoords);
  const to = turf.point(toCoords);
  const distance = turf.distance(from, to, { units: "kilometers" });
  return Math.round(distance * 100) / 100;
}

/**
 * Determines if a point is contained inside a polygon or multi-polygon
 * @param {[number, number]} pointCoords - [longitude, latitude]
 * @param {object} polygonGeoJson - GeoJSON Feature or Geometry of Polygon
 * @returns {boolean}
 */
export function isPointInPolygon(pointCoords, polygonGeoJson) {
  validateCoordinates(pointCoords[0], pointCoords[1]);
  const pt = turf.point(pointCoords);
  return turf.booleanPointInPolygon(pt, polygonGeoJson);
}

/**
 * Calculates the surface area of a polygon in square kilometers
 * @param {object} polygonGeoJson - GeoJSON Polygon Feature
 * @returns {number} Area in km² (rounded to 2 decimals)
 */
export function calculatePolygonAreaKm2(polygonGeoJson) {
  const areaM2 = turf.area(polygonGeoJson);
  const areaKm2 = areaM2 / 1_000_000;
  return Math.round(areaKm2 * 100) / 100;
}

/**
 * Finds the nearest feature from a target point among a FeatureCollection
 * @param {[number, number]} targetCoords - [longitude, latitude]
 * @param {object} featureCollection - GeoJSON FeatureCollection
 * @returns {object|null} { nearestFeature, distanceKm }
 */
export function findNearestFeature(targetCoords, featureCollection) {
  validateCoordinates(targetCoords[0], targetCoords[1]);
  if (!featureCollection || !featureCollection.features || featureCollection.features.length === 0) {
    return null;
  }

  const targetPoint = turf.point(targetCoords);
  let minDistance = Infinity;
  let nearest = null;

  for (const feature of featureCollection.features) {
    // For points
    if (feature.geometry.type === "Point") {
      const dist = turf.distance(targetPoint, feature, { units: "kilometers" });
      if (dist < minDistance) {
        minDistance = dist;
        nearest = feature;
      }
    } else if (feature.geometry.type === "LineString") {
      // Calculate distance to nearest point on line
      const lineDistance = turf.pointToLineDistance(targetPoint, feature, { units: "kilometers" });
      if (lineDistance < minDistance) {
        minDistance = lineDistance;
        nearest = feature;
      }
    }
  }

  return {
    feature: nearest,
    distanceKm: Math.round(minDistance * 100) / 100,
  };
}

/**
 * Builds a valid GeoJSON Point Feature
 */
export function buildPointFeature(lng, lat, properties = {}) {
  validateCoordinates(lng, lat);
  return turf.point([lng, lat], properties);
}

/**
 * Builds a valid closed GeoJSON Polygon Feature
 */
export function buildPolygonFeature(coordinateRings, properties = {}) {
  // Ensure first and last coordinate match (closed ring)
  const rings = coordinateRings.map(ring => {
    if (ring.length < 3) throw new Error("Polygon ring requires at least 3 coordinates.");
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      return [...ring, first]; // close ring
    }
    return ring;
  });
  return turf.polygon(rings, properties);
}

/**
 * Wraps an array of Features into a FeatureCollection
 */
export function buildFeatureCollection(features = []) {
  return turf.featureCollection(features);
}
