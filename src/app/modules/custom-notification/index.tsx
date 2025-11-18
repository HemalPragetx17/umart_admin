import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { PageTitle } from '../../../umart_admin/layout/core';
import CustomNotification from './custom-notification';
const index = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="*"
          element={<Navigate to="/error/404" />}
        />
        {/* <Route index element={<Navigate to="/contact-inquiries" />} /> */}
        <Route
          index
          element={
            <>
              <PageTitle>Contact inquiries</PageTitle>
              <CustomNotification />
            </>
          }
        />
      </Route>
    </Routes>
  );
};
export default index;
