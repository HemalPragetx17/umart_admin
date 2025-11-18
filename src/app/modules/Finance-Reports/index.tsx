import { Navigate, Routes, Route, Outlet } from 'react-router-dom';
import SalesReport from './Sales-reports';
import { PageLink, PageTitle } from '../../../umart_admin/layout/core';
import ReturnProductReport from './return-product-report';
import RefundReport from './RefundReport';
const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/finance-reports/sales-report',
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
const ProfilePage = () => (
  <Routes>
    <Route
      element={
        <>
          <Outlet />
        </>
      }
    >
      <Route
        path="outward-report"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
              Outward Report
            </PageTitle>
            <SalesReport />
          </>
        }
      />
      <Route
        path="return-product-report"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
              Return Product Report
            </PageTitle>
            <ReturnProductReport />
          </>
        }
      />
      <Route
        path="refund-report"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
              Refund Report
            </PageTitle>
            <RefundReport />
          </>
        }
      />
      <Route
        index
        element={<SalesReport />}
      />
    </Route>
  </Routes>
);
export default ProfilePage;
