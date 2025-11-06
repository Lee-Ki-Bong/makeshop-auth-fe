"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { verifyUserLogin } from "@/api/auth-api";

export const useStartOAuth = (id: string, password: string) => {
  const addLog = useAuthStore((state) => state.addLog);

  return useMutation({
    mutationFn: () => verifyUserLogin(id, password),

    onSuccess: (res: any) => {
      addLog({
        status: "success",
        data: res,
        timestamp: new Date().toISOString(),
      });

      setTimeout(() => {
        addLog({
          status: "success",
          data: "인증 서버로 이동",
          timestamp: new Date().toISOString(),
        });
      }, 1400);

      // ✅ 로그인 성공하면 → 다시 authorize로 보내기
      if (res?.data?.authorizeUrl) {
        // ✅ 0.7초 후에 이동 (로그 확인 가능)
        setTimeout(() => {
          addLog({
            status: "success",
            data: "인증 서버로 authorize로 보내기",
            timestamp: new Date().toISOString(),
          });
        }, 2800);
      }
    },

    onError: (error: any) => {
      const backendError = error?.response?.data || null; // ✅ 404 JSON도 포함됨
      const statusCode = error?.response?.status || "Unknown";

      addLog({
        status: "error",
        error: backendError || { message: error.message, statusCode },
        timestamp: new Date().toISOString(),
      });
    },
  });
};
