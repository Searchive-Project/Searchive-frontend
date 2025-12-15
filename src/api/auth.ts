import apiClient from './client';

// API 응답 타입 정의
export interface SessionResponse {
  user_id: number;
  session_id: string;
}

export interface LoginResponse {
  user_id: number;
  kakao_id: string;
  nickname: string;
  created_at: string;
  message: string;
}

export interface LogoutResponse {
  message: string;
}

// Auth API
export const authAPI = {
  /**
   * 카카오 로그인 시작
   * 카카오 인증 페이지로 리디렉션
   */
  kakaoLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/auth/kakao/login`;
  },

  /**
   * 세션 정보 조회
   * 현재 로그인된 사용자의 세션 정보 반환
   */
  getSession: async (): Promise<SessionResponse> => {
    const response = await apiClient.get<SessionResponse>('/api/v1/auth/session');
    return response.data;
  },

  /**
   * 현재 사용자 정보 조회
   * 현재 로그인된 사용자의 상세 정보 반환
   */
  getCurrentUser: async (): Promise<LoginResponse> => {
    const response = await apiClient.get<LoginResponse>('/api/v1/auth/me');
    return response.data;
  },

  /**
   * 로그아웃
   * 세션 삭제 및 쿠키 만료
   */
  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>('/api/v1/auth/logout');
    return response.data;
  },
};
