"use client"

import { useEffect, useState } from "react"
import { usersAPI, ActivityDataPoint } from "../../api"
import { Calendar } from "lucide-react"

export default function ActivityHeatmap() {
  const [activities, setActivities] = useState<ActivityDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)
        const data = await usersAPI.getActivityHeatmap()
        setActivities(data.activities)
      } catch (err) {
        console.error("활동 히트맵 조회 실패:", err)
        setError("활동 데이터를 불러오지 못했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  // 활동 데이터를 Map으로 변환 (날짜 → 카운트)
  const activityMap = new Map<string, number>()
  activities.forEach((activity) => {
    activityMap.set(activity.date, activity.count)
  })

  // 최근 365일 날짜 배열 생성 (오늘부터 역순)
  const generateLast365Days = () => {
    const days: Date[] = []
    const today = new Date()
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push(date)
    }
    return days
  }

  const last365Days = generateLast365Days()

  // 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // 활동 강도에 따른 색상 결정
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-gray-100"
    if (count <= 2) return "bg-green-200"
    if (count <= 5) return "bg-green-300"
    if (count <= 8) return "bg-green-400"
    return "bg-green-500"
  }

  // 주 단위로 그룹화 (52주)
  const weeks: Date[][] = []
  for (let i = 0; i < last365Days.length; i += 7) {
    weeks.push(last365Days.slice(i, i + 7))
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900">활동 히트맵</h3>
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
          <Calendar className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900">활동 히트맵</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900">활동 히트맵</h3>
      </div>
      <p className="text-sm text-gray-500 mb-6">최근 365일간 활동 기록</p>

      {/* 히트맵 그리드 */}
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                const dateStr = formatDate(day)
                const count = activityMap.get(dateStr) || 0
                const colorClass = getColorClass(count)

                return (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${colorClass} hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer`}
                    title={`${dateStr}: ${count}회 활동`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <span className="text-xs text-gray-500">적음</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100" />
          <div className="w-3 h-3 rounded-sm bg-green-200" />
          <div className="w-3 h-3 rounded-sm bg-green-300" />
          <div className="w-3 h-3 rounded-sm bg-green-400" />
          <div className="w-3 h-3 rounded-sm bg-green-500" />
        </div>
        <span className="text-xs text-gray-500">많음</span>
      </div>
    </div>
  )
}
