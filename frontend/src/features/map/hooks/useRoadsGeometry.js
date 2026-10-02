"use client";

import { useQuery } from "@tanstack/react-query";
import { getRoadsGeoJson } from "../map.service";

export function useRoadsGeoJson() {
  return useQuery({
    queryKey: ["roads-geojson"],
    queryFn: getRoadsGeoJson,
    staleTime: 60_000,
    retry: 1,
  });
}
