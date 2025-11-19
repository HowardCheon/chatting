export interface Message {
  id: string;
  nickname: string;
  text: string;
  timestamp: number;
  type: 'chat' | 'system';
}

export interface Participant {
  id: string;
  nickname: string;
  joinedAt: number;
  lastSeen: number;
}

export interface LadderGame {
  id: string;
  createdBy: string;
  creatorNickname: string;
  participantCount: number;
  results: string[];
  createdAt: number;
  selections?: { [key: number]: string }; // position -> userId (optional for backward compatibility)
  paths: number[][]; // 각 시작점에서 도착 지점까지의 경로
  bridges: boolean[][]; // 다리 연결 정보
}
