import { apiClient } from "@/lib/apiClient";

export const roadService = {
  async getRoads(filters = {}) {
    return await apiClient.get("/roads", { params: filters });
  },

  async getRoadsGeoJson() {
    return await apiClient.get("/roads.geojson");
  },
};
