# 🚀 Searchive Frontend

**Searchive**는 AI 기반의 개인 문서 관리 및 지식 탐색 서비스입니다. 이 레포지토리는 사용자가 직접 상호작용하는 프런트엔드 웹 애플리케이션의 코드를 관리합니다.

최신 웹 기술인 **Vite**와 **React**, **TypeScript**를 기반으로 구축되어 빠르고 안정적인 사용자 경험을 제공하는 것을 목표로 합니다.

---

## ✨ 주요 기능 (Features)

-   **간편한 소셜 로그인**: 카카오 로그인을 통한 빠르고 안전한 인증.
-   **직관적인 문서 관리**: 드래그 앤 드롭 방식의 파일 업로드 및 문서 목록 관리.
-   **통합 검색**: 키워드와 의미 기반 검색을 결합한 하이브리드 검색 기능.
-   **AI 기반 기능**:
    -   원클릭 문서 요약.
    -   여러 문서를 선택하여 대화할 수 있는 AI 채팅 인터페이스.
    -   AI 채팅방 생성, 수정, 삭제 및 대화 관리.
    -   실시간 AI 응답 스트리밍.
-   **개인화 대시보드**: 사용자 프로필에서 자신의 지식 활용 패턴을 시각적으로 확인.
-   **사용자 프로필 페이지**:
    -   사용자 관심사 및 토픽 선호도 차트.
    -   활동 히트맵으로 사용 패턴 시각화.
    -   개인 정보 및 통계 확인.

---

## 🛠️ 기술 스택 (Tech Stack)

-   **Core**: React 19, TypeScript, Vite (with Rolldown)
-   **API Communication**: Axios
-   **State Management**: Zustand
-   **Routing**: React Router v7
-   **Styling**: Tailwind CSS v4
-   **UI Components**: Lucide React (아이콘), Class Variance Authority (컴포넌트 variants)

---

## 🏁 시작하기 (Getting Started)

### **사전 준비물**

