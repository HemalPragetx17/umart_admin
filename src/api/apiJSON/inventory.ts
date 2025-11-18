import {
  IAddLowStocks,
  IListInventoryProduct,
  IUpdateVariantInventoryReminder,
} from '../../types';
export const inventoryJSON = {
  updateVariantInventoryRemainder: ({
    days,
  }: IUpdateVariantInventoryReminder) => {
    return { days: days };
  },
  listInventoryProduct: ({
    limit,
    sortKey,
    sortOrder,
    state,
    pageNo,
    expiry,
    categories,
    viewRemovedOnly,
    searchTerm,
    forecastedDays,
    zoneRef,
    binRef,
  }: IListInventoryProduct) => {
    let data: any = {
      limit: limit,
      sortKey: sortKey,
      sortOrder: sortOrder,
      state: state ? state : '1',
      needCount: true,
      pageNo: pageNo,
      searchTerm: searchTerm,
      forecastedDays: forecastedDays,
    };
    if (viewRemovedOnly) {
      data = { ...data, viewRemovedOnly: viewRemovedOnly };
    } else {
      if (expiry) {
        data = { ...data, expiry: expiry };
      }
    }
    if (categories) {
      console.log('cate', categories);
      data = { ...data, 'categories[]': categories };
    }
    if (zoneRef) {
      data.zoneRef = zoneRef;
    }
    if (binRef) {
      data.binRef = binRef;
    }
    console.log('data', data);
    return data;
  },
  addLowStocks: ({ variants, forecastDays }: IAddLowStocks) => {
    return {
      variants: variants,
      forecastDays: forecastDays,
    };
  },
};
