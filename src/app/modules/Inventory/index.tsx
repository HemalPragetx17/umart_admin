import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import GoodsInWarehouse from './goods-warehouse/goods-in-warehouse';
import { PageLink, PageTitle } from '../../../umart_admin/layout/core';
import AddGoodsInWarehouse from './goods-warehouse/add-goods-inventory';
import AllLowStocks from './low-stock-list/all-low-stocks';
const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/inventory/goods-in-warehouse',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
];
const InventoryPage = () => (
  <Routes>
    <Route element={<Outlet />}>
      <Route
        index
        element={<Navigate to="/inventory/goods-in-warehouse" />}
      />
      <Route
        path="goods-in-warehouse"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
              Goods in warehouse
            </PageTitle>
            <GoodsInWarehouse />
          </>
        }
      />
      <Route
        path="add-goods-in-inventory"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
              Add goods in warehouse
            </PageTitle>
            <AddGoodsInWarehouse />
          </>
        }
      />
      <Route
        path="low-stock-list"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
             Low stock list
            </PageTitle>
            <AllLowStocks />
          </>
        }
      />
    </Route>
  </Routes>
);
export default InventoryPage;
