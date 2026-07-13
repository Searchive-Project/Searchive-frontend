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

  useEffect(() => {
    if (!isLoggedIn) navigate("/")
  }, [isLoggedIn, navigate])

  return (
    <main className="min-h-[100dvh] bg-slate-50 px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">문서 워크스페이스</h1>
          <p className="mt-2 text-slate-600">문서를 업로드하고, 정리된 정보를 검색하거나 AI 채팅에 연결하세요.</p>
        </header>

        <FeatureCards onUploadClick={() => setIsUploadModalOpen(true)} />

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <DocumentList />
        </section>
      </div>
      <DocumentUploadModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} />
    </main>
  )
}
