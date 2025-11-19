import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '실시간 채팅방',
  description: '실시간 채팅과 사다리타기 게임을 즐길 수 있는 채팅방입니다.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
