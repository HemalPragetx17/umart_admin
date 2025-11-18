import {
  Actived,
  BrandWiseSalesPerformanceReport,
  Cart,
  CategoryAndSubCategoryAnalysisReport,
  CustomerPurchaseBehaviourReport,
  Deactivated,
  FlatDiscount,
  FrequentCustomerPurchasePatternAnalysisReport,
  General,
  GeographicSalesInsightReport,
  InventoryStatusReport,
  InstantOrder,
  NonVeg,
  OrderCancelled,
  OrderDelivered,
  OrderOutForDelivery,
  OrderProcessed,
  OrderSubmitted,
  PercentageDiscount,
  ProductNotification,
  ProductSalesPerformanceReport,
  RevenueGenerationReport,
  ScheduledOrder,
  SelfPickedOrder,
  Skip,
  SuggestOptions,
  TextGuide,
  Veg,
  GuestUserNotification,
} from './constants';
import green from '../umart_admin/assets/media/svg_uMart/green_dot.svg';
import gray from '../umart_admin/assets/media/svg_uMart/gray_dot.svg';
export const IMAGES = {
  downArrow: require('../umart_admin/assets/media/svg_uMart/down-arrow.svg')
    .default,
  ErrorWarnGray: require('../umart_admin/assets/media/svg_uMart/error-warning_gray.svg'),
  ArrowUp: require('../umart_admin/assets/media/svg_uMart/up-arrow.svg')
    .default,
};
export const expiryJSON = [
  // {
  //   value: '-3',
  //   label: 'Deleted Products',
  // },
  {
    value: '0',
    label: 'No expiry',
    title: 'No expiry',
  },
  {
    value: '-1',
    label: 'Expired',
    title: 'Expired',
  },
  {
    value: '-2',
    label: 'Expires After 1 year',
    title: 'Expires After 1 year',
  },
  {
    value: '1',
    label: 'Expires in 1 month',
    title: 'Expires in 1 month',
  },
  {
    value: '2',
    label: 'Expires in 2 month',
    title: 'Expires in 2 month',
  },
  {
    value: '3',
    label: 'Expires in 3 month',
    title: 'Expires in 3 month',
  },
  {
    value: '4',
    label: 'Expires in 4 month',
    title: 'Expires in 4 month',
  },
  {
    value: '5',
    label: 'Expires in 5 month',
    title: 'Expires in 5 month',
  },
  {
    value: '6',
    label: 'Expires in 6 month',
    title: 'Expires in 6 month',
  },
  {
    value: '7',
    label: 'Expires in 7 month',
    title: 'Expires in 7 month',
  },
  {
    value: '8',
    label: 'Expires in 8 month',
    title: 'Expires in 8 month',
  },
  {
    value: '9',
    label: 'Expires in 9 month',
    title: 'Expires in 9 month',
  },
  {
    value: '10',
    label: 'Expires in 10 month',
    title: 'Expires in 10 month',
  },
  {
    value: '11',
    label: 'Expires in 11 month',
    title: 'Expires in 11 month',
  },
  {
    value: '12',
    label: 'Expires in 12 month',
    title: 'Expires in 12 month',
  },
];
export const productStatusJSON = [
  {
    value: Actived,
    label: (
      <>
        <img
          src={green}
          width={12}
          height={12}
          className="me-3"
          alt=""
        />
        <span className="fs-16 fw-600 text-black mb-0">Active</span>
      </>
    ),
    title: 'Active',
  },
  {
    value: Deactivated,
    label: (
      <>
        <img
          src={gray}
          width={12}
          height={12}
          className="me-3"
          alt=""
        />
        <span className="fs-16 fw-600 text-black mb-0">Deactivated</span>
      </>
    ),
    title: 'Deactivated',
  },
];
export const expiryMonthsJSON = [
  {
    value: 1,
    label: '1 month',
  },
  {
    value: 2,
    label: '2 months',
  },
  {
    value: 3,
    label: '3 months',
  },
  {
    value: 4,
    label: '4 months',
  },
  {
    value: 5,
    label: '5 months',
  },
  {
    value: 6,
    label: '6 months',
  },
  {
    value: 7,
    label: '7 months',
  },
  {
    value: 8,
    label: '8 months',
  },
  {
    value: 9,
    label: '9 months',
  },
  {
    value: 10,
    label: '10 months',
  },
  {
    value: 11,
    label: '11 months',
  },
  {
    value: 12,
    label: '12 months',
  },
];
export const operationJSON = [
  {
    value: '1',
    label: 'New Stock Updated',
  },
  // {
  //   value: '2',
  //   label: 'Customer return',
  // },
  // {
  //   value: '3',
  //   label: 'Goods return request',
  // },
  {
    value: '4',
    label: 'Missing/Damaged goods',
  },
  {
    value: '5',
    label: 'New order',
  },
  {
    value: '6',
    label: 'Order Modified',
  },
];
export const goodsRequestStatusJSON = [
  {
    value: 1,
    label: 'Pending',
  },
  {
    value: 2,
    label: 'Accepted',
  },
  {
    value: 3,
    label: 'Completed',
  },
  {
    value: 4,
    label: 'Rejected',
  },
];
export const orderStatusJSON = [
  {
    value: OrderSubmitted,
    label: 'New orders',
  },
  {
    value: OrderProcessed,
    label: 'In progress',
  },
  {
    value: OrderOutForDelivery,
    label: 'Out for delivery',
  },
  {
    value: OrderDelivered,
    label: 'Delivered',
  },
  {
    value: OrderCancelled,
    label: 'Cancelled',
  },
];
export const refundListJSON = [
  {
    value: 0,
    label: 'All Orders',
  },
  {
    value: 1,
    label: 'Refunded Orders',
  },
  {
    value: 2,
    label: 'Not Refunded Orders',
  },
];
export const variantJSON = [
  {
    value: Skip,
    name: 'SkipNoNeed',
    label: (
      <>
        <span className="fs-16 fw-600">Skip (Not needed)</span>
      </>
    ),
    title: 'Skip (Not needed)',
  },
  {
    value: SuggestOptions,
    name: 'SuggestOptions',
    label: (
      <>
        <span className="fs-16 fw-600">Suggest options</span>
      </>
    ),
    title: 'Suggest options',
  },
  {
    value: TextGuide,
    name: 'TextGuide',
    label: (
      <>
        <span className="fs-16 fw-600">Text guide</span>
      </>
    ),
    title: 'Text guide',
  },
];
export const promotionTypeJSON = [
  {
    value: 0,
    label: 'All',
    title: 'All',
  },
  {
    value: 1,
    label: 'Discount promotion',
    title: 'Discount promotion',
  },
  {
    value: 2,
    label: 'Coupon promotion',
    title: 'Coupon promotion',
  },
  {
    value: 3,
    label: 'Rewards',
    title: 'Rewards',
  },
];
export const rewardUsesJson = [
  {
    // value: AllProduct,
    label: 'All',
    value: 1,
    title: 'All',
  },
  {
    // value: AllProduct,
    label: 'Partially redeemed ',
    value: 2,
    title: 'Partially redeemed ',
  },
  {
    // value: AllProduct,
    label: 'Fully redeemed ',
    value: 3,
    title: 'Fully redeemed',
  },
];
export const notificationJSON = [
  {
    value: 1,
    label: 'Custom Notification',
    title: 'Custom Notification',
    type: General,
  },
  {
    value: 2,
    label: 'Top Ordered Product',
    title: 'Top Ordered Product',
    type: ProductNotification,
  },
  {
    value: 3,
    label: 'Customer Cart',
    title: 'Customer Cart',
    type: Cart,
  },
  {
    value: 4,
    label: 'All Products',
    title: 'All Products',
    type: ProductNotification,
  },
  {
    value: 5,
    label: 'Top Products',
    title: 'Top Products',
    type: ProductNotification,
  },
  {
    value: 6,
    label: 'Top Customers',
    title: 'Top Customers',
    type: General,
  },
  {
    value: 7,
    label: 'Guest Users',
    title: 'Guest Users',
    type: GuestUserNotification,
  },
];
export const stockLastJSON = [
  {
    value: 5,
    label: '5 days',
    title: '5 days',
  },
  {
    value: 10,
    label: '10 days',
    title: '10 days',
  },
  {
    value: 20,
    label: '20 days',
    title: '20 days',
  },
  {
    value: 30,
    label: '1 month',
    title: '1 month',
  },
  {
    value: 60,
    label: '2 months',
    title: '2 months',
  },
  {
    value: 90,
    label: '3 months',
    title: '3 months',
  },
  {
    value: 180,
    label: '6 months',
    title: '6 months',
  },
  {
    value: 365,
    label: '1 year',
    title: '1 year',
  },
];
export const languagesJSON = [
  {
    value: 'en',
    label: 'English',
    title: 'English',
  },
  {
    value: 'sw',
    label: 'Swahili',
    title: 'Swahili',
  },
];
export const appTypeJSON = [
  {
    label: 'Customer App',
    title: 'Customer App',
    value: 'i3',
  },
  {
    label: 'Driver App',
    title: 'Driver App',
    value: 'i4',
  },
];
export const discountTypeJson = [
  {
    value: FlatDiscount,
    label: 'Flat discount',
    title: 'Flat discount',
  },
  {
    value: PercentageDiscount,
    label: 'Percentage discount',
    title: 'Percentage discount',
  },
];
export const categoryStaticJson = [
  {
    value: '1',
    label: 'Food',
    title: 'Food',
  },
  {
    value: '2',
    label: 'Cloths',
    title: 'Cloths',
  },
  {
    value: '3',
    label: 'Electronics',
    title: 'Electronics',
  },
  {
    value: '4',
    label: 'Baby Products',
    title: 'Baby Products',
  },
  {
    value: '5',
    label: 'Skin Care',
    title: 'Skin Care',
  },
  {
    value: '6',
    label: 'Hair Care',
    title: 'Hair Care',
  },
  {
    value: '7',
    label: 'Cleaners',
    title: 'Cleaners',
  },
];
export const ReportTypes = [
  {
    value: CustomerPurchaseBehaviourReport,
    label: 'Customer Purchase Behavior Analysis',
    title: 'Customer Purchase Behavior Analysis',
  },
  {
    value: GeographicSalesInsightReport,
    label: 'Geographic Sales Insights Report',
    title: 'Geographic Sales Insights Report',
  },
  // {
  //   value: AreaBasedCustomerSegmentationReport,
  //   label: 'Area-Based Customer Segmentation',
  //   title: 'Area-Based Customer Segmentation',
  // },
  {
    value: FrequentCustomerPurchasePatternAnalysisReport,
    label: 'Frequent Customer Purchase Pattern Analysis Report',
    title: 'Frequent Customer Purchase Pattern Analysis Report',
  },
  {
    value: ProductSalesPerformanceReport,
    label: 'Product Sales Performance Report',
    title: 'Product Sales Performance Report',
  },
  {
    value: BrandWiseSalesPerformanceReport,
    label: 'Brand-Wise Sales Performance Report',
    title: 'Brand-Wise Sales Performance Report',
  },
  {
    value: CategoryAndSubCategoryAnalysisReport,
    label: 'Category and Sub-Category Sales Analysis Report',
    title: 'Category and Sub-Category Sales Analysis Report',
  },
  {
    value: RevenueGenerationReport,
    label: 'Revenue Generation Report',
    title: 'Revenue Generation Report',
  },
  // {
  //   value: CommissionAnalysisReport,
  //   label: 'Commission Analysis Report',
  //   title: 'Commission Analysis Report',
  // },
  {
    value: InventoryStatusReport,
    label: 'Product Variant Inventory Status Report',
    title: 'Product Variant Inventory Status Report',
  },
];
export const ordersTypeOptionJson = [
  // {
  //   value: InstantOrder,
  //   label: 'Instant Order',
  //   title: 'Instant Order',
  // },
  {
    value: ScheduledOrder,
    label: 'Scheduled Order',
    title: 'Scheduled Order',
  },
  {
    value: SelfPickedOrder,
    label: 'Self Pickup Order',
    title: 'Self Pickup Order',
  },
];
export const foodTypeJSON = [
  {
    value: Veg,
    label: 'Veg',
    title: 'Veg',
  },
  {
    value: NonVeg,
    label: 'Non-Veg',
    title: 'Non-Veg',
  },
];
export const servingJSON = [
  {
    value: 1,
    label: '1',
    title: '1',
  },
  {
    value: 2,
    label: '2',
    title: '2',
  },
  {
    value: 3,
    label: '3',
    title: '3',
  },
  {
    value: 4,
    label: '4',
    title: '4',
  },
];
export const cookTimeJSON = [
  {
    value: 10,
    label: '10 mins',
    title: '10 mins',
  },
  {
    value: 2,
    label: '20 mins',
    title: '20 mins',
  },
  {
    value: 3,
    label: '30 mins',
    title: '30 mins',
  },
  {
    value: 4,
    label: '40 mins',
    title: '40 mins',
  },
];
export const searchTermsTypesOptions = [
  {
    value: 0,
    label: 'All',
    title: 'All',
  },
  {
    value: 1,
    label: 'Not empty search',
    title: 'Not empty search',
  },
  {
    value: 2,
    label: 'Empty search',
    title: 'Empty search',
  },
];
export const paymentTypeOptions = [
  {
    value: 0,
    label: 'All',
    title: 'All',
  },
  {
    value: 1,
    label: 'Cash',
    title: 'Cash',
  },
  {
    value: 2,
    label: 'Online',
    title: 'Online',
  },
  {
    value: 3,
    label: 'Coin',
    title: 'Coin',
  },
];
export const orderTypeStaticJson = [
  {
    value: 4,
    label: 'Delivered',
    title: 'Delivered',
  },
  {
    value: 5,
    label: 'Cancelled',
    title: 'Cancelled',
  },
];
export const deliveryTimeStaticJson = [
  {
    value: 1,
    label: 'Less than 30 mins',
    title: 'Less than 30 mins',
  },
  {
    value: 2,
    label: 'More than 30 mins',
    title: 'More than 30 mins',
  },
];
export const platformOptions = [
  {
    value: 0,
    label: 'All',
    title: 'All',
  },
  {
    value: 1,
    label: 'UMart',
    title: 'UMart',
  },
  {
    value: 2,
    label: 'UWorld',
    title: 'UWorld',
  },
];
