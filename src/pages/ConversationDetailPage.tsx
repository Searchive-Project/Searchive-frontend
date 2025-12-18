"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Send, FileText, Loader2 } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { aichatAPI, type MessageSchema, type DocumentSchema } from "../api"
import { Button } from "../components/common/Button"

export default function ConversationDetailPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const { isLoggedIn } = useAuthStore()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<MessageSchema[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [conversationTitle, setConversationTitle] = useState("")
  const [documents, setDocuments] = useState<DocumentSchema[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    } else if (conversationId) {
      fetchConversationDetail()
      fetchMessages()
      fetchDocuments()
    }
  }, [isLoggedIn, navigate, conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchConversationDetail = async () => {
    if (!conversationId) return

    try {
      const detail = await aichatAPI.getConversationDetail(Number(conversationId))
      setConversationTitle(detail.title)
    } catch (error) {
      console.error("Failed to fetch conversation detail:", error)
    }
  }

  const fetchMessages = async () => {
    if (!conversationId) return

    setIsLoading(true)
    try {
      const messageList = await aichatAPI.getMessages(Number(conversationId))
      setMessages(messageList)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDocuments = async () => {
    if (!conversationId) return

    try {
      const response = await aichatAPI.getConversationDocuments(Number(conversationId))
      setDocuments(response.documents)
    } catch (error) {
      console.error("Failed to fetch documents:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !conversationId || isSending) {
      return
    }

    const userMessageContent = newMessage.trim()
    setNewMessage("")
    setIsSending(true)

    // 사용자 메시지를 즉시 UI에 추가 (임시 표시)
    const tempUserMessage: MessageSchema = {
      message_id: -Date.now(), // 음수로 임시 ID 구분
      role: 'user',
      content: userMessageContent,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      // 메시지 전송
      await aichatAPI.sendMessage(Number(conversationId), {
        content: userMessageContent
      })

      // 전송 성공 후 데이터베이스에서 전체 메시지 다시 조회
      const updatedMessages = await aichatAPI.getMessages(Number(conversationId))
      setMessages(updatedMessages)
    } catch (error) {
      console.error("Failed to send message:", error)
      alert("메시지 전송에 실패했습니다.")
      // 에러 발생 시 임시 메시지 제거하고 입력창에 복원
      setMessages(prev => prev.filter(msg => msg.message_id !== tempUserMessage.message_id))
      setNewMessage(userMessageContent)
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen">
      {/* 상단 여백 (메인 Header 공간) */}
      <div className="h-16 flex-shrink-0"></div>

      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/conversations")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">{conversationTitle}</h1>
            {documents.length > 0 && (
              <div className="flex items-start gap-1 text-sm text-blue-600 mt-1">
                <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="break-all">
                  {documents.map((doc, index) => (
                    <span key={doc.document_id}>
                      {doc.original_filename}
                      {index < documents.length - 1 && ", "}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">
              <p>로딩 중...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>메시지가 없습니다. 첫 메시지를 보내보세요!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.message_id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-col max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-6 py-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-400 text-white'
                          : 'bg-white border border-gray-200 text-gray-900 shadow-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 px-2">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* 메시지 입력창 */}
      <div className="bg-white border-t border-gray-200 flex-shrink-0">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              disabled={isSending}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="bg-blue-400 hover:bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
