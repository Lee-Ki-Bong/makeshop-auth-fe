"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { verifyUserLogin } from "@/api/auth-api";

export const useSignIn = (
  id: string,
  password: string,
  authReqId: string | null
) => {
  const addLog = useAuthStore((state) => state.addLog);

  return useMutation({
    mutationFn: () => verifyUserLogin(id, password, authReqId),

    onSuccess: (res: any) => {
      addLog({
        status: "success",
        data: res,
        timestamp: new Date().toISOString(),
      });

      setTimeout(() => {
        addLog({
          status: "success",
          data: "파트너 백앤드로 콜백",
          timestamp: new Date().toISOString(),
        });
      }, 1400);

      // ✅ 로그인 성공하면 → 다시 authorize로 보내기
      if (res?.data?.redirectUrl) {
        // ✅ 0.7초 후에 이동 (로그 확인 가능)
        setTimeout(() => {
          addLog({
            status: "success",
            data: `파트너 백앤드 콜백 : ${res.data.redirectUrl}`,
            timestamp: new Date().toISOString(),
          });
        }, 1400);

        // ✅ 0.7초 후에 이동 (로그 확인 가능)
        setTimeout(() => {
          window.location.href = res.data.redirectUrl;
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
