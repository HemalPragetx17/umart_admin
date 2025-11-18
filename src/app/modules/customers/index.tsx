import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import ViewCustomers from './view-customers';
import CustomerProfile from './customer-profile';
import { useAuth } from '../auth';
import { PageTitle } from '../../../umart_admin/layout/core';
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
          element={<ViewCustomers />}
        />
        <Route
          path="customer-profile"
          element={
            <>
              <PageTitle>customer profile</PageTitle>
              <CustomerProfile />
            </>
          }
        />
      </Route>
    </Routes>
  );
};
export default Index;
