import { lazy } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import GoodsRequestDetails from './goods-request-details';
import EditGoodsRequest from './edit-goods-request';
const AllGoodsRequests = lazy(() => import('./all-requests'));
const AddGoodsRequest = lazy(() => import('./add-goods-request'));
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
          element={<AllGoodsRequests />}
        />
        <Route
          path="/add-goods-request"
          element={<AddGoodsRequest />}
        />
        <Route
          path="/goods-request-details"
          element={<GoodsRequestDetails />}
        />
        <Route
          path="/edit-goods-request"
          element={<EditGoodsRequest />}
        />
      </Route>
    </Routes>
  );
};
export default Index;
