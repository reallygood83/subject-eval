# 평어솜 (EvalSom) - 프로젝트 SPEC 문서

> **프로젝트명**: 평어솜 (EvalSom)
> **의미**: "평어"(학생 평가 문구) + "솜솜" (부드럽고 따뜻한 느낌) - AI가 따뜻한 평어를 솜솜 만들어준다는 의미
> **버전**: v2.0.0
> **작성일**: 2025-11-25
> **GitHub**: https://github.com/reallygood83/subject-eval
> **배포**: Vercel

---

## 1. 프로젝트 개요

### 1.1 목적
한국 초등학교 교사를 위한 AI 기반 **교과별 학생 평어 자동 생성 웹 서비스**

### 1.2 핵심 기능
1. **PDF 업로드 & 분석**: 교육 평가 계획서 PDF에서 과목별 성취기준 자동 추출
2. **학생별 평가 설정**: 성취 수준, 태도, 생성 중심 등 개별 설정
3. **AI 평어 생성**: Gemini API를 활용한 생활기록부 적합 평어 자동 생성
4. **CSV 내보내기**: 생성된 평어를 CSV 파일로 다운로드
5. **Google 로그인**: Firebase Authentication을 통한 사용자 인증
6. **API 키 관리**: 사용자별 Gemini API 키 저장 및 모델 선택

### 1.3 기술 스택

| 구분 | 기술 |
|------|------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **Backend** | Firebase (Auth, Firestore) |
| **AI** | Google Gemini API (2.5-flash, Gemini 3) |
| **Design** | Neo-Brutalism UI |
| **Deployment** | Vercel |
| **Repository** | GitHub |

---

## 2. 디자인 시스템 (Neo-Brutalism)

### 2.1 색상 팔레트
```javascript
colors: {
  violet: { 200: "#A8A6FF", 300: "#918efa", 400: "#807dfa" },
  pink:   { 200: "#FFA6F6", 300: "#fa8cef", 400: "#fa7fee" },
  red:    { 200: "#FF9F9F", 300: "#fa7a7a", 400: "#f76363" },
  orange: { 200: "#FFC29F", 300: "#FF965B", 400: "#fa8543" },
  yellow: { 200: "#FFF59F", 300: "#FFF066", 400: "#FFE500" },
  lime:   { 200: "#B8FF9F", 300: "#9dfc7c", 400: "#7df752" },
  cyan:   { 200: "#A6FAFF", 300: "#79F7FF", 400: "#53f2fc" }
}
```

### 2.2 핵심 스타일 패턴
- **테두리**: `border-black border-2` (기본) / `border-4` (강조)
- **그림자 (hover)**: `hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]`
- **그림자 (static)**: `shadow-[8px_8px_0px_rgba(0,0,0,1)]`
- **색상 상태**: `bg-{color}-200 hover:bg-{color}-300 active:bg-{color}-400`
- **폰트**: Pretendard (400, 500, 600, 700, 800)

### 2.3 컴포넌트 스타일 가이드

#### Button
```tsx
// Primary Button
className="h-12 px-5 bg-cyan-200 hover:bg-cyan-300 active:bg-cyan-400
           border-black border-2 font-bold
           hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"

// Disabled Button
className="border-[#727272] bg-[#D4D4D4] text-[#676767] hover:shadow-none"
```

#### Card
```tsx
className="w-full border-black border-2 rounded-md bg-white
           shadow-[8px_8px_0px_rgba(0,0,0,1)]"
```

#### Input
```tsx
className="w-full border-black border-2 p-2.5
           focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)]
           focus:bg-pink-200"
```

---

## 3. 시스템 아키텍처

