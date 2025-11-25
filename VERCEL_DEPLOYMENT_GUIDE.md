# 🚀 이발소 (Eval Place) Vercel 배포 가이드

## 📋 목차
1. [환경변수 설정](#환경변수-설정)
2. [Vercel 배포 단계](#vercel-배포-단계)
3. [배포 후 확인사항](#배포-후-확인사항)
4. [트러블슈팅](#트러블슈팅)

---

## 🔐 환경변수 설정

### ⚠️ 중요 보안 안내
- **절대 GitHub에 환경변수를 커밋하지 마세요!**
- `.env` 파일은 `.gitignore`에 포함되어 있습니다
- 모든 민감한 정보는 Vercel 대시보드에서만 설정하세요

### 📝 필수 환경변수 목록 (총 7개)

Vercel 프로젝트 설정 → Settings → Environment Variables에서 아래 변수들을 추가하세요.

#### 1. Firebase 인증 및 설정 (6개)

| 변수명 | 설명 | 예시 값 | 어디서 찾을 수 있나요? |
|--------|------|---------|----------------------|
| `VITE_FIREBASE_API_KEY` | Firebase API 키 | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX` | Firebase Console → 프로젝트 설정 → 일반 → 내 앱 |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase 인증 도메인 | `your-project.firebaseapp.com` | Firebase Console → 프로젝트 설정 → 일반 → 내 앱 |
| `VITE_FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID | `your-project-id` | Firebase Console → 프로젝트 설정 → 일반 |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase 스토리지 버킷 | `your-project.appspot.com` | Firebase Console → 프로젝트 설정 → 일반 → 내 앱 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase 메시징 발신자 ID | `123456789012` | Firebase Console → 프로젝트 설정 → 일반 → 내 앱 |
| `VITE_FIREBASE_APP_ID` | Firebase 앱 ID | `1:123456789012:web:abcdef123456` | Firebase Console → 프로젝트 설정 → 일반 → 내 앱 |

#### 2. 선택적 환경변수 (1개)

| 변수명 | 설명 | 예시 값 | 필수 여부 |
|--------|------|---------|----------|
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase 애널리틱스 측정 ID | `G-XXXXXXXXXX` | 선택 (Analytics 사용 시) |

---

## 🔍 Firebase 환경변수 찾는 방법

### 단계별 가이드

1. **Firebase Console 접속**
   - https://console.firebase.google.com/ 접속
   - 해당 프로젝트 선택

2. **프로젝트 설정 열기**
   - 왼쪽 상단 ⚙️ (톱니바퀴) 아이콘 클릭
   - "프로젝트 설정" 선택

3. **내 앱 섹션 찾기**
   - "일반" 탭에서 아래로 스크롤
   - "내 앱" 섹션 찾기
   - 웹 앱 (</>) 선택

4. **SDK 구성 복사**
   ```javascript
   const firebaseConfig = {
     apiKey: "여기_복사",
     authDomain: "여기_복사",
     projectId: "여기_복사",
     storageBucket: "여기_복사",
     messagingSenderId: "여기_복사",
     appId: "여기_복사",
     measurementId: "여기_복사" // 선택적
   };
   ```

---

## 🚀 Vercel 배포 단계

### 1️⃣ GitHub 저장소 연결

```bash
# 터미널에서 실행
cd /Users/moon/Desktop/subjuct-eval/subject-eval

# Git 초기화 (이미 되어있다면 생략)
git init

# 변경사항 커밋
git add .
git commit -m "feat: 이발소 초기 배포 준비 완료"

# GitHub 저장소 연결
git remote add origin https://github.com/reallygood83/subject-eval.git

# 푸시
git branch -M main
git push -u origin main
```

### 2️⃣ Vercel 프로젝트 생성

1. **Vercel 웹사이트 접속**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - "Add New" → "Project" 클릭
   - `subject-eval` 저장소 선택
   - "Import" 클릭

3. **프로젝트 설정**
   - **Framework Preset**: Vite 자동 감지됨
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동)
   - **Output Directory**: `dist` (자동)
   - **Install Command**: `npm install` (자동)

### 3️⃣ 환경변수 설정

1. **Settings → Environment Variables로 이동**

2. **각 환경변수 추가**
   - 위의 [필수 환경변수 목록](#필수-환경변수-목록-총-7개) 참고
   - 하나씩 추가:
     - Name: `VITE_FIREBASE_API_KEY`
     - Value: `실제_API_키_값`
     - Environment: `Production`, `Preview`, `Development` 모두 선택
     - "Add" 클릭

3. **총 7개 환경변수 모두 추가 완료**

### 4️⃣ 배포 시작

1. **Deploy 버튼 클릭**
   - 환경변수 설정 완료 후 "Deploy" 클릭
   - 빌드 로그 모니터링

2. **배포 완료 대기**
   - 보통 2-3분 소요
   - 성공 시 도메인 URL 확인

---

## ✅ 배포 후 확인사항

### 1. 기본 동작 확인

- [ ] 랜딩 페이지 정상 로드
- [ ] Google 로그인 기능 작동
- [ ] 설정 페이지 접근 가능
- [ ] PDF 업로드 기능 정상 작동

### 2. Firebase 연동 확인

- [ ] Firebase Authentication 로그인 성공
- [ ] Firestore 데이터 저장/불러오기 정상
- [ ] 사용자 설정 동기화 작동

### 3. Neo-Brutalism UI 확인

- [ ] 모든 페이지 스타일 정상 표시
- [ ] 버튼 및 카드 그림자 효과 작동
- [ ] 반응형 디자인 동작 (모바일/태블릿/데스크톱)

### 4. Gemini AI 기능 확인

- [ ] 사용자 API 키 입력 가능
- [ ] 평어 생성 기능 정상 작동
- [ ] 에러 처리 및 로딩 상태 표시

---

## 🔧 트러블슈팅

### ❌ 문제: Firebase 연결 실패

**증상**: "Firebase: Error (auth/configuration-not-found)" 에러

**해결방법**:
1. Vercel 환경변수가 모두 정확히 입력되었는지 확인
2. 환경변수 이름이 `VITE_` 접두사로 시작하는지 확인
3. Firebase Console에서 웹 앱이 등록되었는지 확인
4. Vercel에서 재배포 시도 (Deployments → ... → Redeploy)

### ❌ 문제: 환경변수가 적용되지 않음

**증상**: `import.meta.env.VITE_XXX`가 undefined

**해결방법**:
1. 환경변수 이름 확인 (대소문자 구분)
2. `VITE_` 접두사 확인 (Vite 필수 요구사항)
3. Vercel 설정에서 Environment가 `Production` 포함되어 있는지 확인
4. 재배포 필수 (환경변수 변경 후 자동 재배포 안됨)

### ❌ 문제: Google 로그인 실패

**증상**: "Unauthorized domain" 에러

**해결방법**:
1. Firebase Console → Authentication → Settings → Authorized domains
2. Vercel 도메인 추가:
   - `your-project.vercel.app`
   - 커스텀 도메인이 있다면 그것도 추가
3. 변경사항 저장 후 재시도

### ❌ 문제: 빌드 실패

**증상**: Vercel 빌드 에러 발생

**해결방법**:
1. 로컬에서 `npm run build` 테스트
2. TypeScript 타입 에러 수정
3. `package.json` dependencies 확인
4. Node.js 버전 확인 (Vercel은 Node 18+ 권장)

---

## 📊 배포 상태 모니터링

### Vercel 대시보드에서 확인

- **Deployments**: 배포 이력 및 로그
- **Analytics**: 사용자 트래픽 분석
- **Speed Insights**: 페이지 로딩 속도
- **Logs**: 실시간 에러 로그

### Firebase Console에서 확인

- **Authentication**: 로그인 사용자 현황
- **Firestore**: 데이터베이스 사용량
- **Analytics**: 앱 사용 통계 (설정 시)

---

## 🎯 프로덕션 체크리스트

배포 전 최종 확인:

- [ ] `.gitignore`에 `.env` 파일 포함 확인
- [ ] GitHub에 환경변수 파일이 업로드되지 않았는지 확인
- [ ] 모든 Firebase 환경변수 7개 Vercel에 등록
- [ ] Firebase Authorized domains에 Vercel 도메인 추가
- [ ] 로컬에서 `npm run build` 성공 확인
- [ ] TypeScript 타입 에러 없음 확인
- [ ] 주요 기능 로컬 테스트 완료

---

## 📞 지원 및 문의

### 공식 문서
- [Vercel 배포 가이드](https://vercel.com/docs)
- [Firebase 웹 설정](https://firebase.google.com/docs/web/setup)
- [Vite 환경변수](https://vitejs.dev/guide/env-and-mode.html)

### GitHub 저장소
- https://github.com/reallygood83/subject-eval

---

**마지막 업데이트**: 2025년 1월
**버전**: 1.0.0
**프로젝트**: 이발소 (Eval Place) - AI 기반 초등학교 평어 생성 도구
