"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, FileText, Loader2, Send } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { aichatAPI, type DocumentSchema, type MessageSchema } from "../api"
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
      setMessages(await aichatAPI.getMessages(Number(conversationId)))
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

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!newMessage.trim() || !conversationId || isSending) return

    const content = newMessage.trim()
    const temporaryMessage: MessageSchema = {
      message_id: -Date.now(),
      role: "user",
      content,
      created_at: new Date().toISOString(),
    }
    setNewMessage("")
    setMessages((current) => [...current, temporaryMessage])
    setIsSending(true)

    try {
      await aichatAPI.sendMessage(Number(conversationId), { content })
      setMessages(await aichatAPI.getMessages(Number(conversationId)))
    } catch (error) {
      console.error("Failed to send message:", error)
      alert("메시지 전송에 실패했습니다. 다시 시도해주세요.")
      setMessages((current) => current.filter((message) => message.message_id !== temporaryMessage.message_id))
      setNewMessage(content)
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (dateString: string) => new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit" }).format(new Date(dateString))

  return (
    <main className="flex min-h-[100dvh] flex-col bg-slate-50 pt-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-4 sm:px-6">
          <button type="button" onClick={() => navigate("/conversations")} aria-label="채팅방 목록으로 돌아가기" className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950">
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-slate-950">{conversationTitle || "AI 채팅"}</h1>
            {documents.length > 0 && (
              <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600">
                <FileText className="mt-0.5 size-4 shrink-0 text-blue-700" aria-hidden="true" />
                <span className="line-clamp-2">{documents.map((document) => document.original_filename).join(", ")}</span>
              </p>
            )}
          </div>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto px-4 py-7 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {isLoading ? (
            <div className="space-y-4" aria-label="메시지를 불러오는 중">
              <div className="h-20 w-3/4 animate-pulse rounded-2xl bg-slate-200" />
              <div className="ml-auto h-12 w-1/2 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <FileText className="mx-auto size-8 text-blue-700" aria-hidden="true" />
              <h2 className="mt-4 font-semibold text-slate-950">선택한 문서에 대해 질문해 보세요.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">핵심 내용, 개념 설명, 문서 간 차이를 물어볼 수 있습니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => {
                const isUser = message.role === "user"
                return (
                  <article key={message.message_id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[88%] sm:max-w-[76%] ${isUser ? "items-end" : "items-start"}`}>
                      <div className={`rounded-2xl px-4 py-3 text-[15px] leading-7 shadow-sm ${isUser ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-800"}`}>
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                      <time className="mt-1.5 block px-1 text-xs text-slate-400">{formatTime(message.created_at)}</time>
                    </div>
                  </article>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </section>

      <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
        <form onSubmit={handleSendMessage} className="mx-auto flex max-w-3xl items-end gap-3">
          <label className="sr-only" htmlFor="message">메시지</label>
          <textarea
            id="message"
            rows={1}
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
            placeholder="문서에 대해 질문하세요. Enter로 전송, Shift + Enter로 줄바꿈"
            className="max-h-32 min-h-12 flex-1 resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            disabled={isSending}
          />
          <Button type="submit" size="icon" aria-label="메시지 전송" disabled={!newMessage.trim() || isSending}>
            {isSending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-5" aria-hidden="true" />}
          </Button>
        </form>
      </div>
    </main>
  )
}