### 3.1 전체 구조
```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel (Frontend)                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  React + TypeScript + Vite + Tailwind (Neo-Brutalism)   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    Firebase     │ │    Firebase     │ │   Gemini API    │
│ Authentication  │ │   Firestore     │ │   (Google AI)   │
│  (Google Login) │ │  (User Data)    │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 3.2 데이터 흐름
```
1. 사용자 → Google 로그인 → Firebase Auth
2. 사용자 → 설정에서 Gemini API 키 입력 → Firestore 저장
3. 사용자 → PDF 업로드 → Gemini API로 성취기준 추출
4. 사용자 → 학생 설정 → Gemini API로 평어 생성
5. 사용자 → CSV 다운로드
```

### 3.3 Firebase 데이터 구조 (Firestore)
```
users/
  └── {userId}/
        ├── email: string
        ├── displayName: string
        ├── photoURL: string
        ├── createdAt: timestamp
        ├── lastLoginAt: timestamp
        └── settings/
              └── gemini/
                    ├── apiKey: string (encrypted)
                    ├── model: "gemini-2.5-flash" | "gemini-3"
                    └── updatedAt: timestamp
```

---

## 4. 기능 명세

### 4.1 인증 시스템

#### 4.1.1 Google 로그인
- Firebase Authentication의 Google Provider 사용
- 로그인 성공 시 Firestore에 사용자 정보 저장/업데이트
- 로그인 상태 유지 (세션 지속)

#### 4.1.2 로그아웃
- Firebase signOut 호출
- 로컬 상태 초기화

### 4.2 설정 페이지

#### 4.2.1 Gemini API 키 관리
- API 키 입력 필드 (마스킹 처리)
- API 키 유효성 검증 (실제 API 호출 테스트)
- Firestore에 암호화 저장

#### 4.2.2 모델 선택
- `gemini-2.5-flash`: 빠른 응답, 일반 작업용
- `gemini-3`: 고품질 응답, 복잡한 작업용

### 4.3 PDF 업로드 & 분석

#### 4.3.1 파일 업로드
- PDF 파일 드래그 앤 드롭 또는 클릭 업로드
- 파일 크기 제한: 10MB
- 지원 형식: PDF

#### 4.3.2 성취기준 추출
- Gemini API를 통한 텍스트 분석
- 과목별 성취기준 자동 분류
- 고유 ID 생성 (예: [2슬01-01])

### 4.4 평어 생성

#### 4.4.1 학생 설정
- 학생 수 설정 (1-50명)
- 과목 선택
- 성취기준 선택 (자동/수동)
- 성취 수준: 상/중/하/노력요함
- 태도: 좋음/보통/미흡함
- 생성 중심: 성취 수준 중심 / 태도 중심 / 균형

#### 4.4.2 평어 생성
- 개별 생성 / 전체 생성
- 생성 중 로딩 상태 표시
- 생성 완료 후 확인 버튼
- 평어 수정 가능

### 4.5 내보내기

#### 4.5.1 CSV 다운로드
- 확정된 평어만 포함
- UTF-8 BOM 포함 (한글 호환)
- 컬럼: 학생 번호, 과목, 생성된 평어

---

## 5. 페이지 구조

### 5.1 라우팅
```
/                 → 랜딩 페이지 (로그인 전)
/login            → 로그인 페이지
/app              → 메인 앱 (로그인 후)
  /app/upload     → PDF 업로드
  /app/review     → 성취기준 검토
  /app/generate   → 평어 생성
