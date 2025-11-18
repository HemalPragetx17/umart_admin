export interface IListInventoryProduct {
  limit: number;
  pageNo: number;
  sortKey: string;
  sortOrder: number;
  needCount?: boolean;
  state: string;
  expiry?: string;
  categories?: any;
  viewRemovedOnly?: boolean;
  searchTerm?: string;
  forecastedDays?:number;
  zoneRef?:any;
  binRef?:any;
}
export interface IInventoryStats {
  business?: string;
}
export interface IListInventoryTransaction {
  limit: number;
  pageNo: number;
  sortKey: string;
  sortOrder: number;
  needCount?: boolean;
  fromDate?: string;
  toDate?: string;
  sourceTypes?: any;
}
export interface IVariantExpiringStockInfo {
  variant?: string;
}
export interface IListVariantExpiringStock {
  variant?: string;
}
export interface IUpdateVariantInventoryReminder {
  days?: string;
}
export interface ICreditManually {
  records: Record[];
}
export interface Record {
  variant: string;
  quantityTypes: IQuantityType[];
  expiry: string;
  batch: string;
}
export interface IQuantityType {
  type: number;
  stockCount: number;
}
export interface IUpdateVariantInventory {
  reason: number;
  records: IVariantInventoryRecord[];
}
export interface IVariantInventoryRecord {
  quantityTypes: IVariantInventoryQuantityType[];
  expiry: Date;
  batch: number;
}
export interface IVariantInventoryQuantityType {
  type: number;
  stockCount: number;
}
export interface IUpdateInventoryStatus {
  status: number;
  variants?: Variant[];
}
export interface Variant {
  variant: string;
  quantityTypes: QuantityType[];
  expiry: Date;
  batch: number;
}
export interface QuantityType {
  type: number;
  stockCount: number;
}
export interface IAddLowStocks {
  variants: any;
  forecastDays: number;
}
