export interface IDiscountData {
  discountType: string;
  title: string;
  startDate: any;
  endDate: any;
  discountValue: string;
  image: string;
  imageReader: any;
  minPurchaseAmount: string;
  description: string;
  placement: string;
  applyDiscountTo: string;
}
export interface IPurchaseRange {
  min: string;
  max: string;
  coins: string;
}
export interface IRewardData {
  title: string;
  startDate: any;
  endDate: any;
  purchaseRange: IPurchaseRange[];
  description: string;
  placement: string;
  image: string;
  imageReader: any;
}
export interface ICouponData {
  type: string;
  title: string;
  startDate: any;
  endDate: any;
  couponCode: string;
  redemptionLimit: string;
  discountValue: string;
  minPurchaseAmount: string;
  description: string;
  placement: string;
  couponApplyTo: string;
  image: string;
  imageReader: any;
}
