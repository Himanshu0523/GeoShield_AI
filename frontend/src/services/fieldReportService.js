import { apiClient } from "@/lib/apiClient";

export const fieldReportService = {
  async getFieldReports(filters = {}) {
    return await apiClient.get("/field-reports", { params: filters });
  },

  async submitFieldReport(reportData) {
    if (reportData instanceof FormData) {
      return await apiClient.post("/field-reports", reportData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return await apiClient.post("/field-reports", reportData);
  },

  async verifyFieldReport(id, verificationData = {}) {
    return await apiClient.post(`/field-reports/${id}/verify`, verificationData);
  },
};

export const adminService = {
  async getAdminUsers(filters = {}) {
    return await apiClient.get("/admin/users", { params: filters });
  },

  async inviteUser(userData) {
    return await apiClient.post("/admin/users/invite", userData);
  },

  async toggleUserStatus(id, status) {
    return await apiClient.patch(`/admin/users/${id}/status`, { status });
  },
};
