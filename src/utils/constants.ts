export const PREF_TOKEN = 'bearerToken';
export const IS_INTRO = '/';
export const IS_LOGIN = 'Login';

// API BASE URL
// export const BASE_URL = 'https://a121a27a70d1.ngrok-free.app/';
export const BASE_URL = 'https://dev.api.umart.tz/';

export const PAGE_LIMIT = 10;
// API TYPES

export const GET = 'GET';
export const GET_URL_PARAMS = 'GET_URL_PARAMS';
export const GET_ID_PARAMS = 'GET_ID_PARAMS';
export const GET_URL_ENCODED = 'GET_URL_ENCODED';
export const GET_URL_ID_PARAMS = 'GET_URL_ID_PARAMS';
export const POST = 'POST';
export const POST_ID_PARAMS = 'POST_ID_PARAMS';
export const POST_RAW = 'POST_RAW';
export const POST_FORM = 'POST_FORM';
export const POST_URL_ENCODED = 'POST_URL_ENCODED';
export const POST_URL_PARAMS = 'POST_URL_PARAMS';
export const POST_URL_ENCODED_ID_PARAMS = 'POST_URL_ENCODED_ID_PARAMS';
export const POST_URL_PARAMS_WITH_DATA = 'POST_URL_PARAMS_WITH_DATA';
export const MULTI_PART_POST = 'MULTI_PART';
export const PATCH = 'PATCH';
export const PATCH_ID = 'PATCH_ID';
export const PATCH_FORM = 'PATCH_FORM';
export const PATCH_FORM_ID = 'PATCH_FORM_ID';
export const PATCH_URL_ENCODED = 'PATCH_URL_ENCODED';
export const PATCH_ID_URL_ENCODED = 'PATCH_ID_URL_ENCODED';
export const PATCH_FORM_ID_URL_ENCODED = 'PATCH_FORM_ID_URL_ENCODED';
export const MULTI_PART_ID_POST = 'MULTI_PART';
export const MULTI_PART_ID_PATCH = 'MULTI_PART_PATCH';
export const DELETE = 'DELETE';
export const DELETE_URL_PARAMS = 'DELETE_URL_PARAMS';
export const DELETE_URL_ENCODED = 'DELETE_URL_ENCODED';
export const DELETE_ID_PARAMS = 'DELETE_ID_PARAMS';
//Response
export const ResponseFail = 400;
export const ResponseSuccess = 200;
export const AuthError = 401;
export const Maintenance = 503;
//Product State Enum
export const AllProduct = 1;
export const Actived = 2;
export const Deactivated = 3;
//Product Status Enum
export const ApprovedProduct = 2;
export const PendingProduct = 3;
export const RejectedProduct = 4;
//Quantity Enum
export const Units = 1;
//Technical Details Enum
export const SingleLineText = 1;
export const MultiLineText = 2;
export const SingleSelection = 3;
export const MultiSelection = 4;
export const DateSelection = 5;
//Order Status
export const OrderSubmitted = 1; //New-order-placed
export const OrderProcessed = 2; //Route-planning generated
export const OrderOutForDelivery = 3; //out for delivery
export const OrderDelivered = 4; //Delivered
export const OrderCancelled = 5; //Cancelled
export const PaymentFailed = 6;
export const OrderFailed = 7;
export const InstantOrder = 7;
export const ScheduledOrder = 8;
export const SelfPickedOrder = 9;
// Vehicle order status
export const NotDispatched = 1;
export const Dispatched = 2;
export const VehicleStatusDelivered = 3; //End-status
export const CustomerNotAvailable = 4;
export const MovedToPendingOrder = 5; //End-status
export const PickedUp = 6;
export const VehicleStatusPaymentFailed = 7;
export const returnAssigned = 8;
export const returnPickedUp = 9;
// Orders Status
export const NewOrder = 1;
// export const PreparingForDispatc
export const Delivered = 3;
export const Cancelled = 4;
//OrderType
export const ReturnInitiated = 1;
export const PreparingForDispatch = 2;
export const OutForDelivery = 3;
export const CollectToday = 4;
//Order Payment method
export const OrderCash = 1;
export const OrderTigoPesa = 2;
export const OrderCoin = 3;
export const OrderCard = 4;
//Inventory Transaction/History
export const ShipmentThroughAdded = 'c1'; //New Stock Updated
export const AddedOnReturn = 'c2'; //Customer return
export const ManuallyAdded = 'c3'; //New Stock Updated
export const DirectlyReceived = 'c4'; //New Stock Updated
export const AddedOnOrderCancellation = 'c5'; //Order modified
export const AddedOnOrderModification = 'c6'; //Order modified
export const DeductedOnSale = 'd1'; //New order
export const DeductedOnReturnToSeller = 'd2'; //Goods return request
export const ManuallyDeducted = 'd3'; //Missing/Damaged goods
export const DeductedOnMissing = 'd4'; //Missing/Damaged goods
export const DeductedOnDamage = 'd5'; //Missing/Damaged goods
export const DeductedOnOrderModification = 'd6'; //Order modified
//Variants Defined By Enum
export const Skip = 0;
export const SuggestOptions = 1;
export const TextGuide = 2;
//Route Planning
export const RoutePlanning = 1;
export const RoutePlanned = 2;
export const RoutePlanCompleted = 3;
export const RoutePlanCancelled = 4;
export const RoutePlanFailed = 5;
//Route Plan Vehicle
export const RouteOrdersAssigned = 1;
export const RouteOrderLoadingInitiated = 2;
export const RouteOrderOutForDelivery = 3;
export const RouteOrderDelivered = 4;
export const RouteOrderCancelled = 5; //End-status
//Route Plan Vehicle Order
export const RouteOrderNotDispatched = 1; //In progress
export const RouteOrderDispatched = 2; //Out for delivery
export const RouteVehicleOrderDelivered = 3; //Delivered
export const RouteOrderCustomerNotAvailable = 4; //Customer not available
export const RouteOrderMovedToPendingOrder = 5; //Move to pending
// Address type enum
export const Home = 1;
export const Work = 2;
export const Office = 2;
export const Other = 3;
//Packed not Packed
export const Packed = 2;
export const NotPacked = 1;
//Google autocomplete apikey
//User Roles
export const StaffMember = 1;
export const WarehouseAdmin = 2;
export const InventoryManager = 3;
export const LoadingAreaManager = 4;
export const FinanceManager = 5;
export const DeliveryManager = 6;
//Admin UserType
export const Admin = 1;
export const AssistAdmin = 2;
export const CustomerType = 3;
//Permissions
export const AllPermissions = 0;
//Roles
export const All = 0;
export const View = 1;
export const Add = 2;
export const Edit = 3;
export const Delete = 4;
export const Download = 5;
//Permissions module
export const AllModules = 0;
export const Customer = 1;
export const Order = 2;
//export const Product = 3;
// Modules
// export const All = 0;
export const Product = 3;
export const Inventory = 4;
export const Promotion = 5;
export const Master = 6;
export const Category = 7;
export const Brand = 8;
export const ProductVariant = 9;
export const RolePermissions = 10;
export const UserManagement = 11;
export const WarehouseZone = 12;
export const DeliveryUser = 13;
export const Reports = 14;
export const Settings = 15;
export const CmsPages = 16;
export const ContactEnquiries = 17;
export const ProductZoneConst = 18;
export const CustomNotificationConst = 19;
export const GoodsInWarehouseConst = 20;
export const GoodsRequestConst = 21;
export const ReturnRequestConst = 22;
export const LowStockConst = 23;
export const GeneralSettings = 24;
export const BannerConst = 25;
export const AppSettingsConst = 26;
export const SalesReportsConst = 27;
export const OutWardReports = 28;
export const ReturnProductReports = 29;
export const ReportAndAnalytics = 30;
export const CustomerPurchaseBehaviourReport = 31;
export const GeographicSalesInsightReport = 32;
export const FrequentCustomerPurchasePatternAnalysisReport = 33;
export const ProductSalesPerformanceReport = 34;
export const BrandWiseSalesPerformanceReport = 35;
export const CategoryAndSubCategoryAnalysisReport = 36;
export const RevenueGenerationReport = 37;
export const InventoryStatusReport = 38;
export const AllReports = 39;
export const AllRecipesConst = 40;
export const SuggestProductConst = 41;
export const PickerConst = 42;
export const RefundReportConst = 44;
//Quantity Enum
export const CartonWithDozens = 1;
export const Dozen = 2;
export const Piece = 3;
export const CartonWithPieces = 4;
//remove
//export const FinanceManager = 3;
export const LoadingBayManager = 4;
//Google autocomplete apikey
export const APIkey = 'AIzaSyDE3R2LZH5QHNlzB-RUwOg6JAZIal_RRpk';
// Otp timer
export const OtpSeconds = 59;
//Address enum
//Buyer types
export const BuyerFeedback = 'buyerft1';
export const GuestFeedback = 'buyerbft2';
//Loading area item type
export const CategoryItem = 1;
export const SubCategoryItem = 2;
export const ProductItem = 3;
// Goods request status
export const RequestPending = 1;
export const RequestCompleted = 2;
export const RequestCancelled = 3;
//Return request enum
export const NewRequest = 1;
export const Collected = 2;
export const Arrived = 3;
export const Refunded = 4;
//Refund type enum
export const PartialRefund = 1;
export const FullRefund = 2;
//Coin uses
export const CoinsDeductedOnPlaceOrder = 'wd1';
export const CoinsAddedOnReturn = 'wc1';
export const CoinsAddedOnOrderCancellation = 'wc2';
export const CoinsAddedThroughReward = 'wc3';
//Placement enum
export const HomePagePlacement = 1;
export const CategoryPagePlacement = 2;
export const ProductPlacement = 3;
export const BrandPlacement = 4;
//Banner type
export const FixedBanner = 1;
export const DynamicBanner = 2;
//Active type
export const Activate = 1;
export const Deactivate = 2;
//Notification Type
export const General = 1;
export const ProductNotification = 2;
export const Cart = 3;
export const GuestUserNotification = 4;
//Apply discount to
export const ApplyToBrand = '1';
export const ApplyToCategory = '2';
export const ApplyToProduct = '3';
export const ApplyToCart = '4';
// Coupon discount type
export const FlatDiscount = '1';
export const PercentageDiscount = '2';
//CouponApplyTo
export const ApplyToAllProducts = '1';
export const ApplyToSpecificProducts = '2';
// Campaign type
export const DiscountCampaign = 1;
export const CouponCampaign = 2;
export const RewardCampaign = 3;
//FoodType
export const Veg = 1;
export const NonVeg = 2;
//Report type


// export const UEAT_URL = 'http://localhost:5173'
export const UEAT_URL = 'http://dev.admin.ueat.umart.tz'