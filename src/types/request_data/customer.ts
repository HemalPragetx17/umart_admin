export interface IListCustomers {
  limit: number;
  pageNo: number;
  sortKey?: string;
  sortOrder?: number;
  searchTerm?: string;
  registeredFrom?: any;
  registeredTo?: any;
  orderCountFrom?: any;
  toOrders?: any;
  state?: any;
}
export interface IRefundOrder {
  limit: number;
  pageNo: number;
  sortKey?: string;
  sortOrder?: number;
  customerId: string;
  status?: any;
}
