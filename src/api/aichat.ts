import apiClient from './client';

// 타입 정의
export interface MessageSchema {
  message_id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ConversationCreateRequest {
  title: string;
  document_ids: number[];
}

export interface ConversationCreateResponse {
  conversation_id: number;
  title: string;
  created_at: string;
}

export interface ConversationListItemSchema {
  conversation_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedConversationListResponse {
  items: ConversationListItemSchema[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ConversationDetailSchema {
  conversation_id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  messages: MessageSchema[];
}

export interface ConversationDeleteResponse {
  message: string;
  conversation_id: number;
}

export interface MessageSendRequest {
  content: string;
}

export interface MessageSendResponse {
  user_message: MessageSchema;
  assistant_message: MessageSchema;
}

export interface DocumentSchema {
  document_id: number;
  original_filename: string;
  file_type: string;
  uploaded_at: string;
}

export interface ConversationDocumentsResponse {
  conversation_id: number;
  documents: DocumentSchema[];
}

export interface ConversationUpdateRequest {
  title: string;
}

// AIChat API
export const aichatAPI = {
  /**
   * 채팅방 생성
   * @param data - 채팅방 생성 요청 데이터
   */
  createConversation: async (
    data: ConversationCreateRequest
  ): Promise<ConversationCreateResponse> => {
    const response = await apiClient.post<ConversationCreateResponse>(
      '/api/v1/aichat/conversations',
      data
    );
    return response.data;
  },

  /**
   * 채팅방 목록 조회
   * @param page - 페이지 번호 (기본값: 1)
   * @param pageSize - 페이지당 항목 수 (기본값: 20)
   */
  getConversations: async (
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedConversationListResponse> => {
    const response = await apiClient.get<PaginatedConversationListResponse>(
      '/api/v1/aichat/conversations',
      {
        params: {
          page,
          page_size: pageSize,
        },
      }
    );
    return response.data;
  },

  /**
   * 채팅방 상세 조회
   * @param conversationId - 채팅방 ID
   */
  getConversationDetail: async (
    conversationId: number
  ): Promise<ConversationDetailSchema> => {
    const response = await apiClient.get<ConversationDetailSchema>(
      `/api/v1/aichat/conversations/${conversationId}`
    );
    return response.data;
  },

  /**
   * 채팅방 삭제
   * @param conversationId - 채팅방 ID
   */
  deleteConversation: async (
    conversationId: number
  ): Promise<ConversationDeleteResponse> => {
    const response = await apiClient.delete<ConversationDeleteResponse>(
      `/api/v1/aichat/conversations/${conversationId}`
    );
    return response.data;
  },

  /**
   * 메시지 전송 및 AI 응답 받기
   * @param conversationId - 채팅방 ID
   * @param data - 메시지 전송 요청 데이터
   */
  sendMessage: async (
    conversationId: number,
    data: MessageSendRequest
  ): Promise<MessageSendResponse> => {
    const response = await apiClient.post<MessageSendResponse>(
      `/api/v1/aichat/conversations/${conversationId}/messages`,
      data
    );
    return response.data;
  },

  /**
   * 메시지 목록 조회
   * @param conversationId - 채팅방 ID
   */
  getMessages: async (conversationId: number): Promise<MessageSchema[]> => {
    const response = await apiClient.get<MessageSchema[]>(
      `/api/v1/aichat/conversations/${conversationId}/messages`
    );
    return response.data;
  },

  /**
   * 채팅방에 연결된 문서 목록 조회
   * @param conversationId - 채팅방 ID
   */
  getConversationDocuments: async (
    conversationId: number
  ): Promise<ConversationDocumentsResponse> => {
    const response = await apiClient.get<ConversationDocumentsResponse>(
      `/api/v1/aichat/conversations/${conversationId}/documents`
    );
    return response.data;
  },

  /**
   * 채팅방 제목 수정
   * @param conversationId - 채팅방 ID
   * @param data - 제목 수정 요청 데이터
   */
  updateConversationTitle: async (
    conversationId: number,
    data: ConversationUpdateRequest
  ): Promise<ConversationListItemSchema> => {
    const response = await apiClient.patch<ConversationListItemSchema>(
      `/api/v1/aichat/conversations/${conversationId}`,
      data
    );
    return response.data;
  },
};
