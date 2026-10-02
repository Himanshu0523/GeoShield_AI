import { apiClient } from "@/lib/apiClient";

export const regionService = {
  async getRegions() {
    return await apiClient.get("/regions");
  },

  async getRegionById(id) {
    return await apiClient.get(`/regions/${id}`);
  },

  async getRegionsGeoJson() {
    return await apiClient.get("/regions.geojson");
  },
};
