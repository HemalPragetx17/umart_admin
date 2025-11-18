import { IListPlans } from '../../types';
export const routesPlanningJSON = {
  listPlan: ({
    limit,
    pageNo,
    sortKey,
    sortOrder,
    fromDate,
    needCount,
    toDate,
  }: IListPlans) => {
    return {
      limit: limit,
      pageNo: pageNo,
      sortKey: sortKey,
      sortOrder: sortOrder,
      fromDate: fromDate,
      needCount: needCount,
      toDate: toDate,
    };
  },
};
