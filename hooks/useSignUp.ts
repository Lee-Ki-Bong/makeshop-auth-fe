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
  companyName?: string;
  businessNumber?: string;
}

export const useSignUp = (authReqId: string | null) => {
  const addLog = useAuthStore((state) => state.addLog);

  return useMutation({
    mutationFn: (form: SignupFormValues) => {
      return signupUser({
        ...form,
        authReqId,
      });
    },

    onSuccess: (res: any) => {
      addLog({
        status: "success",
        data: res,
        timestamp: new Date().toISOString(),
      });

      // redirect URL 존재 시 → OAuth 계속 진행
      if (res?.data?.redirectUrl) {
        setTimeout(() => {
          addLog({
            status: "success",
            data: `OAuth Redirect: ${res.data.redirectUrl}`,
            timestamp: new Date().toISOString(),
          });
        }, 1400);

        setTimeout(() => {
          window.location.href = res.data.redirectUrl;
        }, 2800);
      }
    },

    onError: (error: any) => {
      const backendError = error?.response?.data || null;
      const statusCode = error?.response?.status || "Unknown";

      addLog({
        status: "error",
        error: backendError || { message: error.message, statusCode },
        timestamp: new Date().toISOString(),
      });
    },
  });
};
