'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { VehicleData } from '@/types';
import { parseCSVData, parseExcelData, parseXLSXData } from '@/utils/csvParser';

interface DataUploadProps {
  onDataLoad: (data: VehicleData[]) => void;
}

export default function DataUpload({ onDataLoad }: DataUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError('');

    try {
      let data: VehicleData[] = [];

      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        data = parseCSVData(text);
      } else if (file.name.endsWith('.txt') || file.type === 'text/plain') {
        const text = await file.text();
        data = parseExcelData(text);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        data = await parseXLSXData(file);
      } else {
        throw new Error('지원하지 않는 파일 형식입니다. CSV, TXT, XLSX 파일을 업로드해주세요.');
      }

      if (data.length === 0) {
        throw new Error('데이터를 찾을 수 없습니다. 파일 형식을 확인해주세요.');
      }

      onDataLoad(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextPaste = () => {
    const textData = textAreaRef.current?.value;
    if (!textData) {
      setError('데이터를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = parseExcelData(textData);
      
      if (data.length === 0) {
        throw new Error('데이터를 찾을 수 없습니다. 형식을 확인해주세요.');
      }

      onDataLoad(data);
      if (textAreaRef.current) {
        textAreaRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">데이터 업로드</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* 파일 업로드 영역 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">파일 업로드</h3>
          
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt,.xlsx,.xls"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
            />
            
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-600">
                  파일을 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  CSV, TXT, XLSX 파일 지원
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 텍스트 붙여넣기 영역 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">데이터 붙여넣기</h3>
          <p className="text-sm text-gray-600">
            엑셀에서 데이터를 복사하여 아래에 붙여넣으세요.
          </p>
          
          <textarea
            ref={textAreaRef}
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="엑셀 데이터를 여기에 붙여넣으세요..."
            disabled={isLoading}
          />
          
          <button
            onClick={handleTextPaste}
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {isLoading ? '처리 중...' : '데이터 불러오기'}
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">사용 방법:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. 엑셀 파일에서 데이터를 선택하고 Ctrl+C로 복사</li>
          <li>2. 우측 텍스트 영역에 Ctrl+V로 붙여넣기</li>
          <li>3. "데이터 불러오기" 버튼 클릭</li>
          <li>4. 또는 CSV/TXT/XLSX 파일을 직접 업로드</li>
        </ul>
      </div>
    </div>
  );
}