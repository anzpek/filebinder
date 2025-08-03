import { VehicleData } from '@/types';

export const searchVehiclesByTerm = (vehicleData: VehicleData[], searchTerm: string): VehicleData[] => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const term = searchTerm.toLowerCase().trim();
  
  return vehicleData.filter(vehicle => {
    // 차량번호 뒤 4자리 검색 (기존 기능)
    if (term.length === 4 && /^\d{4}$/.test(term)) {
      return vehicle.lastFourDigits === term;
    }
    
    // 피해물(차량번호) 부분 일치 검색
    const vehicleNumber = vehicle.vehicleNumber.toLowerCase();
    if (vehicleNumber.includes(term)) {
      return true;
    }
    
    // 사고번호에서 부분 일치 검색
    const accidentNumber = vehicle.accidentNumber.toLowerCase();
    if (accidentNumber.includes(term)) {
      return true;
    }
    
    // 담당자에서 부분 일치 검색
    const manager = vehicle.manager.toLowerCase();
    if (manager.includes(term)) {
      return true;
    }
    
    return false;
  });
};

export const getSearchPlaceholder = (searchTerm: string): string => {
  if (!searchTerm) {
    return "차량번호, 사고번호, 피해물 입력 (예: 9030, 2024-001, 자전거)";
  }
  
  if (searchTerm.length === 4 && /^\d{4}$/.test(searchTerm)) {
    return "차량번호 뒤 4자리로 검색 중...";
  }
  
  if (searchTerm.includes('-') || /^\d{4}/.test(searchTerm)) {
    return "사고번호로 검색 중...";
  }
  
  return "피해물로 검색 중...";
};