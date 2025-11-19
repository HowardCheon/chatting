'use client';

export default function FirebaseError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Firebase 설정 오류
          </h1>
          <p className="text-gray-600">
            Firebase 환경 변수가 설정되지 않았습니다.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-3 text-gray-900">
            Vercel 환경 변수 설정 방법:
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Vercel Dashboard
              </a>
              에 접속
            </li>
            <li>프로젝트 선택</li>
            <li>Settings → Environment Variables 클릭</li>
            <li>다음 환경 변수들을 추가:</li>
          </ol>

          <div className="mt-4 bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
            <div>NEXT_PUBLIC_FIREBASE_API_KEY</div>
            <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</div>
            <div>NEXT_PUBLIC_FIREBASE_DATABASE_URL</div>
            <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID</div>
            <div>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</div>
            <div>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</div>
            <div>NEXT_PUBLIC_FIREBASE_APP_ID</div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="font-bold text-lg mb-3 text-gray-900">
            Firebase 구성 정보 확인:
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Firebase Console
              </a>
              에 접속
            </li>
            <li>프로젝트 선택</li>
            <li>프로젝트 설정 (톱니바퀴 아이콘)</li>
            <li>일반 탭 → 내 앱 → 웹 앱 선택</li>
            <li>SDK 설정 및 구성에서 값 복사</li>
          </ol>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            설정 후 Vercel에서 자동으로 재배포됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
