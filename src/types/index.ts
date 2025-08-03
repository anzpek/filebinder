export interface VehicleData {
  no: number;
  accidentNumber: string;
  series: string;
  vehicleNumber: string; // 피해물(차량번호)
  status: string;
  closureDate: string;
  managementNumber: string; // 관리번호
  department: string;
  manager: string;
  lastFourDigits: string;
}

export interface ProcessedEntry {
  id: string;
  lastFourDigits: string;
  selectedVehicle?: VehicleData;
  availableVehicles: VehicleData[];
}

export interface PrintData {
  entries: ProcessedEntry[];
  generatedAt: string;
}