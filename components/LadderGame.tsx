'use client';

import { useState, useEffect } from 'react';
import { ref, push, onValue, update, off } from 'firebase/database';
import type { Database } from 'firebase/database';
import type { LadderGame } from '@/types';

interface LadderGameProps {
  userId: string;
  nickname: string;
  db: Database;
}

export default function LadderGame({ userId, nickname, db }: LadderGameProps) {
  const [games, setGames] = useState<LadderGame[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [participantCount, setParticipantCount] = useState(3);
  const [results, setResults] = useState<string[]>(['', '', '']);

  useEffect(() => {
    const gamesRef = ref(db, 'ladderGames');

    onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const gamesList: LadderGame[] = Object.entries(data).map(([id, game]: [string, any]) => ({
          id,
          ...game,
        }));
        gamesList.sort((a, b) => b.createdAt - a.createdAt);
        setGames(gamesList.slice(0, 5)); // 최근 5개만 표시
      } else {
        setGames([]);
      }
    });

    return () => {
      off(gamesRef);
    };
  }, []);

  const generateLadder = (count: number) => {
    const rows = 8;
    const bridges: boolean[][] = Array(rows).fill(null).map(() => Array(count - 1).fill(false));

    // 랜덤하게 다리 생성
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < count - 1; col++) {
        if (Math.random() > 0.5 && !bridges[row][col]) {
          // 이전 열과 겹치지 않도록
          if (col === 0 || !bridges[row][col - 1]) {
            // 다음 열과 겹치지 않도록
            if (col === count - 2 || !bridges[row][col + 1]) {
              bridges[row][col] = true;
            }
          }
        }
      }
    }

    return bridges;
  };

  const calculatePaths = (bridges: boolean[][], count: number) => {
    const paths: number[][] = [];

    for (let start = 0; start < count; start++) {
      const path: number[] = [start];
      let currentPos = start;

      for (let row = 0; row < bridges.length; row++) {
        // 왼쪽 다리 확인
        if (currentPos > 0 && bridges[row][currentPos - 1]) {
          currentPos--;
        }
        // 오른쪽 다리 확인
        else if (currentPos < count - 1 && bridges[row][currentPos]) {
          currentPos++;
        }
        path.push(currentPos);
      }

      paths.push(path);
    }

    return paths;
  };

  const createGame = async () => {
    if (results.some(r => !r.trim())) {
      alert('모든 결과를 입력해주세요!');
      return;
    }

    const bridges = generateLadder(participantCount);
    const paths = calculatePaths(bridges, participantCount);

    const gamesRef = ref(db, 'ladderGames');
    await push(gamesRef, {
      createdBy: userId,
      creatorNickname: nickname,
      participantCount,
      results,
      createdAt: Date.now(),
      selections: {},
      paths,
      bridges,
    });

    setShowCreateForm(false);
    setParticipantCount(3);
    setResults(['', '', '']);
  };

  const selectPosition = async (gameId: string, position: number, game: LadderGame) => {
    const selections = game.selections || {};

    if (selections[position]) {
      alert('이미 선택된 위치입니다!');
      return;
    }

    // 이미 다른 위치를 선택했는지 확인
    const mySelection = Object.entries(selections).find(([_, id]) => id === userId);
    if (mySelection) {
      alert('이미 선택하셨습니다!');
      return;
    }

    const gameRef = ref(db, `ladderGames/${gameId}/selections`);
    await update(gameRef, {
      [position]: userId,
    });
  };

  const handleParticipantCountChange = (count: number) => {
    setParticipantCount(count);
    setResults(Array(count).fill('').map((_, i) => results[i] || ''));
  };

  const getMyResult = (game: LadderGame) => {
    const selections = game.selections || {};
    const myPosition = Object.entries(selections).find(([_, id]) => id === userId)?.[0];
    if (!myPosition) return null;

    const path = game.paths[parseInt(myPosition)];
    const finalPosition = path[path.length - 1];
    return game.results[finalPosition];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">사다리타기</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          {showCreateForm ? '취소' : '게임 만들기'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-3 text-gray-900">새 게임 만들기</h3>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              참여자 수
            </label>
            <select
              value={participantCount}
              onChange={(e) => handleParticipantCountChange(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              {[2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}명</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              결과 입력
            </label>
            {results.map((result, i) => (
              <input
                key={i}
                type="text"
                value={result}
                onChange={(e) => {
                  const newResults = [...results];
                  newResults[i] = e.target.value;
                  setResults(newResults);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-gray-900"
                placeholder={`결과 ${i + 1}`}
                maxLength={20}
              />
            ))}
          </div>
          <button
            onClick={createGame}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            생성하기
          </button>
        </div>
      )}

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {games.map((game) => {
          const selections = game.selections || {};
          const myResult = getMyResult(game);
          const myPosition = Object.entries(selections).find(([_, id]) => id === userId)?.[0];

          return (
            <div key={game.id} className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-3">
                {game.creatorNickname}님의 게임
              </div>

              <div className="flex justify-around mb-2">
                {Array.from({ length: game.participantCount }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => selectPosition(game.id, i, game)}
                    disabled={!!selections[i] || !!myPosition}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selections[i]
                        ? selections[i] === userId
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : myPosition
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {selections[i] === userId ? '선택함' : selections[i] ? '선택됨' : `선택 ${i + 1}`}
                  </button>
                ))}
              </div>

              <LadderDisplay
                bridges={game.bridges}
                participantCount={game.participantCount}
                results={game.results}
                myPosition={myPosition ? parseInt(myPosition) : null}
                paths={game.paths}
              />

              {myResult && (
                <div className="mt-3 p-3 bg-yellow-100 rounded-lg text-center">
                  <span className="font-bold text-gray-900">내 결과: {myResult}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface LadderDisplayProps {
  bridges: boolean[][];
  participantCount: number;
  results: string[];
  myPosition: number | null;
  paths: number[][];
}

function LadderDisplay({ bridges, participantCount, results, myPosition, paths }: LadderDisplayProps) {
  const rows = bridges.length;
  const width = participantCount * 80;
  const height = rows * 40 + 80;

  return (
    <svg width={width} height={height} className="mx-auto">
      {/* 세로 선 */}
      {Array.from({ length: participantCount }, (_, i) => (
        <line
          key={`vertical-${i}`}
          x1={40 + i * 80}
          y1={20}
          x2={40 + i * 80}
          y2={height - 40}
          stroke={myPosition === i ? '#3b82f6' : '#666'}
          strokeWidth={myPosition === i ? 3 : 2}
        />
      ))}

      {/* 다리 (가로 선) */}
      {bridges.map((row, rowIdx) =>
        row.map((hasBridge, colIdx) =>
          hasBridge ? (
            <line
              key={`bridge-${rowIdx}-${colIdx}`}
              x1={40 + colIdx * 80}
              y1={20 + (rowIdx + 0.5) * 40}
              x2={40 + (colIdx + 1) * 80}
              y2={20 + (rowIdx + 0.5) * 40}
              stroke="#666"
              strokeWidth={2}
            />
          ) : null
        )
      )}

      {/* 결과 */}
      {results.map((result, i) => {
        const isMyResult = myPosition !== null && paths[myPosition][paths[myPosition].length - 1] === i;
        return (
          <text
            key={`result-${i}`}
            x={40 + i * 80}
            y={height - 15}
            textAnchor="middle"
            className={`text-sm ${isMyResult ? 'font-bold fill-blue-600' : 'fill-gray-700'}`}
          >
            {result}
          </text>
        );
      })}

      {/* 경로 표시 (내가 선택한 경우) */}
      {myPosition !== null && (
        <polyline
          points={paths[myPosition].map((pos, idx) => `${40 + pos * 80},${20 + idx * 40}`).join(' ')}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={3}
          strokeOpacity={0.3}
          className="ladder-path"
        />
      )}
    </svg>
  );
}
