import { VehicleData } from '@/types';

export const searchVehiclesByTerm = (vehicleData: VehicleData[], searchTerm: string): VehicleData[] => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const term = searchTerm.toLowerCase().trim();
  
  return vehicleData.filter(vehicle => {
    // 4-5자리 숫자인 경우: 차량번호 뒤 4자리와 사고번호 뒤 4-5자리 모두 검색
    if (/^\d{4,5}$/.test(term)) {
      // 차량번호 뒤 4자리 검색
      if (term.length === 4 && vehicle.lastFourDigits === term) {
        return true;
      }
      
      // 사고번호에서 4-5자리 부분 검색 - 더 정확한 매칭
      const accidentNumber = vehicle.accidentNumber.toLowerCase();
      
      // 사고번호 끝 4-5자리 검색
      if (term.length === 4) {
        // 4자리: 사고번호 끝 4자리 또는 포함된 4자리 검색
        if (accidentNumber.slice(-4) === term || accidentNumber.includes(term)) {
          return true;
        }
      } else if (term.length === 5) {
        // 5자리: 사고번호 끝 5자리 또는 포함된 5자리 검색
        if (accidentNumber.slice(-5) === term || accidentNumber.includes(term)) {
          return true;
        }
      }
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