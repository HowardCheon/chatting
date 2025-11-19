# Vercel 환경 변수 설정 가이드

## 🚨 가장 중요!

### 이미 환경 변수를 설정하셨나요?

**Vercel에서 환경 변수를 추가한 후에는 반드시 재배포가 필요합니다!**

환경 변수는 빌드 타임에 번들에 포함되기 때문에, 새로 추가한 환경 변수를 적용하려면 재배포를 해야 합니다.

### 재배포 방법 (1분)

1. https://vercel.com/dashboard 접속
2. 프로젝트 선택
3. **Deployments** 탭 클릭
4. 최신 배포 옆 **⋯** (점 3개) 클릭
5. **Redeploy** 클릭
6. 확인 대화상자에서 다시 **Redeploy** 클릭

---

## 처음 설정하는 경우

배포 후 "Firebase 설정 오류" 화면이 보인다면, Vercel에 환경 변수를 설정해야 합니다.

## 1단계: Firebase 구성 정보 복사

### Firebase Console에서 확인
1. https://console.firebase.google.com/ 접속
2. 프로젝트 선택
3. ⚙️ (톱니바퀴) → **프로젝트 설정** 클릭
4. 아래로 스크롤 → **내 앱** 섹션
5. 웹 앱 선택 (없으면 `</>` 클릭하여 추가)
6. **SDK 설정 및 구성** 값 복사

예시:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "chatting-xxx.firebaseapp.com",
  databaseURL: "https://chatting-xxx-default-rtdb.firebaseio.com",
  projectId: "chatting-xxx",
  storageBucket: "chatting-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 2단계: Vercel에 환경 변수 추가

### 방법 1: Vercel Dashboard (추천)

1. https://vercel.com/dashboard 접속
2. **chatting** 프로젝트 클릭
3. **Settings** 탭 클릭
4. 왼쪽 메뉴에서 **Environment Variables** 클릭
5. 다음 7개 변수를 **하나씩** 추가:

| 변수 이름 | 값 (예시) |
|----------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyC...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `chatting-xxx.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | `https://chatting-xxx-default-rtdb.firebaseio.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `chatting-xxx` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `chatting-xxx.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123456789:web:abc123` |

6. 각 변수 추가 시:
   - **Name**: 위 표의 변수 이름 입력
   - **Value**: Firebase에서 복사한 해당 값 입력
   - **Environments**: `Production`, `Preview`, `Development` 모두 선택
   - **Add** 클릭

### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 환경 변수 추가 (하나씩 실행)
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
vercel env add NEXT_PUBLIC_FIREBASE_DATABASE_URL production
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
```

## 3단계: 재배포

환경 변수 추가 후 자동으로 재배포되지 않으면:

1. Vercel Dashboard → **Deployments** 탭
2. 최신 배포 옆 **⋯** (점 3개) 클릭
3. **Redeploy** 클릭
4. **Redeploy** 버튼 다시 클릭하여 확인

또는:

```bash
# GitHub에 새 커밋 푸시하면 자동 재배포
git commit --allow-empty -m "Trigger redeploy"
git push
```

## 4단계: 확인

1. 배포 완료 대기 (약 2-3분)
2. Vercel 제공 URL로 접속
3. 정상적으로 닉네임 입력 화면이 보이면 성공!

## 문제 해결

### "Firebase 설정 오류" 화면이 계속 보이는 경우

1. **환경 변수 확인**
   - Vercel Dashboard → Settings → Environment Variables
   - 7개 변수가 모두 추가되었는지 확인
   - 변수 이름이 정확한지 확인 (대소문자 구분!)

2. **값 확인**
   - 각 변수의 값이 올바른지 확인
   - 특히 `NEXT_PUBLIC_FIREBASE_DATABASE_URL`이 올바른지 확인
   - 값에 공백이나 따옴표가 포함되지 않았는지 확인

3. **재배포**
   - Deployments → Redeploy 실행

4. **로그 확인**
   - Vercel Dashboard → Deployments → 최신 배포 클릭
   - **Runtime Logs** 탭에서 오류 메시지 확인

### Firebase Realtime Database 오류

Database URL이 잘못된 경우:
1. Firebase Console → Realtime Database
2. Database가 생성되어 있는지 확인
3. Database URL 복사 (예: `https://xxx-default-rtdb.firebaseio.com`)
4. Vercel 환경 변수에서 `NEXT_PUBLIC_FIREBASE_DATABASE_URL` 업데이트

## 추가 도움말

- [Vercel 환경 변수 문서](https://vercel.com/docs/environment-variables)
- [Firebase 설정 문서](https://firebase.google.com/docs/web/setup)

문제가 계속되면 Vercel Runtime Logs를 확인하세요!
