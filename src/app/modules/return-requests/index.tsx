import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AllReturnRequests from './all-return-requests';
import ReturnRequestDetails from './return-request-details';
import InitiateRefund from './Initiate-refund';
import OrderRefundDetails from './order-refund-details';
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
          element={<AllReturnRequests />}
        />
        <Route
          path="/return-request-details"
          element={<ReturnRequestDetails />}
        />
        <Route
          path="/order-refund-details"
          element={<OrderRefundDetails />}
        />
        <Route
          path="/initiate-refund"
          element={<InitiateRefund />}
        />
      </Route>
    </Routes>
  );
};
export default Index;
