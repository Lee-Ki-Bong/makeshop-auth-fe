"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

/**
 * 클라이언트 전용 Provider
 * - React Query
 * - (필요하면) Zustand, ThemeProvider, ToastProvider 등도 여기 추가 가능
 */
export default function ClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
