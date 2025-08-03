'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-6">
            시스템에 문제가 발생했습니다. 다시 시도해주세요.
          </p>
          <button
            onClick={reset}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
}