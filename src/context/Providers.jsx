"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";

function SocketBridge({ children }) {
  const { token } = useAuth();
  return <SocketProvider token={token}>{children}</SocketProvider>;
}

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30, // 30 seconds
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // Do not retry 401 or 403 errors
              if (error?.status === 401 || error?.status === 403) return false;
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketBridge>{children}</SocketBridge>
      </AuthProvider>
    </QueryClientProvider>
  );
}