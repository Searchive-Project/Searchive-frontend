"use client"

import { useState, useEffect } from "react"
import { FileText, Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { documentAPI, type Document, type PaginatedResponse } from "../api"

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const pageSize = 10

  // 필터 관련 state
  const [searchName, setSearchName] = useState("")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")

  useEffect(() => {
    fetchDocuments(currentPage)
  }, [currentPage])

  const fetchDocuments = async (page: number, order: "desc" | "asc" = sortOrder) => {
    setIsLoading(true)
    try {
      const response: PaginatedResponse = order === "desc"
        ? await documentAPI.getPaginated(page, pageSize)
        : await documentAPI.getPaginatedAscending(page, pageSize)
      setDocuments(response.items)
      setTotalPages(response.total_pages)
      setTotal(response.total)
    } catch (error) {
      console.error("Failed to fetch documents:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchDocuments(1, sortOrder)
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

  const formatFileSize = (sizeKb: number) => {
    if (sizeKb < 1024) {
      return `${sizeKb} KB`
    }
    return `${(sizeKb / 1024).toFixed(2)} MB`
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

  if (isLoading && documents.length === 0) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">업로드된 문서</h2>
        <div className="text-center py-16 text-gray-400">
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">업로드된 문서</h2>
        <div className="text-center py-16 text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>업로드된 문서가 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* 필터 검색 영역 */}
      <div className="mb-8 p-5 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-4">
          {/* 이름 검색 */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="문서 이름으로 검색"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-6 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* 날짜 정렬 */}
          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-gray-700 whitespace-nowrap">날짜</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
              className="px-5 py-4 text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="desc">내림차순</option>
              <option value="asc">올림차순</option>
            </select>
          </div>

          {/* 검색 버튼 */}
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            검색
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">업로드된 문서</h2>
        <span className="text-sm text-gray-500">전체 {total}개</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.document_id}
            className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200/60 hover:border-blue-400/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-1">{doc.original_filename}</h3>
                  <div className="flex items-center gap-3 mb-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(doc.updated_at)}
                    </span>
                    <span>{formatFileSize(doc.file_size_kb)}</span>
                  </div>
                  {doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {doc.tags.map((tag) => (
                        <span
                          key={tag.tag_id}
                          className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {doc.summary && (
                <div className="w-[560px] flex-shrink-0 pl-4 border-l border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-500 mb-1.5">요약</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{doc.summary}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

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
  )
}
