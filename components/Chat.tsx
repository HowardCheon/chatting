'use client';

import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, serverTimestamp, off } from 'firebase/database';
import type { Database } from 'firebase/database';
import type { Message } from '@/types';

interface ChatProps {
  nickname: string;
  userId: string;
  db: Database;
}

export default function Chat({ nickname, userId, db }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesRef = ref(db, 'messages');

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList: Message[] = Object.entries(data).map(([id, msg]: [string, any]) => ({
          id,
          ...msg,
        }));
        messagesList.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messagesList);
      }
    });

    return () => {
      off(messagesRef);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messagesRef = ref(db, 'messages');
    await push(messagesRef, {
      nickname,
      text: newMessage,
      timestamp: serverTimestamp(),
      type: 'chat',
    });

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${
              message.type === 'system'
                ? 'text-center text-gray-500 text-sm'
                : ''
            }`}
          >
            {message.type === 'chat' ? (
              <div className="flex flex-col">
                <span className="text-xs text-gray-600 mb-1">
                  {message.nickname}
                </span>
                <div className="bg-white rounded-lg p-3 shadow max-w-md">
                  <p className="text-gray-900 break-words">{message.text}</p>
                </div>
              </div>
            ) : (
              <p>{message.text}</p>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
            placeholder="메시지를 입력하세요..."
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            disabled={!newMessage.trim()}
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
}
