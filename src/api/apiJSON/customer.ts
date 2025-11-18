import { IListCustomers, IRefundOrder } from '../../types';
export const customerJSON = {
  listCustomers: ({
    pageNo,
    limit,
    sortKey,
    sortOrder,
    searchTerm,
    registeredFrom,
    registeredTo,
    orderCountFrom,
    toOrders,
    state,
  }: IListCustomers) => {
    return {
      pageNo: pageNo,
      limit: limit,
      sortKey: sortKey,
      sortOrder: sortOrder,
      needCount: true,
      searchTerm: searchTerm,
      registeredFrom: registeredFrom || '',
      registeredTo: registeredTo || '',
      orderCountFrom: orderCountFrom || '',
      orderCountTo: toOrders || '',
      state: state,
    };
  },
  listRefundOrders: ({
    pageNo,
    limit,
    sortKey,
    sortOrder,
    customerId,
    status,
  }: IRefundOrder) => {
    let params: any = {
      pageNo: pageNo,
      limit: limit,
      needCount: true,
      sortKey: sortKey,
      sortOrder: sortOrder,
      customerId: customerId,
    };
    if (status && status.length) {
      status.forEach((item: any, index: number) => {
        // params = {...params, 'status['+index +']':item}
        params[`status[${index}]`] = item;
      });
    }
    return params;
  },
};
