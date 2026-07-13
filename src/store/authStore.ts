import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authAPI } from "../api"

interface AuthState {
  isLoggedIn: boolean
  isAuthReady: boolean
  user: {
    userId: number
    kakaoId: string
    nickname: string
    createdAt: string
  } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: { userId: number; kakaoId: string; nickname: string; createdAt: string }) => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      isAuthReady: false,
      user: null,
      login: async (email: string, _password: string) => {
        // TODO: 백엔드 API 호출
        // 임시로 로그인 성공 처리
        await new Promise((resolve) => setTimeout(resolve, 1000))
        set({
          isLoggedIn: true,
          isAuthReady: true,
          user: {
            userId: 0,
            kakaoId: "",
            nickname: email,
            createdAt: new Date().toISOString()
          }
        })
      },
      logout: async () => {
        try {
          await authAPI.logout()
        } catch (error) {
          console.error("로그아웃 실패:", error)
        } finally {
          set({ isLoggedIn: false, isAuthReady: true, user: null })
        }
      },
      setUser: (user) => {
        set({ user, isLoggedIn: true, isAuthReady: true })
      },
      checkAuth: async () => {
        try {
          const userData = await authAPI.getCurrentUser()
          set({
            isLoggedIn: true,
            isAuthReady: true,
            user: {
              userId: userData.user_id,
              kakaoId: userData.kakao_id,
              nickname: userData.nickname,
              createdAt: userData.created_at,
            }
          })
        } catch (error) {
          console.error("인증 확인 실패:", error)
          set({ isLoggedIn: false, isAuthReady: true, user: null })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn, user: state.user }),
    },
  ),
)
