'use client';

import { useState } from 'react';
import { Car } from 'lucide-react';
import { VehicleData } from '@/types';

import DataUpload from '@/components/DataUpload';
import ExcelStyleInput from '@/components/ExcelStyleInput';
import TablePrintButton from '@/components/TablePrintButton';
import TablePrintLayout from '@/components/TablePrintLayout';

interface ExcelRow {
  id: string;
  searchTerm: string;
  selectedVehicle?: VehicleData;
  availableVehicles: VehicleData[];
  dropdownVisible: boolean;
  selectedIndex: number;
}

export default function HomePage() {
  const [vehicleData, setVehicleData] = useState<VehicleData[]>([]);
  const [excelRows, setExcelRows] = useState<ExcelRow[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'entry' | 'print'>('upload');
  const [managerName, setManagerName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('managerName') || '홍길동';
    }
    return '홍길동';
  });
  const [maxRowsPerPage, setMaxRowsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('maxRowsPerPage') || '40');
    }
    return 40;
  });

  // 담당자명이 변경될 때 localStorage에 저장
  const handleManagerNameChange = (newName: string) => {
    setManagerName(newName);
    if (typeof window !== 'undefined') {
      localStorage.setItem('managerName', newName);
    }
  };

  // 페이지 최대 출력 갯수 변경
  const handleMaxRowsChange = (newMaxRows: number) => {
    setMaxRowsPerPage(newMaxRows);
    if (typeof window !== 'undefined') {
      localStorage.setItem('maxRowsPerPage', newMaxRows.toString());
    }
  };

  const handleDataLoad = (data: VehicleData[]) => {
    setVehicleData(data);
    setExcelRows([]);
    setCurrentStep('entry');
  };

  const handleRowsChange = (newRows: ExcelRow[]) => {
    setExcelRows(newRows);
    
    // 선택된 차량이 있고 현재 entry 단계일 때만 출력 단계로 이동
    const hasSelected = newRows.some(row => row.selectedVehicle);
    if (hasSelected && currentStep === 'entry') {
      setCurrentStep('print');
    }
  };

  const resetData = () => {
    setVehicleData([]);
    setExcelRows([]);
    setCurrentStep('upload');
  };


  const selectedCount = excelRows.filter(row => row.selectedVehicle).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  입고묶기 웹 시스템
                </h1>
                <p className="text-gray-600">차량 입고 데이터 처리 및 출력</p>
              </div>
            </div>
            
            {vehicleData.length > 0 && (
              <button
                onClick={resetData}
                className="btn-secondary"
              >
                새로 시작
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 진행 단계 표시 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-8">
            <div className={`flex items-center gap-2 ${
              currentStep === 'upload' ? 'text-primary-600' : 
              vehicleData.length > 0 ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'upload' ? 'bg-primary-600 text-white' :
                vehicleData.length > 0 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <span className="font-medium">데이터 업로드</span>
            </div>

            <div className={`w-16 h-1 ${
              vehicleData.length > 0 ? 'bg-green-600' : 'bg-gray-300'
            }`}></div>

            <div className={`flex items-center gap-2 ${
              currentStep === 'entry' ? 'text-primary-600' :
              excelRows.some(r => r.selectedVehicle) ? 'text-green-600' :
              vehicleData.length > 0 ? 'text-gray-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'entry' ? 'bg-primary-600 text-white' :
                excelRows.some(r => r.selectedVehicle) ? 'bg-green-600 text-white' :
                vehicleData.length > 0 ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="font-medium">피해물 정보 입력</span>
            </div>

            <div className={`w-16 h-1 ${
              excelRows.some(r => r.selectedVehicle) ? 'bg-green-600' : 'bg-gray-300'
            }`}></div>

            <div className={`flex items-center gap-2 ${
              currentStep === 'print' && selectedCount > 0 ? 'text-primary-600' :
              selectedCount > 0 ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'print' && selectedCount > 0 ? 'bg-primary-600 text-white' :
                selectedCount > 0 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="font-medium">출력</span>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="space-y-8">
          {/* 데이터 업로드 단계 */}
          {currentStep === 'upload' && (
            <DataUpload onDataLoad={handleDataLoad} />
          )}

          {/* 데이터 입력 단계 */}
          {(currentStep === 'entry' || currentStep === 'print') && vehicleData.length > 0 && (
            <ExcelStyleInput
              vehicleData={vehicleData}
              onRowsChange={handleRowsChange}
            />
          )}

          {/* 출력 단계 */}
          {currentStep === 'print' && selectedCount > 0 && (
            <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">출력 및 다운로드</h2>
                  <p className="text-gray-600 mt-1">
                    {selectedCount}개의 피해물 정보가 선택되었습니다.
                  </p>
                  <p className="text-sm text-orange-600 mt-1 font-semibold">
                    ⚠️ 한 페이지에 최대 {maxRowsPerPage}개까지 출력 가능합니다. {maxRowsPerPage}개 이상 시 자동으로 다음 페이지로 분할됩니다.
                  </p>
                </div>
              </div>

              {/* 설정 영역 */}
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 담당자명 입력 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      담당자 이름 변경
                    </label>
                    <input
                      type="text"
                      value={managerName}
                      onChange={(e) => handleManagerNameChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="담당자 이름을 입력하세요"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      출력물에 표시될 담당자명을 변경할 수 있습니다.
                    </p>
                  </div>
                  
                  {/* 페이지 최대 출력 갯수 설정 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      1페이지 최대 출력 갯수
                    </label>
                    <select
                      value={maxRowsPerPage}
                      onChange={(e) => handleMaxRowsChange(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {Array.from({ length: 11 }, (_, i) => i + 30).map(num => (
                        <option key={num} value={num}>{num}개</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      한 페이지에 출력할 최대 행 수를 설정합니다. (30~40개)
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <TablePrintButton rows={excelRows} managerName={managerName} maxRowsPerPage={maxRowsPerPage} />
              </div>
            </div>
          )}
        </div>

        {/* 상태 표시 */}
        {vehicleData.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="space-x-6">
                <span className="text-blue-700">
                  📊 총 {vehicleData.length}개 피해물 데이터 로드됨
                </span>
                {excelRows.length > 0 && (
                  <span className="text-blue-700">
                    📝 {excelRows.length}개 항목 중 {selectedCount}개 선택됨
                  </span>
                )}
              </div>
              {selectedCount > 0 && (
                <span className="text-blue-700 font-medium">
                  ✅ 출력 준비 완료
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}