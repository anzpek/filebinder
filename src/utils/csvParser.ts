import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { VehicleData } from '@/types';

export const parseCSVData = (csvContent: string): VehicleData[] => {
  try {
    const result = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true
    });

    return result.data.map((row: any, index: number) => {
      const vehicleNumber = row['피해물'] || row['차량번호'] || row['carNumber'] || '';
      const lastFourDigits = vehicleNumber.slice(-4);
      
      return {
        no: index + 1,
        accidentNumber: row['사고번호'] || row['accidentNumber'] || '',
        series: row['서열'] || row['series'] || '',
        vehicleNumber: vehicleNumber,
        status: row['상태'] || row['status'] || '',
        closureDate: row['종결일자'] || row['closureDate'] || '',
        managementNumber: row['관리번호'] || row['managementNumber'] || '',
        department: row['부서'] || row['department'] || '',
        manager: row['담당자'] || row['manager'] || '',
        lastFourDigits: lastFourDigits
      };
    });
  } catch (error) {
    console.error('CSV 파싱 에러:', error);
    return [];
  }
};

export const parseExcelData = (excelContent: string): VehicleData[] => {
  // 엑셀 데이터를 탭 구분자로 파싱 (엑셀에서 복사할 때 탭으로 구분됨)
  const lines = excelContent.trim().split('\n');
  const headers = lines[0].split('\t');
  
  const data: VehicleData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t');
    if (values.length < 4) continue; // 최소 4개 컬럼 필요
    
    const vehicleNumber = values[3] || ''; // D열: 피해물(차량번호)
    const lastFourDigits = vehicleNumber.slice(-4);
    
    data.push({
      no: parseInt(values[0]) || i,
      accidentNumber: values[1] || '',
      series: values[2] || '',
      vehicleNumber: vehicleNumber,
      status: values[4] || '',
      closureDate: values[5] || '',
      managementNumber: values[6] || '', // G열: 관리번호
      department: values[8] || '', // I열
      manager: values[9] || '', // J열
      lastFourDigits: lastFourDigits
    });
  }
  
  return data;
};

export const parseXLSXData = (file: File): Promise<VehicleData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 첫 번째 시트 사용
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // JSON으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // 첫 번째 행을 헤더로 사용
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];
        
        const parsedData: VehicleData[] = [];
        
        rows.forEach((row, index) => {
          if (row.length < 4) return; // 최소 4개 컬럼은 있어야 함
          
          const vehicleNumber = (row[3] || '').toString(); // D열: 피해물(차량번호)
          const lastFourDigits = vehicleNumber.slice(-4);
          
          parsedData.push({
            no: parseInt(row[0]) || index + 1,
            accidentNumber: (row[1] || '').toString(),
            series: (row[2] || '').toString(),
            vehicleNumber: vehicleNumber,
            status: (row[4] || '').toString(),
            closureDate: (row[5] || '').toString(),
            managementNumber: (row[6] || '').toString(), // G열: 관리번호
            department: (row[8] || '').toString(), // I열
            manager: (row[9] || '').toString(), // J열
            lastFourDigits: lastFourDigits
          });
        });
        
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsArrayBuffer(file);
  });
};