"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { verifyUserLogin } from "@/api/auth-api";

type SignInPayload = {
  id: string;
  password: string;
  clientId: string | null;
  state: string | null;
};

export const useSignIn = () => {
  const addLog = useAuthStore((state) => state.addLog);

  return useMutation({
    mutationFn: (payload: SignInPayload) =>
      verifyUserLogin(
        payload.id,
        payload.password,
        payload.clientId,
        payload.state
      ),

    onSuccess: (res: any) => {
      addLog({
        status: "success",
        data: res,
        timestamp: new Date().toISOString(),
      });

      if (res?.data?.redirectUri) {
        setTimeout(() => {
          window.location.href = res.data.redirectUri;
        }, 2800);
      }
    },

    onError: (error: any) => {
      const backendError = error?.response?.data || null;
      const errorCode = backendError?.code || "Unknown";
      addLog({
        status: "error",
        error: error?.response?.data ?? error.message,
        timestamp: new Date().toISOString(),
      });

      if (errorCode === "AUTHORIZE_CONTEXT_EXPIRED") {
        addLog({
          status: "error",
          error: "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
          timestamp: new Date().toISOString(),
        });

        setTimeout(() => {
          window.location.href = backendError.data.redirectUri;
        }, 2800);
      }
    },
  });
};
