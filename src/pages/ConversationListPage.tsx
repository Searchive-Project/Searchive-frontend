"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MessageSquare, Calendar, Plus, ChevronLeft, ChevronRight, Pencil, Check, X } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { aichatAPI, type ConversationListItemSchema, type PaginatedConversationListResponse } from "../api"
import CreateConversationModal from "../components/CreateConversationModal"
import { Button } from "../components/common/Button"

export default function ConversationListPage() {
  const { isLoggedIn } = useAuthStore()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<ConversationListItemSchema[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingConversationId, setEditingConversationId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const pageSize = 20

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    } else {
      fetchConversations(currentPage)
    }
  }, [isLoggedIn, navigate, currentPage])

  const fetchConversations = async (page: number) => {
    setIsLoading(true)
    try {
      const response: PaginatedConversationListResponse = await aichatAPI.getConversations(page, pageSize)
      setConversations(response.items)
      setTotalPages(response.total_pages)
      setTotal(response.total)
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}/${month}/${day} ${hours}:${minutes}`
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            i === currentPage
              ? "bg-blue-400 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          {i}
        </button>
      )
    }

    return pages
  }

  const handleConversationClick = (conversationId: number) => {
    navigate(`/conversations/${conversationId}`)
  }

  const handleCreateModalClose = (open: boolean) => {
    setIsCreateModalOpen(open)
    if (!open) {
      // 모달이 닫힐 때 목록 새로고침
      fetchConversations(currentPage)
    }
  }

  const handleEditClick = (e: React.MouseEvent, conversationId: number, currentTitle: string) => {
    e.stopPropagation()
    setEditingConversationId(conversationId)
    setEditingTitle(currentTitle)
  }

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingConversationId(null)
    setEditingTitle("")
  }

  const handleSaveEdit = async (e: React.MouseEvent, conversationId: number) => {
    e.stopPropagation()
    if (!editingTitle.trim()) {
      alert("제목을 입력해주세요.")
      return
    }

    try {
      await aichatAPI.updateConversationTitle(conversationId, { title: editingTitle })
      setEditingConversationId(null)
      setEditingTitle("")
      fetchConversations(currentPage)
    } catch (error) {
      console.error("Failed to update conversation title:", error)
      alert("제목 수정에 실패했습니다.")
    }
  }

  return (
    <div className="min-h-screen bg-white">

      <div className="pt-20 sm:pt-24 py-8 sm:py-12 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">AI 채팅방</h1>
                <p className="text-sm sm:text-base text-gray-500">문서와 대화하고 질문하세요</p>
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-400 hover:bg-blue-500 text-white flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                새 채팅방
              </Button>
            </div>
          </div>

          {/* 채팅방 목록 */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">채팅방 목록</h2>
              <span className="text-sm text-gray-500">전체 {total}개</span>
            </div>

            {isLoading && conversations.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p>로딩 중...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="mb-4">생성된 채팅방이 없습니다</p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-400 hover:bg-blue-500 text-white"
                >
                  첫 채팅방 만들기
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.conversation_id}
                    onClick={() => editingConversationId !== conversation.conversation_id && handleConversationClick(conversation.conversation_id)}
                    className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200/60 hover:border-blue-400/40 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-400 transition-colors">
                        <MessageSquare className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingConversationId === conversation.conversation_id ? (
                          <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="w-full px-3 py-2 border border-blue-400 rounded-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveEdit(e as any, conversation.conversation_id)
                                } else if (e.key === 'Escape') {
                                  handleCancelEdit(e as any)
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <h3 className="font-semibold text-gray-900 mb-2">{conversation.title}</h3>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            생성: {formatDate(conversation.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            수정: {formatDate(conversation.updated_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {editingConversationId === conversation.conversation_id ? (
                          <>
                            <button
                              onClick={(e) => handleSaveEdit(e, conversation.conversation_id)}
                              className="p-2 rounded-lg bg-blue-400 hover:bg-blue-500 text-white transition-colors"
                              title="저장"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                              title="취소"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={(e) => handleEditClick(e, conversation.conversation_id, conversation.title)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100"
                            title="제목 수정"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {renderPageNumbers()}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 채팅방 생성 모달 */}
      <CreateConversationModal open={isCreateModalOpen} onOpenChange={handleCreateModalClose} />
    </div>
  )
}
