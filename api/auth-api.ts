import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:3001", // ✅ 인증 백엔드
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ 세션/쿠키 저장 필수
});

/**
 * 인증 서버 내부 로그인 요청 (/internal/verify-user)
 */
export const verifyUserLogin = async (email: string, password: string) => {
  return authApi
    .post("/internal/verify-user", { email, password })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
