"use client"

import { Button } from "../common/Button"
import { FileText, MessageSquare, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"

interface HeaderProps {
  onLoginClick?: () => void
}

export default function Header({ onLoginClick }: HeaderProps) {
  const navigate = useNavigate()
  const { isLoggedIn, user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          aria-label="Searchive 홈으로 이동"
          className="flex items-center gap-2.5 rounded-lg text-slate-950"
          onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")}
        >
          <span className="grid size-8 place-items-center rounded-lg bg-blue-600 shadow-sm shadow-blue-900/15">
            <Sparkles className="size-4 text-white" aria-hidden="true" />
          </span>
          <span className="text-base font-bold tracking-tight">Searchive</span>
        </button>

        {!isLoggedIn ? (
          <nav className="hidden items-center gap-6 md:flex" aria-label="주요 메뉴">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-950">기능</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-950">사용 방법</a>
          </nav>
        ) : (
          <nav className="hidden items-center gap-1 sm:flex" aria-label="워크스페이스 메뉴">
            <button type="button" onClick={() => navigate("/dashboard")} className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950">
              <FileText className="size-4" aria-hidden="true" /> 문서
            </button>
            <button type="button" onClick={() => navigate("/conversations")} className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950">
              <MessageSquare className="size-4" aria-hidden="true" /> AI 채팅
            </button>
          </nav>
        )}

        <div className="flex items-center gap-2">
          {!isLoggedIn ? (
            <>
              <Button variant="ghost" onClick={onLoginClick}>로그인</Button>
              <Button onClick={onLoginClick} className="hidden sm:inline-flex">시작하기</Button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => navigate("/profile")} className="hidden rounded-md px-2 py-1 text-sm font-medium text-slate-600 hover:text-slate-950 sm:block">
                {user?.nickname}
              </button>
              <Button variant="ghost" onClick={handleLogout}>로그아웃</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
