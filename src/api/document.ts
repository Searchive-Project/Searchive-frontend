import apiClient from './client';

// 타입 정의
export interface Tag {
  tag_id: number;
  name: string;
}

export interface Document {
  document_id: number;
  original_filename: string;
  file_type: string;
  file_size_kb: number;
  uploaded_at: string;
  updated_at: string;
  summary?: string;
  tags: Tag[];
}

export interface PaginatedResponse {
  items: Document[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DocumentSearchResponse {
  documents: Document[];
  query: string;
  total: number;
}

// Document API
export const documentAPI = {
  /**
   * 문서 업로드
   * @param file - 업로드할 파일
   */
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/v1/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * 모든 문서 조회
   */
  getAll: async () => {
    const response = await apiClient.get('/api/v1/documents');
    return response.data;
  },

  /**
   * 페이지네이션된 문서 목록 조회 (내림차순)
   * @param page - 페이지 번호 (기본값: 1)
   * @param pageSize - 페이지당 항목 수 (기본값: 10)
   */
  getPaginated: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse> => {
    const response = await apiClient.get('/api/v1/documents/paginated', {
      params: {
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  },

  /**
   * 페이지네이션된 문서 목록 조회 (오름차순)
   * @param page - 페이지 번호 (기본값: 1)
   * @param pageSize - 페이지당 항목 수 (기본값: 10)
   */
  getPaginatedAscending: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse> => {
    const response = await apiClient.get('/api/v1/documents/paginated/ascending', {
      params: {
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  },

  /**
   * 태그로 문서 검색
   * @param tags - 검색할 태그 배열
   */
  searchByTags: async (tags: string[]): Promise<DocumentSearchResponse> => {
    const response = await apiClient.get<DocumentSearchResponse>(
      '/api/v1/documents/search/tags',
      {
        params: {
          tags: tags.join(','),
        },
      }
    );
    return response.data;
  },

  /**
   * 파일명으로 문서 검색
   * @param query - 검색할 파일명
   */
  searchByFilename: async (query: string): Promise<DocumentSearchResponse> => {
    const response = await apiClient.get<DocumentSearchResponse>(
      '/api/v1/documents/search/filename',
      {
        params: {
          query,
        },
      }
    );
    return response.data;
  },
};
