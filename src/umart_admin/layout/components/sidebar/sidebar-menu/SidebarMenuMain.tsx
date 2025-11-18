import { SidebarMenuItem } from './SidebarMenuItem';
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub';
import MasterSVG from '../../../../../umart_admin/assets/media/dashboard/master.svg';
import ContactSVG from '../../../../../umart_admin/assets/media/dashboard/contact.svg';
import CustomNotificationSVG from '../../../../../umart_admin/assets/media/dashboard/notifications.svg';
import SettingsSVG from '../../../../../umart_admin/assets/media/dashboard/settings.svg';
import ProductSVG from '../../../../../umart_admin/assets/media/dashboard/inventory.svg';
import DashboardIcon from '../../../../../umart_admin/assets/media/dashboard/dashboard.svg';
import CustomersIcon from '../../../../../umart_admin/assets/media/dashboard/people.svg';
import OrdersDelivery from '../../../../../umart_admin/assets/media/dashboard/orders-delivery.svg';
import InventorySVG from '../../../../../umart_admin/assets/media/dashboard/_inventory.svg';
import DiscountSVG from '../../../../assets/media/svg_uMart/discount.svg';
import RecipeSVG from '../../../../assets/media/svg_uMart/recipeIcon.svg';
import { SidebarTitle } from '../../../../../utils/string';
import { useAuth } from '../../../../../app/modules/auth';
import {
  AllModules,
  AppSettingsConst,
  BannerConst,
  Brand,
  BrandWiseSalesPerformanceReport,
  Category,
  CategoryAndSubCategoryAnalysisReport,
  CmsPages,
  ContactEnquiries,
  Customer,
  CustomerPurchaseBehaviourReport,
  CustomNotificationConst,
  DeliveryUser,
  FrequentCustomerPurchasePatternAnalysisReport,
  GeneralSettings,
  GeographicSalesInsightReport,
  GoodsInWarehouseConst,
  GoodsRequestConst,
  Inventory,
  InventoryStatusReport,
  LowStockConst,
  Order,
  OutWardReports,
  Product,
  ProductSalesPerformanceReport,
  ProductVariant,
  ProductZoneConst,
  Promotion,
  ReturnProductReports,
  ReturnRequestConst,
  RevenueGenerationReport,
  RolePermissions,
  SalesReportsConst,
  UserManagement,
  WarehouseZone,
  AllRecipesConst,
  SuggestProductConst,
  PickerConst,
  RefundReportConst,
} from '../../../../../utils/constants';
import React from 'react';
const SidebarMenuMain = () => {
  const { currentUser } = useAuth();
  const allModules = [
    Customer,
    Order,
    Product,
    Promotion,
    Category,
    Brand,
    ProductVariant,
    RolePermissions,
    UserManagement,
    WarehouseZone,
    DeliveryUser,
    SalesReportsConst,
    GeneralSettings,
    CmsPages,
    ContactEnquiries,
    ProductZoneConst,
    CustomNotificationConst,
    GoodsInWarehouseConst,
    GoodsRequestConst,
    ReturnRequestConst,
    LowStockConst,
    BannerConst,
    AppSettingsConst,
    OutWardReports,
    ReturnProductReports,
    CustomerPurchaseBehaviourReport,
    GeographicSalesInsightReport,
    FrequentCustomerPurchasePatternAnalysisReport,
    ProductSalesPerformanceReport,
    BrandWiseSalesPerformanceReport,
    CategoryAndSubCategoryAnalysisReport,
    RevenueGenerationReport,
    InventoryStatusReport,
    AllRecipesConst,
    SuggestProductConst,
    PickerConst,
    RefundReportConst
  ];
  const permissionModules =
    currentUser?.roleAndPermission &&
    currentUser?.roleAndPermission.permissions.length > 0
      ? currentUser?.roleAndPermission.permissions.includes(AllModules)
        ? allModules
        : currentUser.roleAndPermission.permissions.map(
            (item: any) => item.module
          )
      : allModules;
  const renderMenu = [
    <SidebarMenuItem
      to="/dashboard"
      icon={DashboardIcon}
      title={SidebarTitle.Dashboard}
      fontIcon="bi-app-indicator"
    />,
  ];
  const hasPermission = (permission: number) =>
    permissionModules.includes(permission);
  // if (hasPermission(Customer)) {
  //   renderMenu.push(
  //     <SidebarMenuItem
  //       to="#"
  //       icon={CustomersIcon}
  //       title={SidebarTitle.Customer}
  //       fontIcon="bi-app-indicator"
  //     />
  //   );
  // }
  // if (hasPermission(Order)) {
  //   renderMenu.push(
  //     <SidebarMenuItem
  //       to="#"
  //       title="Orders & delivery"
  //       icon={OrdersDelivery}
  //       fontIcon="bi-person"
  //     />
  //   );
  // }
  if (hasPermission(Customer)) {
    renderMenu.push(
      <SidebarMenuItem
        to="/customers"
        icon={CustomersIcon}
        title={SidebarTitle.Customer}
        fontIcon="bi-app-indicator"
      />
    );
  }
  const moduleOfFinanceReport: any = [];
  if (hasPermission(OutWardReports)) {
    moduleOfFinanceReport.push(
      <SidebarMenuItem
        to="/finance-reports/outward-report"
        title="Outward Reports"
        // icon={InventorySVG}
        fontIcon="bi-person"
      />
    );
  }
  if (hasPermission(ReturnProductReports)) {
    moduleOfFinanceReport.push(
      <SidebarMenuItem
        to="/finance-reports/return-product-report"
        title="Return Product Reports"
        // icon={InventorySVG}
        fontIcon="bi-person"
      />
    );
  }
  if (hasPermission(RefundReportConst)) {
    moduleOfFinanceReport.push(
      <SidebarMenuItem
        to="/finance-reports/refund-report"
        title="Pending Refund Report"
        // icon={InventorySVG}
        fontIcon="bi-person"
      />
    );
  }
  if (moduleOfFinanceReport.length > 0) {
    renderMenu.push(
      <SidebarMenuItemWithSub
        to="#"
        icon={MasterSVG}
        title={'Finance Reports'}
        fontIcon="bi-app-indicator"
      >
        {moduleOfFinanceReport.map((item: any, index: number) => {
          return <React.Fragment key={index}>{item}</React.Fragment>;
        })}
      </SidebarMenuItemWithSub>
    );
  }
  if (hasPermission(Order)) {
    renderMenu.push(
      <SidebarMenuItem
        to="/orders"
        title="Orders & Delivery"
        icon={OrdersDelivery}
        fontIcon="bi-person"
      />
    );
  }
  if (hasPermission(Product)) {
    renderMenu.push(
      <SidebarMenuItem
        to="/all-products"
        title="All Products"
        icon={ProductSVG}
        fontIcon="bi-person"
      />
    );
  }
  if (hasPermission(AllRecipesConst)) {
    renderMenu.push(
      <SidebarMenuItem
        to="/all-recipes"
        title="All Recipes"
        icon={RecipeSVG}
        fontIcon="bi-person"
      />
    );
  }
  const moduleOfInventory: any = [];
  if (hasPermission(GoodsInWarehouseConst)) {
    moduleOfInventory.push(
      <SidebarMenuItem
        to="/inventory/goods-in-warehouse"
        title="Goods In Warehouse"
        // icon={InventorySVG}
        fontIcon="bi-person"
      />
    );
  }
  if (hasPermission(GoodsRequestConst)) {
    moduleOfInventory.push(
      <SidebarMenuItem
        to="/goods-requests"
        title="Goods Requests"
        fontIcon="bi-person"
      />
    );
  }
  if (hasPermission(ReturnRequestConst)) {
    moduleOfInventory.push(
      <SidebarMenuItem
        to="/all-return-requests"
        title="Return Requests"
        // icon={InventorySVG}
        fontIcon="bi-person"
      />
    );
  }
  if (hasPermission(LowStockConst)) {
    moduleOfInventory.push(
      <SidebarMenuItem
        to="/inventory/low-stock-list"
        title="Low Stock List"
        // icon={InventorySVG}
        fontIcon="bi-person"
      />
    );
  }
  if (moduleOfInventory.length > 0) {
    renderMenu.push(
      <SidebarMenuItemWithSub
        to="#"
        icon={InventorySVG}
        title={'Inventory'}
        fontIcon="bi-app-indicator"
      >
        {moduleOfInventory.map((item: any, index: number) => {
          return <React.Fragment key={index}>{item}</React.Fragment>;
        })}
      </SidebarMenuItemWithSub>
    );
  }
  if (hasPermission(Promotion)) {
    renderMenu.push(
      <SidebarMenuItem
        to="/promotion-campaign/"
        title="Promotion Campaign"
        icon={DiscountSVG}
        fontIcon="bi-person"
      />
    );
  }
  const moduleOfMaster: any = [];
  if (hasPermission(Category)) {
    moduleOfMaster.push(
      <SidebarMenuItem
        to="/master/categories"
        title={SidebarTitle.Category}
        hasBullet={false}
      />
    );
  }
  if (hasPermission(Brand)) {
    moduleOfMaster.push(
      <SidebarMenuItem
        to="master/brands"
        title={SidebarTitle.Brands}
        hasBullet={false}
      />
    );
  }
  if (hasPermission(ProductVariant)) {
    moduleOfMaster.push(
      <SidebarMenuItem
        to="/master/product-variants"
        title={SidebarTitle.ProductVariants}
        hasBullet={false}
      />
    );
  }
  if (hasPermission(ProductZoneConst)) {
    moduleOfMaster.push(
      <SidebarMenuItem
        to="/master/product-zones"
        title={SidebarTitle.ProductZone}
        hasBullet={false}
      />
    );
  }
  if (hasPermission(RolePermissions)) {
    moduleOfMaster.push(
      <SidebarMenuItem
        to="/master/roles-permissions"
        title={SidebarTitle.Roles}
        hasBullet={false}
      />
    );
  }
  if (hasPermission(UserManagement)) {
    moduleOfMaster.push(
      <SidebarMenuItem
        to="/master/user-management"
        title={SidebarTitle.User}
        hasBullet={false}
      />
    );
  }
  if (hasPermission(WarehouseZone)) {
    moduleOfMaster.push(
      <SidebarMenuItem
        to="/master/loading-area"
        title={SidebarTitle.LoadingArea}
        hasBullet={false}
      />
    );
  }
  if (hasPermission(DeliveryUser)) {
    moduleOfMaster.push(
      <SidebarMenuItem
        to="/master/delivery-users"
        title={SidebarTitle.Delivery}
        hasBullet={false}
      />
    );
  }
  if (hasPermission(PickerConst)) {
    moduleOfMaster.push(
      <SidebarMenuItem
        to="/master/all-picker"
        title={'Pickers'}
        hasBullet={false}
      />
    );
  }
  // const masterOption = (
  // );
  if (moduleOfMaster.length > 0) {
    renderMenu.push(
      <SidebarMenuItemWithSub
        to="#"
        icon={MasterSVG}
        title={SidebarTitle.Master}
        fontIcon="bi-app-indicator"
      >
        {moduleOfMaster.map((item: any, index: number) => {
          return <React.Fragment key={index}>{item}</React.Fragment>;
        })}
      </SidebarMenuItemWithSub>
    );
  }
  const moduleOfReports = [];
  if (hasPermission(SalesReportsConst)) {
    moduleOfReports.push(
      <SidebarMenuItem
        to="/sales-report"
        title="Sales Report"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/out-of-stock"
        title="Out Of Stock Products"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/search-tags"
        title="Search Tags"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/all-product-report"
        title="All Product Report"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/customer-report"
        title="Customer Report"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/delivery-report"
        title="Delivery Report"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/customer-order-report"
        title="Customer Order Report"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/new-sales-report"
        title="Sales Report V2"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/inventory-report"
        title="Inventory Report"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/inventory-adjustment-report"
        title="Inventory Adjustment Report"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/delivery-time-report"
        title="Delivery Time Report "
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/login-not-order-place-order"
        title="Login & Not Placed Order Report"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/placed-one-order-report"
        title="Placed One Order Report"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/no-order-last-15day-report"
        title="No Order From Last 15 Days Report"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
    moduleOfReports.push(
      <SidebarMenuItem
        to="/customer-migration-report"
        title="Customer Migration Report"
        // icon={MasterSVG}
        fontIcon="bi-person"
      />
    );
  }
  // if (
  //   hasPermission(CustomerPurchaseBehaviourReport) ||
  //   hasPermission(GeographicSalesInsightReport) ||
  //   hasPermission(FrequentCustomerPurchasePatternAnalysisReport) ||
  //   hasPermission(ProductSalesPerformanceReport) ||
  //   hasPermission(BrandWiseSalesPerformanceReport) ||
  //   hasPermission(CategoryAndSubCategoryAnalysisReport) ||
  //   hasPermission(RevenueGenerationReport) ||
  //   hasPermission(InventoryStatusReport)
  // ) {
  //   moduleOfReports.push(
  //     <SidebarMenuItem
  //       to="/report-analytics"
  //       title="Reports & Analytics"
  //       // icon={MasterSVG}
  //       fontIcon="bi-person"
  //     />
  //   );
  // }
  if (moduleOfReports.length > 0) {
    renderMenu.push(
      <SidebarMenuItemWithSub
        to="#"
        icon={OrdersDelivery}
        title={'Reports'}
        fontIcon="bi-app-indicator"
      >
        {moduleOfReports.map((item: any, index: number) => {
          return <React.Fragment key={index}>{item}</React.Fragment>;
        })}
      </SidebarMenuItemWithSub>
    );
  }
  if (hasPermission(SuggestProductConst)) {
    renderMenu.push(
      <SidebarMenuItem
        to="/order-anything"
        icon={ProductSVG}
        title={'Order Anything'}
        fontIcon="bi-app-indicator"
      />
    );
  }
  const moduleOfSettings = [];
  if (hasPermission(GeneralSettings)) {
    moduleOfSettings.push(
      <SidebarMenuItem
        to="/settings/general-settings"
        title={SidebarTitle.generalSettings}
        fontIcon="bi-app-indicator"
      />
    );
  }
  if (hasPermission(BannerConst)) {
    moduleOfSettings.push(
      <SidebarMenuItem
        to="/settings/banners"
        title={SidebarTitle.BannerManagement}
        fontIcon="bi-app-indicator"
      />
    );
  }
  if (hasPermission(AppSettingsConst)) {
    moduleOfSettings.push(
      <SidebarMenuItem
        to="/settings/app-settings"
        title={SidebarTitle.AppSettings}
        fontIcon="bi-app-indicator"
      />
    );
  }
  if (moduleOfSettings.length > 0) {
    renderMenu.push(
      <SidebarMenuItemWithSub
        to="#"
        icon={SettingsSVG}
        title={SidebarTitle.Settings}
        fontIcon="bi-app-indicator"
      >
        {moduleOfSettings.map((item: any, index: number) => {
          return <React.Fragment key={index}>{item}</React.Fragment>;
        })}
      </SidebarMenuItemWithSub>
    );
  }
  if (hasPermission(CmsPages)) {
    renderMenu.push(
      <SidebarMenuItemWithSub
        to="#"
        icon={MasterSVG}
        title={SidebarTitle.CmsPage}
        fontIcon="bi-app-indicator"
      >
        <SidebarMenuItem
          to="/cms-pages/about-us"
          title={SidebarTitle.AboutUs}
          fontIcon="bi-app-indicator"
        />
        <SidebarMenuItem
          to="/cms-pages/faqs"
          title={SidebarTitle.faqs}
          fontIcon="bi-app-indicator"
        />
        <SidebarMenuItem
          to="/cms-pages/privacy-policy"
          title={SidebarTitle.Privacy}
          fontIcon="bi-app-indicator"
        />
        <SidebarMenuItem
          to="/cms-pages/refund-policy"
          title={SidebarTitle.RefundPolicy}
          fontIcon="bi-app-indicator"
        />
        <SidebarMenuItem
          to="/cms-pages/terms-conditions"
          title={SidebarTitle.Terms}
          fontIcon="bi-app-indicator"
        />
      </SidebarMenuItemWithSub>
    );
  }
  if (hasPermission(CustomNotificationConst)) {
    renderMenu.push(
      <SidebarMenuItem
        to="/custom-notifications"
        icon={CustomNotificationSVG}
        title={SidebarTitle.CustomNotification}
        fontIcon="bi-app-indicator"
      />
    );
  }
  if (hasPermission(ContactEnquiries)) {
    renderMenu.push(
      <SidebarMenuItem
        to="/contact-enquiries/enquiries"
        icon={ContactSVG}
        title={SidebarTitle.ContactInquires}
        fontIcon="bi-app-indicator"
      />
    );
  }
  return (
    <>
      {renderMenu.map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ))}
    </>
  );
};
export { SidebarMenuMain };
