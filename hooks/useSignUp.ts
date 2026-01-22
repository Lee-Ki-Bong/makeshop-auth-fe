"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { signupUser } from "@/api/auth-api";

interface SignupFormValues {
  loginUid: string;
  password: string;
  email: string;
  name: string;
  phone: string;
}

export const useSignUp = (clientId: string | null, state: string | null) => {
  const addLog = useAuthStore((state) => state.addLog);

  return useMutation({
    mutationFn: (form: SignupFormValues) => {
      return signupUser({
        ...form,
        clientId,
        state,
      });
    },

    onSuccess: (res: any) => {
      addLog({
        status: "success",
        data: res,
        timestamp: new Date().toISOString(),
      });

      // redirect URL 존재 시 → OAuth 계속 진행
      if (res?.data?.redirectUri) {
        setTimeout(() => {
          addLog({
            status: "success",
            data: `OAuth Redirect: ${res.data.redirectUri}`,
            timestamp: new Date().toISOString(),
          });
        }, 1400);

        setTimeout(() => {
          window.location.href = res.data.redirectUri;
        }, 2800);
      }
    },

    onError: (error: any) => {
      const backendError = error?.response?.data || null;
      const statusCode = error?.response?.status || "Unknown";

      const errorCode = error?.response?.data?.code || "Unknown";

      console.error("SignUp Error:", error);

      addLog({
        status: "error",
        error: backendError || { message: error.message, statusCode },
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
