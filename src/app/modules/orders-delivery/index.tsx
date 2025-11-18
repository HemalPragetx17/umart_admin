import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { lazy } from 'react';
import DeliveryDetails from './delivery-details';
import GoodsLoadingDetails from './goods-loading-details';
const AllOrders = lazy(() => import('./all-orders'));
const OrderDetails = lazy(() => import('./order-details'));
const AddNewOrder = lazy(() => import('./place-order/add-new-order'));
const EditOrder = lazy(() => import('./edit-order'));
const Index = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="*"
          element={<Navigate to="/error/404" />}
        />
        <Route
          index
          element={<AllOrders />}
        />
        <Route
          path="order-details"
          element={<OrderDetails />}
        />
        <Route
          path="delivery-details"
          element={<DeliveryDetails />}
        />
        <Route
          path="goods-loading-details"
          element={<GoodsLoadingDetails />}
        />
        <Route
          path="add-new-order"
          element={<AddNewOrder />}
        />
        <Route
          path="edit-order"
          element={<EditOrder />}
        />
      </Route>
    </Routes>
  );
};
export default Index;
