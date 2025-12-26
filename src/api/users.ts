import apiClient from './client';

// API 응답 타입 정의
export interface TopicPreferenceResponse {
  topics: {
    [key: string]: number;
  };
}

export interface ActivityDataPoint {
  date: string;
  count: number;
}

export interface ActivityHeatmapResponse {
  activities: ActivityDataPoint[];
}

// Users API
export const usersAPI = {
  /**
   * 관심사 분석 조회
   * 최근 30일간 사용자가 가장 많이 조회/업로드한 태그 집계
   */
  getTopicPreference: async (): Promise<TopicPreferenceResponse> => {
    const response = await apiClient.get<TopicPreferenceResponse>('/api/v1/users/stats/topics');
    return response.data;
  },

  /**
   * 활동 히트맵 조회
   * 최근 365일간 날짜별 활동 횟수 집계
   */
  getActivityHeatmap: async (): Promise<ActivityHeatmapResponse> => {
    const response = await apiClient.get<ActivityHeatmapResponse>('/api/v1/users/stats/heatmap');
    return response.data;
  },
};
