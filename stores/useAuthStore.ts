import { create } from "zustand";

export interface OAuthLog {
  status: "success" | "error"; // 결과 상태
  timestamp: string; // 언제 발생했는지 (ISO 시간)
  data?: any; // 성공 시 응답 데이터
  error?: any; // 실패 시 에러 정보
}

interface AuthState {
  oauthLogs: OAuthLog[]; // ✅ 누적 저장되는 로그 배열
  addLog: (log: OAuthLog) => void;
  clearLogs: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  oauthLogs: [],

  // ✅ 새 로그를 누적(push)
  addLog: (log) =>
    set((state) => ({
      oauthLogs: [...state.oauthLogs, log],
    })),

  // ✅ 로그 전체 삭제 (필요시만 사용)
  clearLogs: () => set({ oauthLogs: [] }),
}));
