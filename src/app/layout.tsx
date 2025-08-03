import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '입고묶기 웹 시스템',
  description: '차량 입고 데이터 처리 및 출력 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}