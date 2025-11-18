import { FC, Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { MasterLayout } from '../../umart_admin/layout/MasterLayout';
import TopBarProgress from 'react-topbar-progress-indicator';
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper';
import { getCSSVariableValue } from '../../umart_admin/assets/ts/_utils';
import { WithChildren } from '../../umart_admin/helpers';
import InventoryPage from '../modules/Inventory/index';
import Products from '../modules/all-products/index';
import Orders from '../modules/orders-delivery/index';
import Customers from '../modules/customers/index';
import ContactEnquiries from '../modules/contact-enquiries/index';
import CustomNotification from '../modules/custom-notification/index';
import ReturnRequests from '../modules/return-requests/index';
import CustomerOrderReport from '../modules/reports/CustomerOrderReport';
import SalesReportV2 from '../modules/reports/SalesReportV2';
import InventoryReport from '../modules/reports/InventoryReport';
import InventoryAdjustmentReport from '../modules/reports/InventoryAdjustmentReport';
import DeliveryReportTime from '../modules/reports/DeliverReportTime';
const SalesReport = lazy(() => import('../modules/sales-report'));
const MasterPage = lazy(() => import('../modules/master/index'));
const CMSPage = lazy(() => import('../modules/cms-pages/index'));
const SettingsPage = lazy(() => import('../modules/settings/index'));
const GoodsRequests = lazy(() => import('../modules/goods-requests/index'));
const FinanceReports = lazy(() => import('../modules/Finance-Reports'));
const PromotionAndCampaign = lazy(
  () => import('../modules/promotion-campaign/index')
);
const ReportsAndAnalytics = lazy(
  () => import('../modules/sales-report/reports-analytics/report-analytics')
);
const AllRecipes = lazy(() => import('../modules/recipe'));
const SuggestedProducts = lazy(
  () => import('../modules/suggested-products/suggest-products')
);
const OutOfStock = lazy(() => import('../modules/out-of-stock'));
const SearchTagsList = lazy(() => import('../modules/search-tags'));
const AllProductReport = lazy(() => import('../modules/reports/ProductReport'));
const LoginNotPlacedOrderReport = lazy(
  () => import('../modules/reports/LoginNotPlacedOrderReport')
);
const CustomerReport = lazy(() => import('../modules/reports/CustomerReport'));
const PlacedOneOrderReport = lazy(
  () => import('../modules/reports/PlacedOneOrderRepor')
);
const NoOrder15DayReport = lazy(
  () => import('../modules/reports/NoOrder15DaysReport')
);
const DeliveryReport = lazy(() => import('../modules/reports/DeliveryReport'));
const SupplyChainDashboard = lazy(()=> import('../pages/dashboard/SupplyChainDashboard'));
const TodayDashboard = lazy(()=> import('../pages/dashboard/TodayDashboard'));
const BuyerMigrationReport = lazy(
  () => import('../modules/reports/BuyerMigrationReport')
);
const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route
          path="auth/*"
          element={<Navigate to="/dashboard" />}
        />
        {/* Pages */}
        <Route
          path="dashboard"
          element={<DashboardWrapper />}
        />
        <Route
          path="inventory/*"
          element={
            <SuspensedView>
              <InventoryPage />
            </SuspensedView>
          }
        />
        <Route
          path="promotion-campaign/*"
          element={
            <SuspensedView>
              <PromotionAndCampaign />
            </SuspensedView>
          }
        />
        <Route
          path="finance-reports/*"
          element={
            <SuspensedView>
              <FinanceReports />
            </SuspensedView>
          }
        />
        <Route
          path="all-products/*"
          element={
            <SuspensedView>
              <Products />
            </SuspensedView>
          }
        />
        <Route
          path="all-recipes/*"
          element={
            <SuspensedView>
              <AllRecipes />
            </SuspensedView>
          }
        />
        <Route
          path="goods-requests/*"
          element={
            <SuspensedView>
              <GoodsRequests />
            </SuspensedView>
          }
        />
        <Route
          path="all-return-requests/*"
          element={
            <SuspensedView>
              <ReturnRequests />
            </SuspensedView>
          }
        />
        <Route
          path="orders/*"
          element={
            <SuspensedView>
              <Orders />
            </SuspensedView>
          }
        />
        <Route
          path="sales-report/*"
          element={
            <SuspensedView>
              <SalesReport />
            </SuspensedView>
          }
        />
        <Route
          path="out-of-stock/*"
          element={
            <SuspensedView>
              <OutOfStock />
            </SuspensedView>
          }
        />
        <Route
          path="search-tags/*"
          element={
            <SuspensedView>
              <SearchTagsList />
            </SuspensedView>
          }
        />
        <Route
          path="report-analytics/*"
          element={
            <SuspensedView>
              <ReportsAndAnalytics />
            </SuspensedView>
          }
        />
        <Route
          path="customers/*"
          element={
            <SuspensedView>
              <Customers />
            </SuspensedView>
          }
        />
        {/* Lazy Modules */}
        <Route
          path="master/*"
          element={
            <SuspensedView>
              <MasterPage />
            </SuspensedView>
          }
        />
        <Route
          path="cms-pages/*"
          element={
            <SuspensedView>
              <CMSPage />
            </SuspensedView>
          }
        />
        <Route
          path="settings/*"
          element={
            <SuspensedView>
              <SettingsPage />
            </SuspensedView>
          }
        />
        <Route
          path="custom-notifications/*"
          element={
            <SuspensedView>
              <CustomNotification />
            </SuspensedView>
          }
        />
        <Route
          path="contact-enquiries/*"
          element={
            <SuspensedView>
              <ContactEnquiries />
            </SuspensedView>
          }
        />
        <Route
          path="order-anything"
          element={
            <SuspensedView>
              <SuggestedProducts />
            </SuspensedView>
          }
        />
        <Route
          path="all-product-report"
          element={
            <SuspensedView>
              <AllProductReport />
            </SuspensedView>
          }
        />
        <Route
          path="login-not-order-place-order"
          element={
            <SuspensedView>
              <LoginNotPlacedOrderReport />
            </SuspensedView>
          }
        />
        <Route
          path="customer-report"
          element={
            <SuspensedView>
              <CustomerReport />
            </SuspensedView>
          }
        />
        <Route
          path="placed-one-order-report"
          element={
            <SuspensedView>
              <PlacedOneOrderReport />
            </SuspensedView>
          }
        />
        <Route
          path="no-order-last-15day-report"
          element={
            <SuspensedView>
              <NoOrder15DayReport />
            </SuspensedView>
          }
        />
        <Route
          path="delivery-report"
          element={
            <SuspensedView>
              <DeliveryReport />
            </SuspensedView>
          }
        />
        <Route
          path="customer-order-report"
          element={
            <SuspensedView>
              <CustomerOrderReport />
            </SuspensedView>
          }
        />
        <Route
          path="new-sales-report"
          element={
            <SuspensedView>
              <SalesReportV2 />
            </SuspensedView>
          }
        />
        <Route
          path="inventory-report"
          element={
            <SuspensedView>
              <InventoryReport />
            </SuspensedView>
          }
        />
        <Route
          path="inventory-adjustment-report"
          element={
            <SuspensedView>
              <InventoryAdjustmentReport />
            </SuspensedView>
          }
        />
        <Route
          path="delivery-time-report"
          element={
            <SuspensedView>
              <DeliveryReportTime />
            </SuspensedView>
          }
        />
        <Route
          path="supply-chain-dashboard"
          element={
            <SuspensedView>
              <SupplyChainDashboard />
            </SuspensedView>
          }
        />
        <Route
          path="customer-migration-report"
          element={
            <SuspensedView>
              <BuyerMigrationReport />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route
          path="*"
          element={<Navigate to="/error/404" />}
        />
      </Route>
    </Routes>
  );
};
const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary');
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};
export { PrivateRoutes };
