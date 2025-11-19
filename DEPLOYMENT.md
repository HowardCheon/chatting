# 배포 가이드

## Vercel을 통한 배포

### 준비사항

1. Firebase 프로젝트 생성 및 설정
2. GitHub 계정
3. Vercel 계정 (GitHub 연동 추천)

### 단계별 가이드

#### 1. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: chatting-app)
4. Google Analytics는 선택사항
5. 프로젝트 생성 완료

#### 2. Realtime Database 활성화

1. 왼쪽 메뉴에서 "빌드" > "Realtime Database" 선택
2. "데이터베이스 만들기" 클릭
3. 위치 선택 (asia-southeast1 권장)
4. 보안 규칙: "테스트 모드에서 시작" 선택
5. "사용 설정" 클릭

#### 3. 데이터베이스 보안 규칙 설정

Firebase Console의 Realtime Database > 규칙 탭에서 다음 규칙 적용:

```json
{
  "rules": {
    "messages": {
      ".read": true,
      ".write": true,
      ".indexOn": ["timestamp"]
    },
    "participants": {
      ".read": true,
      ".write": true,
      ".indexOn": ["lastSeen"]
    },
    "ladderGames": {
      ".read": true,
      ".write": true,
      ".indexOn": ["createdAt"]
    }
  }
}
```

**중요**: 프로덕션 환경에서는 더 엄격한 보안 규칙을 설정해야 합니다.

#### 4. 웹 앱 추가 및 구성 정보 얻기

1. 프로젝트 설정 (톱니바퀴 아이콘) 클릭
2. "내 앱"에서 웹 앱 추가 (</> 아이콘)
3. 앱 닉네임 입력
4. "앱 등록" 클릭
5. Firebase SDK 구성 정보 복사

구성 정보 예시:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "chatting-app-xxxxx.firebaseapp.com",
  databaseURL: "https://chatting-app-xxxxx-default-rtdb.firebaseio.com",
  projectId: "chatting-app-xxxxx",
  storageBucket: "chatting-app-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

#### 5. GitHub에 코드 푸시

```bash
# Git 초기화 (아직 안 했다면)
git init

# .gitignore 확인 (.env.local이 포함되어 있는지)

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit"

# GitHub 저장소 생성 후 연결
git remote add origin https://github.com/your-username/chatting.git

# 푸시
git push -u origin main
```

#### 6. Vercel에 배포

**방법 1: Vercel Dashboard 사용 (추천)**

1. [Vercel](https://vercel.com) 접속 및 GitHub 로그인
2. "Add New..." > "Project" 클릭
3. GitHub 저장소에서 chatting 선택
4. "Import" 클릭
5. "Configure Project" 화면에서 환경 변수 추가:

   - `NEXT_PUBLIC_FIREBASE_API_KEY` = (Firebase 구성의 apiKey)
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = (Firebase 구성의 authDomain)
   - `NEXT_PUBLIC_FIREBASE_DATABASE_URL` = (Firebase 구성의 databaseURL)
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = (Firebase 구성의 projectId)
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = (Firebase 구성의 storageBucket)
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = (Firebase 구성의 messagingSenderId)
   - `NEXT_PUBLIC_FIREBASE_APP_ID` = (Firebase 구성의 appId)

6. "Deploy" 클릭
7. 배포 완료 대기 (약 2-3분)
8. 배포 URL 확인 (예: https://chatting-xxxxx.vercel.app)

**방법 2: Vercel CLI 사용**

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel

# 환경 변수 추가
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_DATABASE_URL
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID

# 프로덕션 배포
vercel --prod
```

#### 7. 배포 확인

1. Vercel이 제공한 URL로 접속
2. 닉네임 입력 화면 확인
3. 채팅 기능 테스트
4. 사다리타기 게임 테스트

### 환경 변수 업데이트

환경 변수를 변경해야 하는 경우:

1. Vercel Dashboard > 프로젝트 선택
2. Settings > Environment Variables
3. 변수 수정 또는 추가
4. Deployments 탭에서 "Redeploy" 클릭

### 도메인 연결 (선택사항)

1. Vercel Dashboard > 프로젝트 선택
2. Settings > Domains
3. "Add" 버튼 클릭
4. 도메인 입력
5. DNS 설정 지침 따르기

### 문제 해결

#### 빌드 실패

- Node.js 버전 확인: Vercel은 기본적으로 최신 LTS 버전 사용
- 의존성 문제: `package.json`의 dependencies 확인

#### 런타임 오류

- 브라우저 콘솔 확인
- Vercel Dashboard > Deployments > 배포 클릭 > Runtime Logs 확인
- Firebase 구성 정보 재확인

#### Firebase 연결 오류

- 환경 변수가 올바르게 설정되었는지 확인
- Firebase Console에서 Realtime Database가 활성화되어 있는지 확인
- Database 규칙이 올바르게 설정되어 있는지 확인

### 보안 강화 (프로덕션 권장)

#### Firebase 보안 규칙 개선

```json
{
  "rules": {
    "messages": {
      ".read": true,
      ".write": "auth != null || true",
      "$messageId": {
        ".validate": "newData.hasChildren(['nickname', 'text', 'timestamp', 'type'])"
      }
    },
    "participants": {
      ".read": true,
      ".write": true,
      "$participantId": {
        ".validate": "newData.hasChildren(['nickname', 'joinedAt', 'lastSeen'])"
      }
    },
    "ladderGames": {
      ".read": true,
      ".write": true,
      "$gameId": {
        ".validate": "newData.hasChildren(['createdBy', 'creatorNickname', 'participantCount', 'results', 'createdAt'])"
      }
    }
  }
}
```

#### Rate Limiting

Vercel의 Edge Config를 사용하거나 Upstash Redis를 연동하여 Rate Limiting 구현을 고려하세요.

### 모니터링

- Vercel Analytics 활성화
- Firebase Console에서 사용량 모니터링
- 오류 추적을 위해 Sentry 등의 도구 연동 고려

## 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Firebase 문서](https://firebase.google.com/docs)
- [Next.js 문서](https://nextjs.org/docs)
