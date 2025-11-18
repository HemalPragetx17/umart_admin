export interface IGoodsRequest {
  warehouseId: string;
  name: string;
  records: {
    variant: string;
    quantityTypes: any;
  }[];
  date: any;
}
