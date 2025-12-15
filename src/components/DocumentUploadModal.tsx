"use client"

import { useState, useRef } from "react"
import type { DragEvent } from "react"
import { Upload, X, FileText, CheckCircle } from "lucide-react"
import { documentAPI } from "../api"
import { Button } from "./common/Button"

interface DocumentUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Tag {
  tag_id: number
  name: string
}

interface UploadedDocument {
  id: string
  name: string
  tags: Tag[]
}

export default function DocumentUploadModal({ open, onOpenChange }: DocumentUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      const response = await documentAPI.upload(selectedFile)

      console.log("Upload response:", response) // 디버깅용

      // 업로드된 문서 정보 추가
      const newDocument: UploadedDocument = {
        id: response.document_id?.toString() || Date.now().toString(),
        name: response.original_filename || selectedFile.name,
        tags: response.tags || []
      }

      setUploadedDocuments([...uploadedDocuments, newDocument])
      setShowSuccess(true)
      setSelectedFile(null)

      // 3초 후 성공 메시지 숨김
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Upload failed:", error)
      alert("문서 업로드에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setUploadedDocuments([])
    setShowSuccess(false)
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* 모달 콘텐츠 */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
        <div style={{ padding: '2rem' }}>
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">문서 업로드</h2>
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
              <span className="text-green-800 font-medium">문서가 성공적으로 업로드되었습니다!</span>
            </div>
          )}

          {/* 드래그 앤 드롭 영역 */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              파일을 드래그 앤 드롭하거나
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 border-blue-400 text-blue-400 hover:bg-blue-50"
            >
              파일 선택
            </Button>
            {selectedFile && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2 justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-700 font-medium">{selectedFile.name}</span>
              </div>
            )}
          </div>

          {/* 업로드 버튼 */}
          <div className="mt-6">
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-blue-400 hover:bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              size="lg"
            >
              {isUploading ? "업로드 중..." : "업로드"}
            </Button>
          </div>

          {/* 업로드된 문서 목록 */}
          {uploadedDocuments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">업로드된 문서</h3>
              <div className="space-y-3">
                {uploadedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{doc.name}</h4>
                        {doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
