import { apiClient, setStoredToken } from "@/lib/apiClient";

export const authService = {
  async login(email, password) {
    const data = await apiClient.post("/auth/login", { email, password });
    if (data?.token) {
      setStoredToken(data.token);
    }
    return data;
  },

  async register({ email, password, fullName, role, department, phone, tenantCode }) {
    const data = await apiClient.post("/auth/register", {
      email,
      password,
      fullName,
      role,
      department,
      phone,
      tenantCode,
    });
    if (data?.token) {
      setStoredToken(data.token);
    }
    return data;
  },

  async forgotPassword(email) {
    return await apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword({ email, token, newPassword }) {
    return await apiClient.post("/auth/reset-password", { email, token, newPassword });
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      setStoredToken(null);
    }
    return { ok: true };
  },

  async getMe() {
    return await apiClient.get("/me");
  },

  async refreshToken() {
    const data = await apiClient.post("/auth/refresh");
    if (data?.token) {
      setStoredToken(data.token);
    }
    return data;
  },
};

