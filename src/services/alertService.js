import { apiClient } from "@/lib/apiClient";

export const alertService = {
  async getAlerts(filters = {}) {
    return await apiClient.get("/alerts", { params: filters });
  },

  async getAlertsGeoJson() {
    return await apiClient.get("/alerts.geojson");
  },

  async acknowledgeAlert(id) {
    return await apiClient.post(`/alerts/${id}/acknowledge`);
  },

  async resolveAlert(id) {
    return await apiClient.post(`/alerts/${id}/resolve`);
  },

  async broadcastAlert(data) {
    return await apiClient.post("/alerts/broadcast", data);
  },
};
