export interface IAddDeliveryUser {
  name: string;
  email: string;
  phoneCountry: string;
  phone: string;
  dob: string;
  vehicleNumber: string;
  warehouse: string;
  lipaCountryCode: string;
  lipaNumber:string;
  imageReader: any;
  qrImageReader: any;
  drivingLicenseReader: any;
  vehicleDocumentReader: any;
  vehicleInsuranceReader: any;
  drivingLicenseExpiryDate?: string;
  vehicleDocumentExpiryDate?: string;
  vehicleInsuranceExpiryDate?: string;
  address: string;
  lat: string;
  lng: string;
}
export interface IListDriver {
  limit?: number;
  sortKey?: string;
  sortOrder?: number;
  pageNo?: number;
  searchTerm?: string;
  date?: any;
}
export interface IUpdateDriverState {
  active: boolean;
}
