'use client';

import { forwardRef, useState, useEffect } from 'react';

interface ExcelRow {
  id: string;
  searchTerm: string;
  selectedVehicle?: {
    accidentNumber: string;
    series: string;
    vehicleNumber: string;
    status: string;
    managementNumber?: string;
  };
}

interface TablePrintLayoutProps {
  rows: ExcelRow[];
  generatedAt: string;
  managerName?: string;
  maxRowsPerPage?: number;
}

const TablePrintLayout = forwardRef<HTMLDivElement, TablePrintLayoutProps>(
  ({ rows, generatedAt, managerName: propManagerName, maxRowsPerPage = 40 }, ref) => {
    const [managerName, setManagerName] = useState(propManagerName || '홍길동');
    const [licenseNumber, setLicenseNumber] = useState('');

    // props가 변경될 때 상태 업데이트
    useEffect(() => {
      if (propManagerName) {
        setManagerName(propManagerName);
      }
    }, [propManagerName]);

    const completedRows = rows.filter(row => row.selectedVehicle);
    
    // 사용자 설정에 따라 페이지 분할
    const currentPageRows = completedRows.slice(0, maxRowsPerPage);
    const remainingRows = completedRows.slice(maxRowsPerPage);
    
    // 동적 셀 높이 계산 - 30개 이상일 때 자동 조절
    const actualRowCount = Math.max(currentPageRows.length, 30); // 최소 30개 기준
    const availableHeight = 240; // mm (페이지 가득 채우기)
    const cellHeight = Math.max(3, availableHeight / actualRowCount); // 최소 3mm
    
    // 테이블이 페이지를 가득 채우도록 빈 행 추가
    const emptyRowsNeeded = Math.max(0, actualRowCount - currentPageRows.length);

    return (
      <div ref={ref} className="printable bg-white" style={{ 
        padding: '20px',
        width: '100%',
        minHeight: '297mm',
        fontFamily: "'Malgun Gothic', sans-serif",
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 엑셀 스타일 테이블 */}
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          border: '2px solid black',
          fontSize: '11px',
          fontFamily: "'Malgun Gothic', sans-serif",
          marginBottom: '20px'
        }}>
          {/* 헤더 */}
          <thead>
            <tr style={{ backgroundColor: '#dbeafe' }}>
              <th style={{ 
                border: '1px solid black', 
                padding: '4px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                height: `${cellHeight}mm`,
                fontSize: '12px'
              }}>
                사고번호
              </th>
              <th style={{ 
                border: '1px solid black', 
                padding: '4px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                height: `${cellHeight}mm`,
                fontSize: '12px'
              }}>
                서열
              </th>
              <th style={{ 
                border: '1px solid black', 
                padding: '4px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                height: `${cellHeight}mm`,
                fontSize: '12px'
              }}>
                관리번호
              </th>
              <th style={{ 
                border: '1px solid black', 
                padding: '4px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                height: `${cellHeight}mm`,
                fontSize: '12px'
              }}>
                피해자(물)
              </th>
              <th style={{ 
                border: '1px solid black', 
                padding: '4px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                height: `${cellHeight}mm`,
                fontSize: '12px'
              }}>
                상태
              </th>
            </tr>
          </thead>

          {/* 데이터 행들 */}
          <tbody>
            {currentPageRows.map((row, index) => {
              const vehicle = row.selectedVehicle!;
              return (
                <tr key={row.id}>
                  <td style={{ 
                    border: '1px solid black', 
                    padding: '2px 4px', 
                    textAlign: 'center',
                    height: `${cellHeight}mm`,
                    fontSize: '11px'
                  }}>
                    {vehicle.accidentNumber}
                  </td>
                  <td style={{ 
                    border: '1px solid black', 
                    padding: '2px 4px', 
                    textAlign: 'center',
                    height: `${cellHeight}mm`,
                    fontSize: '11px'
                  }}>
                    {vehicle.series}
                  </td>
                  <td style={{ 
                    border: '1px solid black', 
                    padding: '2px 4px', 
                    textAlign: 'center',
                    height: `${cellHeight}mm`,
                    fontSize: '11px'
                  }}>
                    {vehicle.managementNumber || ''}
                  </td>
                  <td style={{ 
                    border: '1px solid black', 
                    padding: '2px 4px', 
                    textAlign: 'center',
                    height: `${cellHeight}mm`,
                    fontSize: '11px'
                  }}>
                    {vehicle.vehicleNumber}
                  </td>
                  <td style={{ 
                    border: '1px solid black', 
                    padding: '2px 4px', 
                    textAlign: 'center',
                    height: `${cellHeight}mm`,
                    fontSize: '11px'
                  }}>
                    {vehicle.status}
                  </td>
                </tr>
              );
            })}

            {/* 빈 행 없음 - 실제 데이터만 표시 */}
          </tbody>
        </table>

        {/* 하단 담당자 및 권번호 - 페이지 최하단에 고정 */}
        <div 
          className="manager-section"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '120px',
            fontSize: '16px',
            fontFamily: "'Malgun Gothic', sans-serif",
            pageBreakInside: 'avoid'
          }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'normal' }}>담당자</span>
            <span style={{ fontSize: '16px', fontWeight: 'normal' }}>:</span>
            <span style={{ 
              fontSize: '16px',
              fontWeight: 'bold',
              marginLeft: '10px'
            }}>
              {managerName}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'normal' }}>권번호</span>
            <span style={{ fontSize: '16px', fontWeight: 'normal' }}>:</span>
            <span style={{ 
              fontSize: '16px',
              fontWeight: 'bold',
              marginLeft: '10px'
            }}>
              {licenseNumber}
            </span>
          </div>
        </div>

        {/* 추가 페이지들 - 40개 이상일 때 */}
        {remainingRows.length > 0 && (
          <div style={{ pageBreakBefore: 'always', padding: '20px' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              border: '2px solid black',
              fontSize: '11px',
              fontFamily: "'Malgun Gothic', sans-serif",
              marginBottom: '20px'
            }}>
              {/* 헤더 반복 */}
              <thead>
                <tr style={{ backgroundColor: '#dbeafe' }}>
                  <th style={{ 
                    border: '1px solid black', 
                    padding: '4px', 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    height: `${cellHeight}mm`,
                    fontSize: '12px'
                  }}>사고번호</th>
                  <th style={{ 
                    border: '1px solid black', 
                    padding: '4px', 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    height: `${cellHeight}mm`,
                    fontSize: '12px'
                  }}>서열</th>
                  <th style={{ 
                    border: '1px solid black', 
                    padding: '4px', 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    height: `${cellHeight}mm`,
                    fontSize: '12px'
                  }}>관리번호</th>
                  <th style={{ 
                    border: '1px solid black', 
                    padding: '4px', 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    height: `${cellHeight}mm`,
                    fontSize: '12px'
                  }}>피해자(물)</th>
                  <th style={{ 
                    border: '1px solid black', 
                    padding: '4px', 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    height: `${cellHeight}mm`,
                    fontSize: '12px'
                  }}>상태</th>
                </tr>
              </thead>
              <tbody>
                {remainingRows.slice(0, maxRowsPerPage).map((row, index) => {
                  const vehicle = row.selectedVehicle!;
                  return (
                    <tr key={`page2-${row.id}`}>
                      <td style={{ 
                        border: '1px solid black', 
                        padding: '2px 4px', 
                        textAlign: 'center',
                        height: `${cellHeight}mm`,
                        fontSize: '11px'
                      }}>{vehicle.accidentNumber}</td>
                      <td style={{ 
                        border: '1px solid black', 
                        padding: '2px 4px', 
                        textAlign: 'center',
                        height: `${cellHeight}mm`,
                        fontSize: '11px'
                      }}>{vehicle.series}</td>
                      <td style={{ 
                        border: '1px solid black', 
                        padding: '2px 4px', 
                        textAlign: 'center',
                        height: `${cellHeight}mm`,
                        fontSize: '11px'
                      }}>{vehicle.managementNumber || ''}</td>
                      <td style={{ 
                        border: '1px solid black', 
                        padding: '2px 4px', 
                        textAlign: 'center',
                        height: `${cellHeight}mm`,
                        fontSize: '11px'
                      }}>{vehicle.vehicleNumber}</td>
                      <td style={{ 
                        border: '1px solid black', 
                        padding: '2px 4px', 
                        textAlign: 'center',
                        height: `${cellHeight}mm`,
                        fontSize: '11px'
                      }}>{vehicle.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* 2페이지 담당자/권번호 */}
            <div style={{
              marginTop: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '120px',
              fontSize: '16px',
              fontFamily: "'Malgun Gothic', sans-serif"
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'normal' }}>담당자</span>
                <span style={{ fontSize: '16px', fontWeight: 'normal' }}>:</span>
                <span style={{ 
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginLeft: '10px'
                }}>{managerName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'normal' }}>권번호</span>
                <span style={{ fontSize: '16px', fontWeight: 'normal' }}>:</span>
                <span style={{ 
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginLeft: '10px'
                }}>{licenseNumber}</span>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @media print {
            * {
              visibility: hidden;
            }
            
            .printable, .printable * {
              visibility: visible;
            }
            
            .printable {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: 100% !important;
              margin: 0 !important;
              padding: 20px !important;
              background: white !important;
              font-family: 'Malgun Gothic', sans-serif !important;
            }
            
            /* 페이지 나누기 방지 */
            .printable {
              break-inside: avoid;
            }
            
            /* 테이블과 담당자 영역을 함께 유지 */
            table {
              page-break-after: avoid;
            }
            
            table + div {
              page-break-before: avoid;
            }
            
            /* 인쇄 시 색상 보존 */
            th {
              background-color: #dbeafe !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            /* 테이블 경계선 강화 */
            table, th, td {
              border-color: black !important;
              border-style: solid !important;
            }
            
            table {
              border-width: 2px !important;
            }
            
            th, td {
              border-width: 1px !important;
            }
            
            /* 입력 필드 스타일 */
            input {
              border: none !important;
              border-bottom: 2px solid black !important;
              background: transparent !important;
            }
            
            /* 인쇄 시 페이지 설정 */
            @page {
              margin: 1cm 1cm 3cm 1cm; /* 하단 여백을 늘려서 담당자 공간 확보 */
              size: A4;
            }
            
            /* 담당자/권번호를 모든 페이지 하단에 출력 */
            @media print {
              .manager-section {
                position: fixed !important;
                bottom: 10mm !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                width: 100% !important;
                text-align: center !important;
                z-index: 9999 !important;
                background: white !important;
              }
              
              /* 테이블을 페이지 가득 채우기 */
              table {
                height: auto !important;
              }
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: 'Malgun Gothic', sans-serif !important;
            }
          }
        `}</style>
      </div>
    );
  }
);

TablePrintLayout.displayName = 'TablePrintLayout';

export default TablePrintLayout;