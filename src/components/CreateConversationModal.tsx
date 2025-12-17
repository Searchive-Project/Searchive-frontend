"use client"

import { useState } from "react"
import { X, MessageSquare, CheckCircle } from "lucide-react"
import { aichatAPI } from "../api"
import { Button } from "./common/Button"
import DocumentSelector from "./DocumentSelector"
import { useNavigate } from "react-router-dom"

interface CreateConversationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateConversationModal({ open, onOpenChange }: CreateConversationModalProps) {
  const [title, setTitle] = useState("")
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const navigate = useNavigate()

  if (!open) return null

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("채팅방 제목을 입력해주세요.")
      return
    }

    if (selectedDocuments.length === 0) {
      alert("최소 1개 이상의 문서를 선택해주세요.")
      return
    }

    setIsCreating(true)
    try {
      const response = await aichatAPI.createConversation({
        title: title.trim(),
        document_ids: selectedDocuments,
      })

      setShowSuccess(true)

      // 1초 후 채팅방 목록 페이지로 이동
      setTimeout(() => {
        onOpenChange(false)
        navigate("/conversations")
        // 상태 초기화
        setTitle("")
        setSelectedDocuments([])
        setShowSuccess(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to create conversation:", error)
      alert("채팅방 생성에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    setTitle("")
    setSelectedDocuments([])
    setShowSuccess(false)
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* 모달 콘텐츠 */}
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div style={{ padding: '2rem' }} className="flex-shrink-0">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">새 채팅방 만들기</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 성공 메시지 */}
          {showSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">채팅방이 성공적으로 생성되었습니다!</span>
            </div>
          )}

          {/* 채팅방 제목 입력 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              채팅방 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="채팅방 제목을 입력하세요 (1-255자)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">{title.length}/255자</p>
          </div>
        </div>

        {/* 문서 선택 영역 - 스크롤 가능 */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              문서 선택 <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-4">
              AI 채팅에 사용할 문서를 선택하세요. 최소 1개 이상 선택해야 합니다.
            </p>
          </div>
          <DocumentSelector
            selectedDocuments={selectedDocuments}
            onSelectionChange={setSelectedDocuments}
          />
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex-shrink-0 border-t border-gray-200 px-8 py-4 bg-gray-50">
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={!title.trim() || selectedDocuments.length === 0 || isCreating}
              className="bg-blue-400 hover:bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isCreating ? "생성 중..." : "채팅방 생성"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
