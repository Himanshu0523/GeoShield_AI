"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "@/services/authService";
import { getStoredToken, setStoredToken } from "@/lib/apiClient";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  refreshSession: async () => {},
});

const PUBLIC_ROUTES = ["/login", "/register", "/signup", "/forgot-password", "/reset-password", "/unauthorized"];

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getStoredToken()));
  const router = useRouter();
  const pathname = usePathname();

  // Async restore session
  const restoreSession = useCallback(async () => {
    const stored = getStoredToken();
    if (!stored) {
      return;
    }

    try {
      const res = await authService.getMe();
      if (res?.user) {
        setUser(res.user);
      } else {
        setUser(res);
      }
    } catch (err) {
      console.warn("Session restore failed, clearing token:", err.message);
      setStoredToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      restoreSession();
    }
  }, [token, restoreSession]);

  // Handle unauthorized event dispatched by apiClient interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setStoredToken(null);
      setToken(null);
      setUser(null);
      router.push("/login");
    };

    window.addEventListener("geoshield:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("geoshield:unauthorized", handleUnauthorized);
    };
  }, [router]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      setToken(data.token);
      setUser(data.user || { email, role: "Incident Commander", name: "Operator" });
      router.push("/map");
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const data = await authService.register(userData);
      setToken(data.token);
      setUser(data.user || { email: userData.email, role: userData.role || "ANALYST", name: userData.fullName });
      router.push("/map");
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
      setToken(null);
      setStoredToken(null);
      router.push("/login");
    }
  };

  // Route protection guard
  useEffect(() => {
    if (isLoading) return; // Never redirect while checking session

    const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
    if (!token && !isPublic) {
      router.push("/login");
    }
  }, [isLoading, token, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshSession: restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
