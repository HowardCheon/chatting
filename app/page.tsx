'use client';

import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, set, serverTimestamp, remove, off } from 'firebase/database';
import type { Database } from 'firebase/database';
import NicknameInput from '@/components/NicknameInput';
import Chat from '@/components/Chat';
import ParticipantList from '@/components/ParticipantList';
import LadderGame from '@/components/LadderGame';
import FirebaseError from '@/components/FirebaseError';
import type { Participant } from '@/types';

function ChatApp({ db }: { db: Database }) {
  const [userId, setUserId] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showNicknameInput, setShowNicknameInput] = useState(true);
  const [showLadder, setShowLadder] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 ID 및 닉네임 로드
    const savedUserId = localStorage.getItem('userId');
    const savedNickname = localStorage.getItem('nickname');

    if (savedUserId && savedNickname) {
      setUserId(savedUserId);
      setNickname(savedNickname);
      setShowNicknameInput(false);
      joinChat(savedUserId, savedNickname);
    } else {
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setUserId(newUserId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const participantsRef = ref(db, 'participants');

    onValue(participantsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const now = Date.now();
        const participantsList: Participant[] = Object.entries(data)
          .map(([id, participant]: [string, any]) => ({
            id,
            ...participant,
          }))
          .filter((p: Participant) => now - p.lastSeen < 30000); // 30초 이내 활동

        setParticipants(participantsList);
      } else {
        setParticipants([]);
      }
    });

    return () => {
      off(participantsRef);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || !nickname) return;

    const updatePresence = () => {
      const participantRef = ref(db, `participants/${userId}`);
      set(participantRef, {
        nickname,
        joinedAt: Date.now(),
        lastSeen: serverTimestamp(),
      });
    };

    updatePresence();
    const interval = setInterval(updatePresence, 10000); // 10초마다 업데이트

    const handleBeforeUnload = () => {
      const participantRef = ref(db, `participants/${userId}`);
      remove(participantRef);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      const participantRef = ref(db, `participants/${userId}`);
      remove(participantRef);
    };
  }, [userId, nickname]);

  const joinChat = (uid: string, nick: string) => {
    const participantRef = ref(db, `participants/${uid}`);
    set(participantRef, {
      nickname: nick,
      joinedAt: Date.now(),
      lastSeen: serverTimestamp(),
    });

    const messagesRef = ref(db, 'messages');
    const messageRef = ref(db, `messages/${Date.now()}`);
    set(messageRef, {
      nickname: '시스템',
      text: `${nick}님이 입장하셨습니다.`,
      timestamp: serverTimestamp(),
      type: 'system',
    });
  };

  const handleNicknameSubmit = (nick: string) => {
    setNickname(nick);
    localStorage.setItem('userId', userId);
    localStorage.setItem('nickname', nick);
    setShowNicknameInput(false);
    joinChat(userId, nick);
  };

  const handleNicknameChange = () => {
    const newNick = prompt('새 닉네임을 입력하세요:', nickname);
    if (newNick && newNick.trim() && newNick !== nickname) {
      const trimmedNick = newNick.trim();
      setNickname(trimmedNick);
      localStorage.setItem('nickname', trimmedNick);

      const messagesRef = ref(db, 'messages');
      const messageRef = ref(db, `messages/${Date.now()}`);
      set(messageRef, {
        nickname: '시스템',
        text: `${nickname}님이 ${trimmedNick}(으)로 닉네임을 변경하셨습니다.`,
        timestamp: serverTimestamp(),
        type: 'system',
      });
    }
  };

  if (showNicknameInput) {
    return <NicknameInput onSubmit={handleNicknameSubmit} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">실시간 채팅방</h1>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">
              {nickname}님
            </span>
            <button
              onClick={handleNicknameChange}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              닉네임 변경
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowLadder(false)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !showLadder
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            채팅
          </button>
          <button
            onClick={() => setShowLadder(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showLadder
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            사다리타기
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-200px)]">
              {showLadder ? (
                <div className="h-full overflow-y-auto">
                  <LadderGame userId={userId} nickname={nickname} db={db} />
                </div>
              ) : (
                <Chat nickname={nickname} userId={userId} db={db} />
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <ParticipantList participants={participants} currentUserId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  // Check if Firebase is properly configured
  if (!database) {
    return <FirebaseError />;
  }

  return <ChatApp db={database} />;
}
