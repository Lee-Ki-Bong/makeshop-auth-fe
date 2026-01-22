import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:4210/api", // ✅ 인증 백엔드
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ 세션/쿠키 저장 필수
});

/**
 * 인증 서버 내부 로그인 요청 (/internal/verify-user)
 */
export const verifyUserLogin = async (
  loginUid: string,
  password: string,
  clientId: string | null,
  state: string | null,
) => {
  return authApi
    .post("/internal/verify-user", { loginUid, password, clientId, state })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const signupUser = async (data: any) => {
  return authApi
    .post(`/signup`, data)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
