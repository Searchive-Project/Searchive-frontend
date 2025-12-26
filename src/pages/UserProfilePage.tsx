"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import UserInfoCard from "../components/profile/UserInfoCard"
import TopicPreferenceChart from "../components/profile/TopicPreferenceChart"
import ActivityHeatmap from "../components/profile/ActivityHeatmap"

export default function UserProfilePage() {
  const { isLoggedIn, user } = useAuthStore()
  const navigate = useNavigate()

  // 로그인하지 않은 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 메인 콘텐츠 */}
      <div className="pt-20 sm:pt-24 py-8 sm:py-12 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-10 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">프로필</h1>
            <p className="text-sm sm:text-base text-gray-500">사용자 정보 및 활동 분석</p>
          </div>

          {/* 사용자 기본 정보 */}
          <div className="mb-8">
            <UserInfoCard
              nickname={user.nickname}
              createdAt={user.createdAt}
            />
          </div>

          {/* 구분선 */}
          <div className="w-full border-t border-gray-200 my-12"></div>

          {/* 통계 섹션 */}
          <div className="space-y-8">
            {/* 관심사 분석 */}
            <div>
              <TopicPreferenceChart />
            </div>

            {/* 활동 히트맵 */}
            <div>
              <ActivityHeatmap />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
