"use client";

import { useQuery } from "@tanstack/react-query";
import { getRegionsGeoJson, getRegionGeometry } from "../map.service";

export function useRegionsGeoJson() {
  return useQuery({
    queryKey: ["regions-geojson"],
    queryFn: getRegionsGeoJson,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useRegionGeometry(regionId) {
  return useQuery({
    queryKey: ["region-geometry", regionId],
    queryFn: () => getRegionGeometry(regionId),
    enabled: Boolean(regionId),
    staleTime: 60_000,
    retry: 1,
  });
}
