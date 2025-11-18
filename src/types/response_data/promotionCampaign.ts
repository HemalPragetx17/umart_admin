export interface IPromotionCampaign {
  _id: string;
  active: boolean;
  deleted: boolean;
  endDate: string;
  expired: string;
  image: string;
  startDate: string;
  title: string;
  type: 'discount' | 'coupon' | 'reward';
}
interface ICommonDetails {
  _id: string;
  active: boolean;
  deleted: boolean;
  endDate: string;
  expired: string;
  image: string;
  startDate: string;
  title: string;
  applyDiscountTo: string;
  description: string;
  discountType: number;
  discountValue: number;
  minimumPurchaseAmount: number;
  placement: number;
  redemptionLimit: number;
  totalDiscount:number;
}
export interface IDiscountPromotionDetails extends ICommonDetails {
 
  type: string;
  brands: any;
  categories: any;
  variants: any;
}
export interface IRewardDetails extends ICommonDetails{

  type: string;
  purchaseRanges: {
    minOrderValue: number;
    maxOrderValue: number;
    coin: number;
  }[];
}
export interface ICouponDetails extends ICommonDetails{
  type: string;
  variants: any;
}

export interface IAnalytics {
  campaignType: number;
  customer: {
    image: string;
    name: string;
    reference: string;
  };
  discountValue: number;
  redemptionLimit: number;
  totalRedemptions: number;
  _createdAt: string;
  _id:string;
}