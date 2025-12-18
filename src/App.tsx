import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useAuthStore } from "./store/authStore"
import Header from "./components/layout/Header"
import LoginModal from "./components/LoginModal"
import MainPage from "./pages/MainPage"
import DashboardPage from "./pages/DashBoardPage"
import KakaoCallback from "./pages/KakaoCallback"
import ConversationListPage from "./pages/ConversationListPage"
import ConversationDetailPage from "./pages/ConversationDetailPage"
import "./styles/global.css"

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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/conversations" element={<ConversationListPage />} />
        <Route path="/conversations/:conversationId" element={<ConversationDetailPage />} />
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
