// API 클라이언트 및 도메인별 API export
export { default as apiClient } from './client';
export * from './auth.api';

// 기존 API 함수들 (추후 도메인별로 분리 예정)
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

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/api/v1/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getDocuments = async () => {
  const response = await apiClient.get('/api/v1/documents');
  return response.data;
};

export const getDocumentsPaginated = async (
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
};

export const getDocumentsPaginatedAscending = async (
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
};
