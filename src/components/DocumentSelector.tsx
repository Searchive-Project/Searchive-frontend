"use client"

import { useState, useEffect } from "react"
import { FileText, Calendar, ChevronLeft, ChevronRight, Search, Tag as TagIcon, X, Check } from "lucide-react"
import { documentAPI, type Document, type PaginatedResponse } from "../api"

type SearchMode = "paginated" | "filename" | "tags"

interface DocumentSelectorProps {
  selectedDocuments: number[]
  onSelectionChange: (documentIds: number[]) => void
}

export default function DocumentSelector({ selectedDocuments, onSelectionChange }: DocumentSelectorProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const pageSize = 10

  const [searchMode, setSearchMode] = useState<SearchMode>("paginated")
  const [filenameQuery, setFilenameQuery] = useState("")
  const [tagsQuery, setTagsQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")

  useEffect(() => {
    if (searchMode === "paginated") {
      fetchDocuments(currentPage)
    }
  }, [currentPage, searchMode])

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

  const handleSearch = async () => {
    if (searchMode === "paginated") {
      setCurrentPage(1)
      fetchDocuments(1, sortOrder)
      return
    }

    if (searchMode === "filename" && !filenameQuery.trim()) {
      alert("검색할 파일명을 입력해주세요.")
      return
    }

    if (searchMode === "tags" && !tagsQuery.trim()) {
      alert("검색할 태그를 입력해주세요.")
      return
    }

    setIsLoading(true)
    try {
      let response
      if (searchMode === "filename") {
        response = await documentAPI.searchByFilename(filenameQuery.trim())
      } else {
        const tags = tagsQuery.split(",").map(tag => tag.trim()).filter(tag => tag)
        response = await documentAPI.searchByTags(tags)
      }
      setDocuments(response.documents)
      setTotal(response.total)
      setTotalPages(1)
    } catch (error) {
      console.error("Search failed:", error)
      alert("검색에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchModeChange = (mode: SearchMode) => {
    setSearchMode(mode)
    setFilenameQuery("")
    setTagsQuery("")
    setCurrentPage(1)
    fetchDocuments(1, sortOrder)
  }

  const handleReset = () => {
    setSearchMode("paginated")
    setFilenameQuery("")
    setTagsQuery("")
    setCurrentPage(1)
    fetchDocuments(1, sortOrder)
  }

  const toggleDocumentSelection = (documentId: number) => {
    if (selectedDocuments.includes(documentId)) {
      onSelectionChange(selectedDocuments.filter(id => id !== documentId))
    } else {
      onSelectionChange([...selectedDocuments, documentId])
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

  if (isLoading && documents.length === 0 && searchMode === "paginated") {
    return (
      <div className="w-full">
        <div className="text-center py-16 text-gray-400">
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* 검색 모드 선택 */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => handleSearchModeChange("paginated")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            searchMode === "paginated"
              ? "bg-blue-400 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            전체 목록
          </div>
        </button>
        <button
          onClick={() => handleSearchModeChange("filename")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            searchMode === "filename"
              ? "bg-blue-400 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            파일명 검색
          </div>
        </button>
        <button
          onClick={() => handleSearchModeChange("tags")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            searchMode === "tags"
              ? "bg-blue-400 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4" />
            태그 검색
          </div>
        </button>
      </div>

      {/* 필터 검색 영역 */}
      <div className="mb-8 p-5 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-4">
          {searchMode === "paginated" && (
            <>
              <div className="flex-1">
                <span className="text-base font-medium text-gray-700">전체 문서 목록</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-gray-700 whitespace-nowrap">날짜</span>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    const newOrder = e.target.value as "desc" | "asc"
                    setSortOrder(newOrder)
                    fetchDocuments(currentPage, newOrder)
                  }}
                  className="px-5 py-4 text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="desc">내림차순</option>
                  <option value="asc">올림차순</option>
                </select>
              </div>
            </>
          )}

          {searchMode === "filename" && (
            <div className="flex-1">
              <input
                type="text"
                placeholder="검색할 파일명을 입력하세요"
                value={filenameQuery}
                onChange={(e) => setFilenameQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-6 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          )}

          {searchMode === "tags" && (
            <div className="flex-1">
              <input
                type="text"
                placeholder="예: React, TypeScript, Frontend (쉼표로 구분)"
                value={tagsQuery}
                onChange={(e) => setTagsQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-6 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          )}

          {searchMode !== "paginated" && (
            <>
              <button
                type="button"
                onClick={handleSearch}
                disabled={isLoading}
                className="px-8 py-4 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Search className="w-4 h-4" />
                {isLoading ? "검색 중..." : "검색"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <X className="w-4 h-4" />
                초기화
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          문서 선택 ({selectedDocuments.length}개 선택됨)
        </h2>
        <span className="text-sm text-gray-500">전체 {total}개</span>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>
            {searchMode === "paginated"
              ? "업로드된 문서가 없습니다"
              : "검색 결과가 없습니다"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {documents.map((doc) => {
            const isSelected = selectedDocuments.includes(doc.document_id)
            return (
              <div
                key={doc.document_id}
                onClick={() => toggleDocumentSelection(doc.document_id)}
                className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 border-blue-400 shadow-md"
                    : "bg-white border-gray-200/60 hover:border-blue-400/40 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-blue-400 text-white" : "bg-blue-400/10 text-blue-400"
                    }`}>
                      {isSelected ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
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
            )
          })}
        </div>
      )}

      {searchMode === "paginated" && totalPages > 1 && (
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
