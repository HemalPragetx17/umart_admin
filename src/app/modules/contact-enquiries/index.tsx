import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { PageTitle } from '../../../umart_admin/layout/core';
import ContactEnquiries from './contact-enquiries';
const index = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="*"
          element={<Navigate to="/error/404" />}
        />
        <Route
          index
          element={<Navigate to="/contact-enquiries" />}
        />
        <Route
          path="enquiries"
          element={
            <>
              <PageTitle>Contact inquiries</PageTitle>
              <ContactEnquiries />
            </>
          }
        />
      </Route>
    </Routes>
  );
};
export default index;
