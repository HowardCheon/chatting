'use client';

import { Participant } from '@/types';

interface ParticipantListProps {
  participants: Participant[];
  currentUserId: string;
}

export default function ParticipantList({ participants, currentUserId }: ParticipantListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full">
      <h2 className="text-lg font-bold mb-4 text-gray-800">
        참여자 ({participants.length})
      </h2>
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className={`flex items-center gap-2 p-2 rounded ${
              participant.id === currentUserId ? 'bg-blue-100' : 'bg-gray-50'
            }`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-900">
              {participant.nickname}
              {participant.id === currentUserId && ' (나)'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
