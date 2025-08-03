'use client';

import { useRef } from 'react';
import { Printer, Download, FileImage } from 'lucide-react';
import TablePrintLayout from './TablePrintLayout';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExcelRow {
  id: string;
  searchTerm: string;
  selectedVehicle?: {
    accidentNumber: string;
    series: string;
    vehicleNumber: string;
    status: string;
  };
}

interface TablePrintButtonProps {
  rows: ExcelRow[];
  disabled?: boolean;
  managerName?: string;
  maxRowsPerPage?: number;
}

export default function TablePrintButton({ rows, disabled = false, managerName, maxRowsPerPage = 40 }: TablePrintButtonProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const completedRows = rows.filter(row => row.selectedVehicle);
  const canPrint = completedRows.length > 0;

  const handlePrint = () => {
    if (!canPrint || !printRef.current) return;
    
    // 임시로 화면에 출력 레이아웃을 보이게 함
    const printElement = printRef.current;
    const originalDisplay = printElement.style.display;
    printElement.style.display = 'block';
    printElement.style.position = 'fixed';
    printElement.style.top = '0';
    printElement.style.left = '0';
    printElement.style.zIndex = '9999';
    printElement.style.background = 'white';
    
    // 새 창에서 인쇄 컨텐츠 열기
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      printElement.style.display = originalDisplay;
      return;
    }
    
    const printContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>입고묶기 출력</title>
          <meta charset="UTF-8">
          <style>
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
              font-family: 'Malgun Gothic', Arial, sans-serif !important;
            }
            body { 
              font-family: 'Malgun Gothic', Arial, sans-serif; 
              background: white;
              padding: 20px;
              color: black;
            }
            .printable {
              width: 100%;
              height: auto;
              position: relative;
              background: white;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              border: 2px solid black;
              font-family: 'Malgun Gothic', Arial, sans-serif;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: center;
              font-family: 'Malgun Gothic', Arial, sans-serif;
              font-size: 14px;
            }
            th {
              background-color: #dbeafe !important;
              font-weight: bold;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            input {
              border: none !important;
              border-bottom: 2px solid black !important;
              background: transparent !important;
              font-family: 'Malgun Gothic', Arial, sans-serif;
              font-weight: bold;
              font-size: 18px;
              text-align: center;
            }
            @page { 
              margin: 1cm; 
              size: A4; 
            }
            @media print {
              body { margin: 0; padding: 20px; }
              * { color: black !important; }
              th { background-color: #dbeafe !important; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      // 원래 상태로 복원
      printElement.style.display = originalDisplay;
      printElement.style.position = '';
      printElement.style.top = '';
      printElement.style.left = '';
      printElement.style.zIndex = '';
      printElement.style.background = '';
    }, 500);
  };


  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={handlePrint}
        disabled={disabled || !canPrint}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Printer className="h-4 w-4" />
        인쇄하기
      </button>

      <div className="text-sm text-gray-600 flex items-center">
        💡 인쇄 시 "PDF로 저장" 옵션을 선택하면 PDF로 저장할 수 있습니다.
      </div>

      {/* 숨겨진 출력용 레이아웃 */}
      <div style={{ display: 'none' }}>
        <TablePrintLayout
          ref={printRef}
          rows={rows}
          generatedAt={new Date().toISOString()}
          managerName={managerName}
          maxRowsPerPage={maxRowsPerPage}
        />
      </div>

      {!canPrint && (
        <p className="text-sm text-gray-500 mt-2">
          피해물을 선택한 후 출력할 수 있습니다.
        </p>
      )}
    </div>
  );
}