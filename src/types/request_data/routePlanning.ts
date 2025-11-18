export interface IListPlans {
  limit: number;
  pageNo: number;
  sortKey: string;
  sortOrder: number;
  needCount?: boolean;
  fromDate?: string;
  toDate?: string;
}
