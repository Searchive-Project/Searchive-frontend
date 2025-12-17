"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import FeatureCards from "../components/FeatureCards"
import DocumentList from "../components/DocumentList"
import DocumentUploadModal from "../components/DocumentUploadModal"

export default function DashboardPage() {
  const { isLoggedIn } = useAuthStore()
  const navigate = useNavigate()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // 로그인하지 않은 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  const handleUploadClick = () => {
    setIsUploadModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">

      {/* 메인 콘텐츠 */}
      <div className="pt-20 sm:pt-24 py-8 sm:py-12 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-12 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
            <p className="text-sm sm:text-base text-gray-500">문서를 업로드하고 AI와 대화를 시작하세요</p>
          </div>
        </div>

        {/* Feature Cards - 가운데 상단 배치 */}
        <div className="w-full py-8 mb-12 px-4 sm:px-6 lg:px-8">
          <FeatureCards onUploadClick={handleUploadClick} />
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* 구분선 */}
          <div className="w-full border-t border-gray-200 my-12"></div>

          {/* 업로드된 문서 목록 영역 */}
          <div className="w-full py-8 mt-12">
            <DocumentList />
          </div>
        </div>
      </div>

      {/* 문서 업로드 모달 */}
      <DocumentUploadModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} />
    </div>
  )
}