-   [Node.js](https://nodejs.org/) (LTS 버전 권장)
-   npm 또는 yarn

### **설치 및 실행**

1.  **레포지토리 클론:**
    ```bash
    git clone https://github.com/Chaehyunli/Searchive-frontend.git
    cd Searchive-frontend
    ```

2.  **의존성 라이브러리 설치:**
    ```bash
    npm install
    ```

3.  **환경 변수 설정:**
    프로젝트 루트에 `.env` 파일을 생성하고, 백엔드 API 서버의 주소를 입력합니다.
    ```env
    # API Configuration
    VITE_API_BASE_URL=http://localhost:3000/api

    # Environment
    VITE_ENV=development
    ```

4.  **개발 서버 실행:**
    ```bash
    npm run dev
    ```
    서버가 실행되면 터미널에 나오는 주소(기본: `http://localhost:5173`)로 접속하여 애플리케이션을 확인할 수 있습니다.

---

## 📁 프로젝트 구조

```
Searchive-frontend/
├── public/              # 정적 파일 (favicon, images 등)
├── src/
│   ├── api/             # 🌐 API 요청 함수 및 Axios 인스턴스 관리
│   │   ├── auth.api.ts  # 인증 관련 API 함수
│   │   ├── client.ts    # Axios 인스턴스 설정
│   │   └── index.ts     # API 함수 Export
│   ├── assets/          # 🖼️ 이미지, 폰트 등 정적 에셋
│   ├── components/      # 🧱 재사용 가능한 UI 컴포넌트
│   │   ├── common/      # 버튼, 인풋 등 범용 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   ├── layout/      # 헤더, 푸터 등 레이아웃 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── profile/     # 사용자 프로필 관련 컴포넌트
│   │   │   ├── UserInfoCard.tsx         # 사용자 정보 카드
│   │   │   ├── TopicPreferenceChart.tsx # 토픽 선호도 차트
│   │   │   └── ActivityHeatmap.tsx      # 활동 히트맵
│   │   ├── DocumentList.tsx             # 문서 목록 컴포넌트
│   │   ├── DocumentSelector.tsx         # AI 채팅용 문서 선택기
│   │   ├── DocumentUploadModal.tsx      # 문서 업로드 모달
│   │   ├── CreateConversationModal.tsx  # AI 채팅방 생성 모달
│   │   ├── FeatureCards.tsx             # 기능 소개 카드
│   │   ├── HeroSection.tsx              # 메인 히어로 섹션
│   │   └── LoginModal.tsx               # 로그인 모달
│   ├── hooks/           # 🎣 커스텀 훅
│   │   ├── useAuth.ts          # 인증 상태 관리
│   │   └── useDocuments.ts     # 문서 데이터 관리
│   ├── lib/             # 🔧 유틸리티 함수
│   │   └── utils.ts            # 공통 유틸 함수 (cn 등)
│   ├── pages/           # 📄 페이지 단위의 컴포넌트
│   │   ├── MainPage.tsx                # 메인 랜딩 페이지
│   │   ├── DashBoardPage.tsx           # 대시보드 페이지 (문서 관리)
│   │   ├── UserProfilePage.tsx         # 사용자 프로필 페이지
│   │   ├── ConversationListPage.tsx    # AI 채팅방 목록 페이지
│   │   ├── ConversationDetailPage.tsx  # AI 채팅방 상세 페이지
│   │   └── KakaoCallback.tsx           # 카카오 로그인 콜백
│   ├── store/           # 🏪 전역 상태 관리 (Zustand)
│   │   └── authStore.ts        # 인증 상태 스토어
│   ├── styles/          # 🎨 전역 CSS, 테마 관련 파일
│   ├── types/           # 🏷️ TypeScript 타입 정의
│   │   └── index.ts
│   ├── App.css          # 애플리케이션 스타일
│   ├── App.tsx          # 🏠 애플리케이션 최상위 진입점 (라우팅 설정)
│   ├── index.css        # 전역 스타일 (Tailwind 포함)
│   └── main.tsx         # 애플리케이션 엔트리 포인트
├── .gitignore
├── eslint.config.js     # ESLint 설정
├── index.html           # HTML 템플릿
├── package.json         # 프로젝트 의존성 및 스크립트
├── postcss.config.js    # PostCSS 설정
├── tailwind.config.ts   # Tailwind CSS 설정
├── tsconfig.json        # TypeScript 설정
├── vite.config.ts       # Vite 설정
└── README.md
```

### 📂 폴더별 상세 설명

#### `api/` 🌐
- **역할**: Axios 인스턴스를 생성하고 기본 URL(`VITE_API_URL`), 헤더, 인터셉터 등을 설정하는 파일입니다.
- **내용**: `login()`, `uploadDocument()`, `getDocuments()` 등 백엔드와 통신하는 모든 API 요청 함수를 이곳에 모아 관리합니다.
- **예시**: `src/api/index.ts`

#### `assets/` 🖼️
- **역할**: 로고 이미지, 아이콘, 웹 폰트 등 프로젝트에서 사용하는 정적 파일들을 보관합니다.
- **예시**: 로고 파일, 아이콘 이미지 등

#### `components/` 🧱
- **역할**: 여러 페이지에서 재사용되는 작은 UI 조각들을 만듭니다.
- **하위 폴더**:
  - **`common/`**: `Button`, `Input`, `Modal`처럼 프로젝트 전반에서 사용되는 범용 컴포넌트가 위치합니다.
  - **`layout/`**: `Header`, `Footer`, `Sidebar`처럼 페이지의 전체적인 레이아웃을 구성하는 컴포넌트가 위치합니다.
  - **`profile/`**: 사용자 프로필 페이지에서 사용되는 컴포넌트들입니다. 사용자 정보 카드, 토픽 선호도 차트, 활동 히트맵 등이 포함됩니다.

#### `hooks/` 🎣
- **역할**: 여러 컴포넌트에서 공통으로 사용될 로직을 분리하는 커스텀 훅을 만듭니다.
- **내용**:
  - `useAuth.ts`: 사용자 인증 상태 및 로그인/로그아웃 로직 관리
  - `useDocuments.ts`: 문서 목록 조회 및 관리 로직

#### `lib/` 🔧
- **역할**: 프로젝트 전반에서 사용되는 유틸리티 함수들을 관리합니다.
- **내용**:
  - `utils.ts`: Tailwind CSS 클래스 병합을 위한 `cn()` 함수 등 공통 유틸리티

#### `pages/` 📄
- **역할**: 실제 사용자가 보게 될 페이지 단위의 큰 컴포넌트들을 만듭니다.
- **내용**:
  - `MainPage.tsx`: 메인 랜딩 페이지
  - `DashBoardPage.tsx`: 문서 관리 대시보드 페이지 (업로드, 검색, 목록 조회)
  - `UserProfilePage.tsx`: 사용자 프로필 및 활동 통계 페이지
  - `ConversationListPage.tsx`: AI 채팅방 목록 조회 및 관리 페이지
  - `ConversationDetailPage.tsx`: AI 채팅방 상세 및 대화 페이지
  - `KakaoCallback.tsx`: 카카오 로그인 OAuth 콜백 처리 페이지

#### `store/` 🏪
- **역할**: Zustand 같은 상태 관리 라이브러리를 사용하여 전역 상태를 관리합니다.
- **내용**: 로그인한 사용자 정보, 테마(다크/라이트 모드) 등 여러 컴포넌트가 공유해야 하는 데이터를 이곳에서 관리합니다.
- **예시**: `authStore.ts`

#### `styles/` 🎨
- **역할**: `global.css`나 `theme.ts` 파일 등을 두어 프로젝트의 전반적인 스타일, 색상, 폰트 크기 등을 정의합니다.

#### `types/` 🏷️
- **역할**: TypeScript 프로젝트의 핵심 폴더입니다.
- **내용**: 백엔드 API로부터 받는 `User`, `Document` 같은 데이터의 형태를 `interface`나 `type`으로 미리 정의하여 코드의 안정성을 높입니다.

#### `App.tsx` 🏠
- **역할**: React 애플리케이션의 최상위 진입점입니다.
- **내용**: React Router를 사용하여 각 URL 경로에 어떤 `pages`를 보여줄지 라우팅 설정을 이곳에서 합니다.

---

## 📜 사용 가능한 스크립트 (Available Scripts)

-   **`npm run dev`**: 개발 서버를 실행합니다 (기본 포트: 5173).
-   **`npm run build`**: 프로덕션 빌드를 생성합니다.
-   **`npm run lint`**: ESLint를 실행하여 코드 품질을 검사합니다.
-   **`npm run preview`**: 빌드된 애플리케이션을 미리보기 모드로 실행합니다.

---

## 🤝 기여하기 (Contributing)

이 프로젝트에 기여하고 싶으시다면:

1.  이 레포지토리를 Fork 합니다.
2.  새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`).
3.  변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`).
4.  브랜치에 Push 합니다 (`git push origin feature/amazing-feature`).
5.  Pull Request를 생성합니다.

---

## 📝 라이선스 (License)

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 📞 문의 (Contact)

프로젝트에 대한 문의사항이나 피드백은 아래로 연락주세요:

-   **GitHub**: [@Chaehyunli](https://github.com/Chaehyunli)
-   **GitHub Issues**: [Issues 페이지](https://github.com/Chaehyunli/Searchive-frontend/issues)
