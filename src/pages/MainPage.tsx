"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import Footer from "../components/layout/Footer"
import HeroSection from "../components/HeroSection"
import DocumentUploadModal from "../components/DocumentUploadModal"

interface MainPageProps {
  onLoginClick: () => void
}

export default function MainPage({ onLoginClick }: MainPageProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const { isLoggedIn } = useAuthStore()
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (isLoggedIn) {
      // 로그인 상태면 대시보드로 이동
      navigate("/dashboard")
    } else {
      // 비로그인 상태면 로그인 모달 열기
      onLoginClick()
    }
  }

  const handleFeatureClick = () => {
    if (isLoggedIn) {
      // 로그인 상태면 대시보드로 이동
      navigate("/dashboard")
    } else {
      // 비로그인 상태면 로그인 모달 열기
      onLoginClick()
    }
  }

  const handleUploadClick = () => {
    if (isLoggedIn) {
      // 로그인 상태면 업로드 모달 열기
      setIsUploadModalOpen(true)
    } else {
      // 비로그인 상태면 로그인 모달 열기
      onLoginClick()
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow">
        <HeroSection
          onGetStarted={handleGetStarted}
          isLoggedIn={isLoggedIn}
          onFeatureClick={handleFeatureClick}
          onUploadClick={handleUploadClick}
        />
      </main>
      <Footer />
      <DocumentUploadModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} />
    </div>
  )
}
