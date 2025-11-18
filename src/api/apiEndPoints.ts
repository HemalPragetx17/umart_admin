// API END Points
import * as constants from '../utils/constants';
/**---------------Authentication------------------------------ */
export const LOGIN = '_admin/login' + ' ' + constants.POST_RAW;
export const LOGOUT = '_admin/logout' + ' ' + constants.POST_RAW;
export const AUTH = {
  FORGOT_PASSWORD: '_admin/password/forgot' + ' ' + constants.POST_RAW,
  RESET_PASSWORD: '_admin/password/reset' + ' ' + constants.POST_RAW,
};
export const inventory = {
  warehouseList: '_product/warehouse/list' + ' ' + constants.GET_URL_PARAMS,
  initReceivedDirectGoods:
    '_product/manage/inventory/batches' + ' ' + constants.GET_URL_PARAMS,
  addToInventory:
    '_product/manage/inventory/update-multiple' + ' ' + constants.PATCH,
  inventoryStats:
    '_product/manage/inventory/stats' + ' ' + constants.GET_URL_PARAMS,
  listInventoryProduct:
    '_product/manage/inventory/v2/list' + ' ' + constants.GET_URL_PARAMS,
  listInventoryVarianTransaction:
    '_product/manage/inventory/transactions' +
    ' ' +
    constants.GET_URL_ID_PARAMS,
  variantRemainder:
    '_product/manage/inventory/reminder' +
    ' ' +
    constants.POST_URL_ENCODED_ID_PARAMS,
  variantExpiredStockList:
    '_product/manage/inventory/expiring-stock/list' +
    ' ' +
    constants.GET_URL_PARAMS,
  variantStockList:
    '_product/manage/inventory/in-stock' + ' ' + constants.GET_ID_PARAMS,
  variantUpdateInit:
    '_product/manage/inventory/update-init' + ' ' + constants.GET_ID_PARAMS,
  variantUpdate: '_product/manage/inventory/update' + ' ' + constants.PATCH_ID,
  getLoadingArea: '_admin/goods/goods-loading-areas' + ' ' + constants.GET,
  outOfStockProducts:
    '_product/reports/products-list/out-of-stock/v2' +
    ' ' +
    constants.GET_URL_PARAMS,
};
export const manageProductInventory = {
  listProduct:
    '_product/manage/inventory/list-product' + ' ' + constants.GET_URL_PARAMS,
};
export const master = {
  //Primary Category
  addCategory: '_admin/category' + ' ' + constants.POST_FORM,
  categoryList: '_admin/category' + ' ' + constants.GET_URL_PARAMS,
  editCategory: '_admin/category' + ' ' + constants.MULTI_PART_ID_PATCH,
  deleteCategory: '_admin/category' + ' ' + constants.DELETE_ID_PARAMS,
  // Sub Category
  addSubCategory: '_admin/category/sub' + ' ' + constants.POST_FORM,
  editSubCategory: '_admin/category/sub' + ' ' + constants.MULTI_PART_ID_PATCH,
  deleteSubCategory: '_admin/category/sub' + ' ' + constants.DELETE_ID_PARAMS,
  //Group Category
  addGroupCategory: '_admin/category/group' + ' ' + constants.POST_FORM,
  editGroupCategory:
    '_admin/category/group' + ' ' + constants.MULTI_PART_ID_PATCH,
  deleteGroupCategory:
    '_admin/category/group' + ' ' + constants.DELETE_ID_PARAMS,
  //Brands
  addBrands: '_product/default/brands' + ' ' + constants.POST_FORM,
  editBrands: '_product/default/brands' + ' ' + constants.MULTI_PART_ID_PATCH,
  listBrands: '_product/default/brands' + ' ' + constants.GET_URL_PARAMS,
  deleteBrand: '_product/default/brands' + ' ' + constants.DELETE_ID_PARAMS,
  //Product variants
  addVariants: '_product/default/variants' + ' ' + constants.POST_RAW,
  variantTiles: '_product/default/variants' + ' ' + constants.GET_URL_PARAMS,
  variantInfo: '_product/default/variants' + ' ' + constants.GET_URL_ID_PARAMS,
  editVariants: '_product/default/variants' + ' ' + constants.PATCH_ID,
  deleteSubCategoryVariants:
    '_product/default/variants' + ' ' + constants.DELETE_ID_PARAMS,
  deleteVariant: '_product/default/variants' + ' ' + constants.DELETE_ID_PARAMS,
  // roles and permission
  addRoles: '_admin/default/role' + ' ' + constants.POST_RAW,
  getRoles: '_admin/default/role' + ' ' + constants.GET_URL_PARAMS,
  getRoleDetails: '_admin/default/role' + ' ' + constants.GET_ID_PARAMS,
  editDetails: '_admin/default/role' + ' ' + constants.PATCH_ID,
  deleteRole: '_admin/default/role' + ' ' + constants.DELETE_ID_PARAMS,
  // user management
  addUser: '_admin/user_management' + ' ' + constants.POST_FORM,
  getUsers: '_admin/user_management' + ' ' + constants.GET_URL_PARAMS,
  updateUserStatus: '_admin/user_management/status' + ' ' + constants.PATCH_ID,
  deleteUser: '_admin/user_management' + ' ' + constants.DELETE_ID_PARAMS,
  getUserDetails: '_admin/user_management' + ' ' + constants.GET_ID_PARAMS,
  editUserDetails: '_admin/user_management' + ' ' + constants.PATCH_FORM_ID,
  //product zone
  addProductZone: '_admin/goods/goods-loading-areas' + ' ' + constants.POST_RAW,
  listProductZone:
    '_admin/goods/goods-loading-areas' + ' ' + constants.GET_URL_PARAMS,
  updateProductZone:
    '_admin/goods/goods-loading-areas' + ' ' + constants.PATCH_ID,
  deleteProductZone:
    '_admin/goods/goods-loading-areas' + ' ' + constants.DELETE_ID_PARAMS,
  listSearchTags:
    '_product/reports/searched-terms' + ' ' + constants.GET_URL_PARAMS,
};
export const product = {
  initProduct: '_product/product/init' + ' ' + constants.GET_URL_PARAMS,
  listProduct: '_product/product' + ' ' + constants.GET_URL_PARAMS,
  draftCount: '_product/product/draft/count' + ' ' + constants.GET,
  draftList: '_product/product/draft' + ' ' + constants.GET_URL_PARAMS,
  deleteProduct: '_product/product' + ' ' + constants.DELETE_ID_PARAMS,
  updateProductState:
    '_product/product/state/variant' +
    ' ' +
    constants.PATCH_FORM_ID_URL_ENCODED,
  productInfo: '_product/product' + ' ' + constants.GET_ID_PARAMS,
  productVariantInof:
    '_product/product/variant' + ' ' + constants.GET_ID_PARAMS,
  addProduct: '_product/product' + ' ' + constants.POST_FORM,
  initProductVariant:
    '_product/default/product-templates/init/variant' +
    ' ' +
    constants.GET_ID_PARAMS,
  editProduct: '_product/product' + ' ' + constants.PATCH_FORM_ID_URL_ENCODED,
  editProductVariant:
    '_product/product/variant' + ' ' + constants.PATCH_FORM_ID_URL_ENCODED,
  updateRatingStatus:
    '_product/manage/orders/order-rating' + ' ' + constants.PATCH_ID,
  deleteProductRating:
    '_product/manage/orders/order-rating' + ' ' + constants.DELETE_ID_PARAMS,
  updateSearchTags: '_product/product/search-tag' + ' ' + constants.PATCH_ID,
  getProductTitles:
    '_product/product/list-product-name' + ' ' + constants.GET_URL_PARAMS,
  getProductByCategoryForLoadingArea:
    '_product/product-zone/list-products' + ' ' + constants.GET_URL_PARAMS,
  updateLoadingArea: '_product/product-zone' + ' ' + constants.PATCH,
};
export const manageProduct = {
  listProduct:
    '_product/manage/business-products/list' + ' ' + constants.GET_URL_PARAMS,
  updateVariantStatus:
    '_product/manage/business-products/status/variant' +
    ' ' +
    constants.PATCH_FORM_ID_URL_ENCODED,
  listVariant:
    '_product/manage/business-products/list-variants' +
    ' ' +
    constants.GET_URL_PARAMS,
};
export const deliveryUser = {
  listDeliveryUser:
    '_deliveryBoy/manage-delivery-boys/list' + ' ' + constants.GET_URL_PARAMS,
  addDeliveryUser:
    '_deliveryBoy/manage-delivery-boys/add' + ' ' + constants.POST_FORM,
  updateStatus:
    '_deliveryBoy/manage-delivery-boys/status' + ' ' + constants.PATCH_ID,
  userDetails:
    '_deliveryBoy/manage-delivery-boys/info' + ' ' + constants.GET_ID_PARAMS,
  deleteDeliveryUser:
    '_deliveryBoy/manage-delivery-boys/profile' +
    ' ' +
    constants.DELETE_ID_PARAMS,
  editUserDetails:
    '_deliveryBoy/manage-delivery-boys/profile' + ' ' + constants.PATCH_FORM_ID,
  listDeliveryHistory:
    '_product/manage/orders/list' + ' ' + constants.GET_URL_PARAMS,
};
/**----------------------Orders and Delivery -------------------------*/
export const routesPlanning = {
  getPlan: '_product/manage/route-plans/list' + ' ' + constants.GET_URL_PARAMS,
  planInfo: '_product/manage/route-plans/info' + ' ' + constants.GET_ID_PARAMS,
  userInfo:
    '_product/manage/route-plans/route-user/info' +
    ' ' +
    constants.GET_URL_ID_PARAMS,
  updateStatus:
    '_product/manage/route-plans/route-user/order/variant/status' +
    ' ' +
    constants.PATCH_ID,
  updateDispatch:
    '_product/manage/route-plans/route-user/status' + ' ' + constants.PATCH_ID,
  deliverOrder:
    '_product/manage/route-plans/route-user/order/status' +
    ' ' +
    constants.POST_ID_PARAMS,
  orderPickedUp:
    '_product/manage/route-plans/route-user/order/picked-up' +
    ' ' +
    constants.PATCH_ID,
  outForDelivery:
    '_product/manage/route-plans/out-for-delivery' + ' ' + constants.PATCH_ID,
};
export const ordersDelivery = {
  list: '_product/manage/orders/list' + ' ' + constants.GET_URL_PARAMS,
  deliveryUsers:
    '_deliveryBoy/manage-delivery-boys/list' + ' ' + constants.GET_URL_PARAMS,
  orderInfo: '_product/manage/orders/info' + ' ' + constants.GET_ID_PARAMS,
  assignOrder:
    '_product/manage/orders/assign-delivery-boy' + ' ' + constants.PATCH_ID,
  getPlatformCharges: '_admin/default/fees-and-charges' + ' ' + constants.GET,
  listDeliveryHistory:
    '_product/manage/orders/list' + ' ' + constants.GET_URL_PARAMS,
  downloadInvoice:
    '_product/reports/orders/invoice-v3' + ' ' + constants.GET_ID_PARAMS,
  cancelOrder: '_product/manage/orders/cancel-order' + ' ' + constants.PATCH_ID,
  selfOrderGoodsDetails:
    '_product/manage/orders/self-pickedup/goods-loading' +
    ' ' +
    constants.GET_ID_PARAMS,
  selfOrderPackUnpack:
    '_product/manage/orders/self-pickedup' + ' ' + constants.PATCH_ID,
  selfOrderMarkDispatch:
    '_product/manage/orders/self-pickedup/status' + ' ' + constants.PATCH_ID,
  selftOrderDelivered:
    '_product/manage/orders/self-pickedup/delivered' +
    ' ' +
    constants.POST_ID_PARAMS,
  assignPicker:
    '_product/manage/orders/assign-picker' + ' ' + constants.PATCH_ID,
  editOrder: '_product/manage/orders/edit-order' + ' ' + constants.PATCH_ID,
  acceptEditOrder:
    '_product/manage/orders/edit-order-accept' + ' ' + constants.PATCH_ID,
  editedOrderList:
    '_product/manage/orders/list-edited' + ' ' + constants.GET_URL_PARAMS,
  rejectEditOrder:
    '_product/manage/orders/edit-order-reject' + ' ' + constants.PATCH_ID,
};
export const buyer = {
  customerList: '_buyer/manage-buyers/list' + ' ' + constants.GET_URL_PARAMS,
  customerInfo: '_buyer/manage-buyers/info' + ' ' + constants.GET_ID_PARAMS,
  updateStatus:
    '_buyer/manage-buyers/activate-deactivate' + ' ' + constants.PATCH_ID,
  orderList: '_product/manage/orders/list' + ' ' + constants.GET_URL_PARAMS,
  getOrderReport:
    '_admin/dashboard/order-report' + ' ' + constants.GET_URL_PARAMS,
  buyerOrderList:
    '_product/manage/orders/buyer-orders-list' + ' ' + constants.GET_URL_PARAMS,
  orderRefundsList:
    '_product/manage/orders/order-refunds' + ' ' + constants.GET_URL_PARAMS,
  walletHistoryList:
    '_product/manage/orders/wallet-history' + ' ' + constants.GET_URL_PARAMS,
  sendNotification:
    '_buyer/manage-buyers/send-notification' + ' ' + constants.POST_RAW,
  getBuyerCart: '_product/manage/buyers/carts' + ' ' + constants.GET_ID_PARAMS,
  getBuyerOrderedProduct:
    '_product/manage/orders/buyer-top-products' + ' ' + constants.GET_ID_PARAMS,
  updateCustomer: '_buyer/manage-buyers/edit' + ' ' + constants.PATCH_ID,
};
export const cmsPages = {
  getAboutUs: '_default/about-us' + ' ' + constants.GET,
  getPrivacyPolicy: '_default/privacy-policy' + ' ' + constants.GET,
  getTermsAndCondition: '_default/terms-conditions' + ' ' + constants.GET,
  addTermAndConditions: '_default/terms-conditions' + ' ' + constants.POST_RAW,
  addAboutUs: '_default/about-us' + ' ' + constants.POST_RAW,
  addPolicy: '_default/privacy-policy' + ' ' + constants.POST_RAW,
  addFaq: '_default/faq' + ' ' + constants.POST_RAW,
  editFaq: '_default/faq/update' + ' ' + constants.PATCH_ID,
  deleteFaq: '_default/faq/delete' + ' ' + constants.DELETE_ID_PARAMS,
  getFaqList: '_default/faq/list' + ' ' + constants.GET_URL_PARAMS,
  getRefundPolicy: '_default/refund-policy' + ' ' + constants.GET,
  addRefundPolicy: '_default/refund-policy' + ' ' + constants.POST_RAW,
};
export const settings = {
  getSettings:
    '_admin/default/fees-and-charges' + ' ' + constants.GET_URL_PARAMS,
  addSettings: '_admin/default/fees-and-charges' + ' ' + constants.PATCH,
  addAppSettings: '_admin/config/app-settings' + ' ' + constants.PATCH,
  getAppSettings: '_admin/config/app-settings' + ' ' + constants.GET_URL_PARAMS,
};
export const contactEnquiries = {
  getInquiryList:
    '_buyer/manage-buyers/feedback' + ' ' + constants.GET_URL_PARAMS,
  deleteFeedback:
    '_buyer/manage-buyers/feedback' + ' ' + constants.DELETE_ID_PARAMS,
};
export const loadingAreaEndPoints = {
  addLoadingArea: '_product/product-zone' + ' ' + constants.PATCH,
};
export const dashBoardEndPoints = {
  getActiveCustomers:
    '_admin/dashboard/active-customer-report' + ' ' + constants.GET_URL_PARAMS,
  getOrdersReports:
    '_admin/dashboard/order-report' + ' ' + constants.GET_URL_PARAMS,
  getInitData: '_admin/dashboard' + ' ' + constants.GET_URL_PARAMS,
  getSalesReport:
    '_admin/dashboard/sales-report-v2' + ' ' + constants.GET_URL_PARAMS,
  orderReportV2:
    '_admin/dashboard/order-report-v2' + ' ' + constants.GET_URL_PARAMS,
  categoryReport:
    '_admin/dashboard/category-report' + ' ' + constants.GET_URL_PARAMS,
  notificationList: '_admin/notifications' + ' ' + constants.GET_URL_PARAMS,
  markAsRead: '_admin/notifications' + ' ' + constants.PATCH,
  notifcationCount: '_admin/notifications-count' + ' ' + constants.GET,
};
export const returnRequestEndPoints = {
  getRequstList:
    '_product/manage/returned-products/list' + ' ' + constants.GET_URL_PARAMS,
  returnRequestDetails:
    '_product/manage/returned-products' + ' ' + constants.GET_ID_PARAMS,
  markAsArrived:
    '_product/manage/returned-products/mark-as-arrived' +
    ' ' +
    constants.PATCH_ID,
  makeRefund:
    '_product/manage/returned-products/mark-as-refunded' +
    ' ' +
    constants.PATCH_ID,
};
export const goodsRequests = {
  addGoodsRequest: '_product/goods-request' + ' ' + constants.POST_RAW,
  listGoodsRequest:
    '_product/goods-request/list' + ' ' + constants.GET_URL_PARAMS,
  goodsRequestInfo: '_product/goods-request' + ' ' + constants.GET_ID_PARAMS,
  changeStatus: '_product/goods-request/status' + ' ' + constants.PATCH_ID,
  downloadReport:
    '_product/goods-request/print' + ' ' + constants.GET_ID_PARAMS,
};
export const banners = {
  addBanner: '_product/manage/advertisements' + ' ' + constants.POST_FORM,
  bannersList:
    '_product/manage/advertisements/list' + ' ' + constants.GET_URL_PARAMS,
  bannerInfo:
    '_product/manage/advertisements/info' + ' ' + constants.GET_ID_PARAMS,
  updateBanner:
    '_product/manage/advertisements' + ' ' + constants.PATCH_FORM_ID,
  deleteBanner:
    '_product/manage/advertisements' + ' ' + constants.DELETE_ID_PARAMS,
  updateStatus:
    '_product/manage/advertisements/status' + ' ' + constants.PATCH_ID,
  updateSequence:
    '_product/manage/advertisements/sequence' + ' ' + constants.PATCH,
};
export const lowStockList = {
  addLowStock: '_product/manage/low-stock' + ' ' + constants.POST_RAW,
  listLowStock: '_product/manage/low-stock' + ' ' + constants.GET_URL_PARAMS,
  markAsOrdered: '_product/manage/low-stock' + ' ' + constants.PATCH_ID,
  lowStockInfo: '_product/manage/low-stock' + ' ' + constants.GET_ID_PARAMS,
  lowStockReport:
    '_product/manage/low-stock/report' + ' ' + constants.GET_URL_PARAMS,
};
export const reviewAndRatings = {
  reviewList: '_product/ratings-review' + ' ' + constants.GET_URL_PARAMS,
  updateStatus: '_product/ratings-review/status' + ' ' + constants.PATCH_ID,
  deleteReview: '_product/ratings-review' + ' ' + constants.DELETE_ID_PARAMS,
};
export const reports = {
  allCustomerReports:
    '_product/reports/all-customer' + ' ' + constants.POST_URL_PARAMS_WITH_DATA,
  singleCustomerReport:
    '_product/reports/customer' + ' ' + constants.GET_URL_ID_PARAMS,
  allProductsReport:
    '_product/reports/all-products' + ' ' + constants.POST_URL_PARAMS_WITH_DATA,
  singleProductsReport:
    '_product/reports/single-product' + ' ' + constants.GET_URL_ID_PARAMS,
  inventoryReport:
    '_product/reports/inventory' + ' ' + constants.GET_URL_PARAMS,
  orderReport: '_product/reports/order' + ' ' + constants.GET_URL_PARAMS,
  salesReport:
    '_product/reports/sales-report' + ' ' + constants.POST_URL_PARAMS_WITH_DATA,
  refundsReport:
    '_product/reports/customers-refunds' +
    ' ' +
    constants.POST_URL_PARAMS_WITH_DATA,
  geographicSalesReport:
    '_product/analytics/geographic-sales-insight' +
    ' ' +
    constants.GET_URL_PARAMS,
  areaBasedCustomerReport:
    '_product/analytics/area-based-customer-segmentation' +
    ' ' +
    constants.GET_URL_PARAMS,
  frequentCustomerReport:
    '_product/analytics/frequent-customer-purchase-pattern-analysis' +
    ' ' +
    constants.GET_URL_PARAMS,
  productSalesPerformaceReport:
    '_product/analytics/product-sales-performance' +
    ' ' +
    constants.GET_URL_PARAMS,
  brandWiseSalesReport:
    '_product/analytics/brand-wise-sales-performance' +
    ' ' +
    constants.GET_URL_PARAMS,
  categorySubCategoryReport:
    '_product/analytics/category-sub-category-sales-analysis' +
    ' ' +
    constants.GET_URL_PARAMS,
  revenueGenerationReport:
    '_product/analytics/revenue-generation' + ' ' + constants.GET_URL_PARAMS,
  productVariantInventoryReport:
    '_product/analytics/product-variant-inventory-status' +
    ' ' +
    constants.GET_URL_PARAMS,
  purchaseBehaviourReport:
    '_product/analytics/purchase-behaviour' + ' ' + constants.GET_URL_PARAMS,
  newProductReport:
    '_product/reports/products-list/full' + ' ' + constants.GET_URL_PARAMS,
  customerReport:
    '_product/reports/customers-report' + ' ' + constants.GET_URL_PARAMS,
  loginNoOrderReport:
    '_product/reports/customer-list/login-no-orders' +
    ' ' +
    constants.GET_URL_PARAMS,
  oneOrderReport:
    '_product/reports/customer-list/one-order' + ' ' + constants.GET_URL_PARAMS,
  noOrderLast15DaysReport:
    '_product/reports/customer-list/no-orders-from-15-days' +
    ' ' +
    constants.GET_URL_PARAMS,
  deliveryReport:
    '_product/reports/delivery-report' + ' ' + constants.GET_URL_PARAMS,
  customerOrderReport:
    '_product/reports/customer-order-report' + ' ' + constants.GET_URL_PARAMS,
  salesReportV2:
    '_product/reports/sales-report-v2' + ' ' + constants.GET_URL_PARAMS,
  inventoryReportV2:
    '_product/reports/inventory-report-v2' + ' ' + constants.GET_URL_PARAMS,
  inventoryAdjustmentReport:
    '_product/reports/inventory-adjustment-report' +
    ' ' +
    constants.GET_URL_PARAMS,
  deliveryTimeReport:
    '_product/reports/delivery-time-report' + ' ' + constants.GET_URL_PARAMS,
  buyerMigratedReport:
    '_product/reports/migrated-customer-report' +
    ' ' +
    constants.GET_URL_PARAMS,
  buyerMigrationCount:
    '_buyer/manage-buyers/migrated-buyers-count' +
    ' ' +
    constants.GET_URL_PARAMS,
};
export const promotionCampaign = {
  addDiscountPromotion:
    '_product/manage/promotion-campaign/discount-promotion' +
    ' ' +
    constants.POST_FORM,
  editDiscountPromotion:
    '_product/manage/promotion-campaign/discount-promotion' +
    ' ' +
    constants.PATCH_ID,
  listProductForPromotion:
    '_product/manage/promotion-campaign/list-products' +
    ' ' +
    constants.GET_URL_PARAMS,
  listPromotions:
    '_product/manage/promotion-campaign/list' + ' ' + constants.GET_URL_PARAMS,
  discountPromotionDetails:
    '_product/manage/promotion-campaign/discount-promotion' +
    ' ' +
    constants.GET_ID_PARAMS,
  updatePromotionStatus:
    '_product/manage/promotion-campaign/status' +
    ' ' +
    constants.PATCH_ID_URL_ENCODED,
  addReward:
    '_product/manage/promotion-campaign/reward' + ' ' + constants.POST_FORM,
  rewardDetails:
    '_product/manage/promotion-campaign/reward' + ' ' + constants.GET_ID_PARAMS,
  editReward:
    '_product/manage/promotion-campaign/reward' + ' ' + constants.PATCH_ID,
  addCoupon:
    '_product/manage/promotion-campaign/coupon' + ' ' + constants.POST_FORM,
  couponDetails:
    '_product/manage/promotion-campaign/coupon' + ' ' + constants.GET_ID_PARAMS,
  editCoupon:
    '_product/manage/promotion-campaign/coupon' + ' ' + constants.PATCH_ID,
  getAnalytics:
    '_product/manage/promotion-campaign/logs' + ' ' + constants.GET_URL_PARAMS,
  deletePromotion:
    '_product/manage/promotion-campaign/delete-promotion' +
    ' ' +
    constants.PATCH_ID,
};
export const salesReport = {
  list:
    '_product/reports/product-sales-report' + ' ' + constants.GET_URL_PARAMS,
  downloadSalesReport:
    '_product/reports/product-sales-report-excel' +
    ' ' +
    constants.GET_URL_PARAMS,
};
export const placeOrder = {
  sellableProduct: '_product/product/sellable' + ' ' + constants.GET_URL_PARAMS,
  customerAddress:
    '_buyer/manage-buyers/delivery-addresses' + ' ' + constants.GET_URL_PARAMS,
  sellableProductInfo: '_product/product/info' + ' ' + constants.GET_ID_PARAMS,
  getInitData: '_product/manage/orders/init' + ' ' + constants.GET,
  addNewAddress:
    '_buyer/manage-buyers/delivery-addresses' + ' ' + constants.POST_ID_PARAMS,
  getDisctricList: '_default/districts' + ' ' + constants.GET,
  placeNewOrder: '_product/manage/orders' + ' ' + constants.POST_RAW,
  checkStock: '_product/manage/orders/check-stock' + ' ' + constants.POST_RAW,
  deliverOrder:
    '_product/manage/orders/instant-order-delivered' +
    ' ' +
    constants.POST_ID_PARAMS,
  getCartDiscount:
    '_product/admin/promotion-campaign/cart-value-discount' +
    ' ' +
    constants.GET,
  getCouponList:
    '_product/admin/promotion-campaign/list' + ' ' + constants.GET_URL_PARAMS,
  addCustomers: '_buyer/manage-buyers/add' + ' ' + constants.POST_RAW,
};
export const financeReports = {
  outward:
    '_product/reports/finance-sales-report' + ' ' + constants.GET_URL_PARAMS,
  returnProductReport:
    '_product/reports/return-product' + ' ' + constants.GET_URL_PARAMS,
  refundReport:
    '_product/reports/get-pending-refund-request' +
    ' ' +
    constants.GET_URL_PARAMS,
  markAsRefund: '_product/manage/orders/refunded' + ' ' + constants.PATCH_ID,
};
export const recipeEndpoints = {
  initData: '_product/recipe/init' + ' ' + constants.GET,
  productList:
    '_product/product/list-products' + ' ' + constants.GET_URL_PARAMS,
  addRecipe: '_product/recipe' + ' ' + constants.POST_FORM,
  recipeList: '_product/recipe' + ' ' + constants.GET_URL_PARAMS,
  recipeTypesList:
    '_product/recipe/list-options' + ' ' + constants.GET_URL_PARAMS,
  recipeDetails: '_product/recipe' + ' ' + constants.GET_ID_PARAMS,
  deleteRecipeDetails: '_product/recipe' + ' ' + constants.DELETE_ID_PARAMS,
  updateRecipe: '_product/recipe' + ' ' + constants.PATCH_ID,
};
export const suggestedProduct = {
  listSuggestedProducts:
    '_buyer/suggested-products' + ' ' + constants.GET_URL_PARAMS,
  deletedSuggestion:
    '_buyer/suggested-products' + ' ' + constants.DELETE_ID_PARAMS,
};
export const pickerEndPoints = {
  addPicker: '_deliveryBoy/manage-pickers/add' + ' ' + constants.POST_FORM,
  listPicker:
    '_deliveryBoy/manage-pickers/list' + ' ' + constants.GET_URL_PARAMS,
  updatePicker:
    '_deliveryBoy/manage-pickers/profile' + ' ' + constants.PATCH_FORM_ID,
  updateStatus: '_deliveryBoy/manage-pickers/status' + ' ' + constants.PATCH_ID,
  getInfo: '_deliveryBoy/manage-pickers/info' + ' ' + constants.GET_ID_PARAMS,
  delete:
    '_deliveryBoy/manage-pickers/profile' + ' ' + constants.DELETE_ID_PARAMS,
};
