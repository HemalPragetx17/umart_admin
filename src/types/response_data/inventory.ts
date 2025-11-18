export interface IListStats {
  products: number;
  productObj: {
    products: number;
    quantityTypes: QuantityType[];
  };
  loadingAreaCount: number;
  categoryCount: number;
  quantityTypes: QuantityType[];
}
export interface QuantityType {
  type: number;
  stockCount: number;
}
