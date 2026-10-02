import axios from "axios";

/**
 * GeoShield API Client (Single Source of Truth)
 * Configured with token interceptors, silent 401 refresh, and normalized error responses.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Helper to get stored auth token safely in browser
export const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("geoshield_token");
};

export const setStoredToken = (token) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("geoshield_token", token);
  } else {
    localStorage.removeItem("geoshield_token");
  }
};

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(normalizeError(error))
);

// Response Interceptor: Silent Token Refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(normalizeError(error));
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(normalizeError(err)));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${getStoredToken()}` },
        });

        const newToken = response.data?.token;
        if (newToken) {
          setStoredToken(newToken);
          apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        setStoredToken(null);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("geoshield:unauthorized"));
        }
        return Promise.reject(normalizeError(refreshErr));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

/**
 * Normalizes backend error payloads to prevent leaking Axios internals to components.
 */
export function normalizeError(error) {
  if (error.response) {
    return {
      message: error.response.data?.message || error.response.data?.detail || "An operational server error occurred.",
      code: error.response.data?.code || `HTTP_${error.response.status}`,
      status: error.response.status,
      details: error.response.data?.details || null,
    };
  } else if (error.request) {
    return {
      message: "Unable to establish contact with GeoShield API Gateway.",
      code: "NETWORK_DISCONNECTED",
      status: 0,
      details: null,
    };
  }
  return {
    message: error.message || "An unexpected application error occurred.",
    code: "CLIENT_ERROR",
    status: 500,
    details: null,
  };
}