/settings         → 설정 페이지
```

### 5.2 컴포넌트 구조
```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   └── ProgressBar.tsx
│   ├── auth/
│   │   ├── LoginButton.tsx
│   │   ├── UserMenu.tsx
│   │   └── ProtectedRoute.tsx
│   ├── settings/
│   │   ├── ApiKeyInput.tsx
│   │   └── ModelSelector.tsx
│   ├── upload/
│   │   └── PdfUpload.tsx
│   ├── review/
│   │   └── ReviewData.tsx
│   └── generate/
│       ├── StudentCard.tsx
│       ├── AllCommentsModal.tsx
│       └── BulkSettings.tsx
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useSettings.ts
├── services/
│   ├── firebase.ts
│   ├── geminiService.ts
│   └── pdfParserService.ts
├── types/
│   └── index.ts
└── App.tsx
```

---

## 6. 보안 요구사항

### 6.1 API 키 보안
- **절대 GitHub에 노출 금지**
- 환경 변수 사용 (`.env.local`)
- Firestore 저장 시 클라이언트 측 암호화 고려
- Firebase Security Rules로 사용자 본인 데이터만 접근 가능

### 6.2 Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /settings/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 6.3 환경 변수
```env
# .env.local (Git에 포함하지 않음)
VITE_FIREBASE_API_KEY=AIzaSyCAeLZf3y9Cf_y0KTkOdzUSw3RJmvZpckQ
VITE_FIREBASE_AUTH_DOMAIN=evalso-e268e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=evalso-e268e
VITE_FIREBASE_STORAGE_BUCKET=evalso-e268e.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=726874034734
VITE_FIREBASE_APP_ID=1:726874034734:web:a0528725ce0c9f1061c5bf
VITE_FIREBASE_MEASUREMENT_ID=G-P2JPNR8XR0
```

---

## 7. Gemini API 모델 정보

### 7.1 지원 모델

| 모델 ID | 설명 | 무료 티어 |
|---------|------|----------|
| `gemini-2.5-flash` | 최신 Flash 모델, 빠르고 효율적 | O (15 RPM, 1500 RPD) |
| `gemini-3` | 차세대 고성능 모델 | O (제한적) |

### 7.2 API 호출 형식
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: userApiKey });

const response = await ai.models.generateContent({
  model: selectedModel, // 'gemini-2.5-flash' 또는 'gemini-3'
  contents: prompt,
  config: {
    temperature: 0.9,
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});
```

---

## 8. 배포 설정

### 8.1 Vercel 설정
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Firebase 설정값 추가

### 8.2 GitHub Actions (선택사항)
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
```

---

## 9. 개발 일정

### Phase 1: 기반 구축 (1-2일)
- [x] 프로젝트 구조 설정
- [ ] Neo-Brutalism 디자인 시스템 적용
- [ ] Firebase 초기화 및 연동
- [ ] Google 로그인 구현

### Phase 2: 핵심 기능 (2-3일)
- [ ] 설정 페이지 (API 키, 모델 선택)
- [ ] PDF 업로드 & 분석 기능 리팩토링
- [ ] Gemini API 연동 (사용자 키 사용)
- [ ] 평어 생성 기능 리팩토링

### Phase 3: UI/UX 개선 (1-2일)
- [ ] 전체 UI Neo-Brutalism 적용
- [ ] 반응형 디자인
- [ ] 로딩/에러 상태 처리

### Phase 4: 배포 및 테스트 (1일)
- [ ] Vercel 배포 설정
- [ ] 테스트 및 버그 수정
- [ ] 문서화

---

## 10. 참고 자료

### 10.1 Neo-Brutalism UI 라이브러리
- 로컬 경로: `/Users/moon/Desktop/neo-brutalism-ui-library-main`
- 레퍼런스: `/Users/moon/Library/CloudStorage/GoogleDrive-jpmjkim23@gmail.com/내 드라이브/Obsidaian/GrowthHub/900-System/neo-brutalism-ui-reference.md`

### 10.2 Firebase 문서
- Authentication: https://firebase.google.com/docs/auth
- Firestore: https://firebase.google.com/docs/firestore

### 10.3 Gemini API 문서
- Google AI Studio: https://aistudio.google.com/
- API Reference: https://ai.google.dev/gemini-api/docs

---

## 11. 주의사항

> **중요**: Firebase SDK 설정값은 절대 GitHub에 직접 커밋하지 마세요!
>
> - `.env.local` 파일에 저장
> - `.gitignore`에 `.env.local` 추가
> - Vercel 환경 변수로 설정

---

**문서 작성**: Claude (Anthropic)
**프로젝트 관리**: 사용자
**최종 업데이트**: 2025-11-25
