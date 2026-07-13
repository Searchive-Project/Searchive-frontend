import { useEffect, useState, type ReactNode } from "react"
import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom"
import { useAuthStore } from "./store/authStore"
import Header from "./components/layout/Header"
import LoginModal from "./components/LoginModal"
import MainPage from "./pages/MainPage"
import DashboardPage from "./pages/DashBoardPage"
import KakaoCallback from "./pages/KakaoCallback"
import ConversationListPage from "./pages/ConversationListPage"
import ConversationDetailPage from "./pages/ConversationDetailPage"
import UserProfilePage from "./pages/UserProfilePage"
import "./styles/global.css"

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthReady, isLoggedIn } = useAuthStore()

  if (!isAuthReady) return null
  return isLoggedIn ? children : <Navigate to="/" replace />
}

function AppContent() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const location = useLocation()

  // Callback 페이지에서는 Header를 보이지 않게 함
  const showHeader = location.pathname !== "/auth/kakao/callback"

  return (
    <>
      {showHeader && <Header onLoginClick={() => setIsLoginModalOpen(true)} />}
      <Routes>
        <Route path="/" element={<MainPage onLoginClick={() => setIsLoginModalOpen(true)} />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/conversations" element={<ProtectedRoute><ConversationListPage /></ProtectedRoute>} />
        <Route path="/conversations/:conversationId" element={<ProtectedRoute><ConversationDetailPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      </Routes>
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </>
  )
}

function App() {
  const { checkAuth } = useAuthStore()

  // 앱 최초 로드 시 세션 쿠키 확인 및 인증 상태 복원
  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
