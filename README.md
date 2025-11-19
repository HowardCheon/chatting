# 실시간 채팅방 with 사다리타기

실시간 채팅과 사다리타기 게임을 즐길 수 있는 웹 애플리케이션입니다.

## 주요 기능

### 기본 기능
- ✅ 실시간 채팅
- ✅ 닉네임 입력 및 자동 저장 (localStorage)
- ✅ 닉네임 변경 기능
- ✅ 현재 참여자 리스트 실시간 표시
- ✅ Vercel 배포 지원

### 사다리타기 게임
- ✅ 누구나 게임 생성 가능
- ✅ 참여자 수(2~6명) 및 결과 커스터마이징
- ✅ 선택 버튼으로 참여 (중복 선택 방지)
- ✅ 선택 후 결과 고정 및 표시
- ✅ 사다리 경로 시각화

## 기술 스택

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Realtime Database
- **Deployment**: Vercel

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Realtime Database 활성화
3. Database 규칙을 다음과 같이 설정:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**주의**: 위 규칙은 개발/테스트용입니다. 프로덕션 환경에서는 적절한 보안 규칙을 설정해야 합니다.

4. 프로젝트 설정에서 웹 앱 추가
5. Firebase 구성 정보 복사

### 3. 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 Firebase 구성 정보를 입력합니다:

```bash
cp .env.example .env.local
```

`.env.local` 파일 내용:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## Vercel 배포

### 1. Vercel CLI 설치 (선택사항)

```bash
npm install -g vercel
```

### 2. Vercel에 배포

#### 방법 1: Vercel CLI 사용

```bash
vercel
```

#### 방법 2: GitHub 연동

1. GitHub에 저장소 생성 및 푸시
2. [Vercel Dashboard](https://vercel.com/dashboard)에서 Import Project
3. GitHub 저장소 선택
4. 환경 변수 설정 (`.env.local`의 내용 입력)
5. Deploy 버튼 클릭

### 3. 환경 변수 설정

Vercel Dashboard의 프로젝트 설정에서 다음 환경 변수들을 추가합니다:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 사용 방법

### 채팅하기

1. 닉네임 입력 후 입장
2. 하단 입력창에 메시지 입력 후 전송
3. 우측 패널에서 현재 참여자 확인
4. 상단에서 닉네임 변경 가능

### 사다리타기 게임

1. "사다리타기" 탭 클릭
2. "게임 만들기" 버튼으로 새 게임 생성
   - 참여자 수 선택 (2~6명)
   - 각 결과 입력
3. 생성된 게임에서 "선택" 버튼 클릭
4. 선택 후 자동으로 결과 표시

## 프로젝트 구조

```
chatting/
├── app/
│   ├── page.tsx          # 메인 페이지
│   ├── layout.tsx        # 레이아웃
│   └── globals.css       # 전역 스타일
├── components/
│   ├── Chat.tsx          # 채팅 컴포넌트
│   ├── NicknameInput.tsx # 닉네임 입력
│   ├── ParticipantList.tsx # 참여자 리스트
│   └── LadderGame.tsx    # 사다리타기 게임
├── lib/
│   └── firebase.ts       # Firebase 설정
├── types/
│   └── index.ts          # TypeScript 타입 정의
└── public/               # 정적 파일
```

## 주요 기능 설명

### 실시간 동기화

Firebase Realtime Database를 사용하여 모든 데이터가 실시간으로 동기화됩니다:
- 채팅 메시지
- 참여자 목록
- 사다리타기 게임 선택

### 참여자 추적

- 10초마다 heartbeat 전송
- 30초 이상 응답 없는 참여자는 목록에서 제거
- 페이지 종료 시 자동으로 퇴장 처리

### 사다리타기 알고리즘

1. 랜덤하게 다리(가로선) 생성
2. 각 시작점에서 경로 계산
3. 선택 시 경로 시각화
4. 최종 결과 표시

## 라이선스

MIT

## 기여

이슈 및 풀 리퀘스트는 언제나 환영합니다!
