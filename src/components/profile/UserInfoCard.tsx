"use client"

import { User } from "lucide-react"

interface UserInfoCardProps {
  nickname: string
  createdAt: string
}

export default function UserInfoCard({ nickname, createdAt }: UserInfoCardProps) {
  // 가입일자 포맷팅 (YYYY-MM-DD)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* 프로필 아이콘 */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 via-blue-300 to-blue-400 flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>

        {/* 사용자 정보 */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{nickname}</h2>
          <p className="text-sm text-gray-500">
            <span className="font-medium">가입일:</span> {formatDate(createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
