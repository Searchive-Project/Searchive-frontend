"use client"

import { useEffect, useState } from "react"
import { usersAPI } from "../../api"
import { TrendingUp } from "lucide-react"

export default function TopicPreferenceChart() {
  const [topics, setTopics] = useState<{ [key: string]: number }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true)
        const data = await usersAPI.getTopicPreference()
        setTopics(data.topics)
      } catch (err) {
        console.error("관심사 조회 실패:", err)
        setError("관심사 데이터를 불러오지 못했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopics()
  }, [])

  // 최대 값 계산 (바 차트 스케일링용)
  const maxCount = Math.max(...Object.values(topics), 1)

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900">관심사 분석</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-gray-400">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900">관심사 분석</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (Object.keys(topics).length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900">관심사 분석</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">아직 활동 데이터가 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900">관심사 분석</h3>
      </div>
      <p className="text-sm text-gray-500 mb-6">최근 30일간 가장 많이 활동한 주제</p>

      <div className="space-y-4">
        {Object.entries(topics).map(([topic, count], index) => {
          const percentage = (count / maxCount) * 100
          const colors = [
            "bg-blue-400",
            "bg-purple-400",
            "bg-pink-400",
            "bg-orange-400",
            "bg-green-400",
          ]
          const barColor = colors[index % colors.length]

          return (
            <div key={topic}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{topic}</span>
                <span className="text-sm text-gray-500">{count}회</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className={`${barColor} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
