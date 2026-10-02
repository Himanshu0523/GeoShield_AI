import { apiClient } from "@/lib/apiClient";

export const forecastService = {
  async getForecast(range = "7d", regionId = null) {
    const params = { range };
    if (regionId) params.regionId = regionId;
    return await apiClient.get("/forecast", { params });
  },
};

export const riskService = {
  async getRiskTimeseries(from = null, to = null, regionId = null) {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    if (regionId) params.regionId = regionId;
    return await apiClient.get("/risk/timeseries", { params });
  },
};
