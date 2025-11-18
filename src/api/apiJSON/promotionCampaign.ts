import { ICouponData, IDiscountData, IRewardData } from '../../types';
import { IOption, IOptionWithImage } from '../../types/responseIndex';
import {
  ApplyToBrand,
  ApplyToCategory,
  ApplyToProduct,
  FlatDiscount,
  PercentageDiscount,
} from '../../utils/constants';
import Method from '../../utils/methods';
export const promotionCampaignApiJson = {
  addDiscountPromotion: (
    discountData: IDiscountData,
    brandList: IOptionWithImage[],
    categoryList: IOptionWithImage[],
    productList: IOptionWithImage[],
    simpleCategory: IOption[]
  ) => {
    const formData = new FormData();
    formData.append('title', discountData.title);
    formData.append('discountType', discountData.discountType);
    formData.append('applyDiscountTo', discountData.applyDiscountTo);
    formData.append(
      'startDate',
      Method.convertDateToFormat(discountData.startDate, 'YYYY-MM-DD')
    );
    formData.append(
      'endDate',
      Method.convertDateToFormat(discountData.endDate, 'YYYY-MM-DD')
    );
    formData.append('discountValue', discountData.discountValue);
    formData.append(
      'minPurchaseAmount',
      discountData?.minPurchaseAmount
        ? discountData.minPurchaseAmount
        : '0'
    );
    formData.append('description', discountData.description);
    formData.append('placement', discountData.placement);
    formData.append('image', discountData.imageReader);
    if (discountData.discountType === PercentageDiscount) {
      if (discountData.applyDiscountTo === ApplyToBrand) {
        brandList.forEach((item, index) => {
          formData.append(`brands[${index}][reference]`, item.value);
        });
      }
      if (discountData.applyDiscountTo === ApplyToCategory) {
        categoryList.forEach((item, index) => {
          formData.append(`categories[${index}][reference]`, item.value);
        });
      }
      if (discountData.applyDiscountTo === ApplyToProduct) {
        productList.forEach((item, index) => {
          formData.append(`variants[${index}][reference]`, item.value);
        });
      }
    }
    return formData;
  },
  addReward: (rewardData: IRewardData) => {
    const formData = new FormData();
    formData.append('title', rewardData.title);
    formData.append('discountType', '3');
    formData.append('applyDiscountTo', '4');
    formData.append(
      'startDate',
      Method.convertDateToFormat(rewardData.startDate, 'YYYY-MM-DD')
    );
    formData.append(
      'endDate',
      Method.convertDateToFormat(rewardData.endDate, 'YYYY-MM-DD')
    );
    formData.append('minPurchaseAmount', '0');
    formData.append('description', rewardData.description);
    formData.append('placement', rewardData.placement);
    formData.append('image', rewardData.imageReader);
    formData.append('redemptionLimit', '0');
    rewardData.purchaseRange.forEach((item, index) => {
      formData.append(`purchaseRanges[${index}][minOrderValue]`, item.min);
      formData.append(`purchaseRanges[${index}][maxOrderValue]`, item.max);
      formData.append(`purchaseRanges[${index}][coin]`, item.coins);
    });
    return formData;
  },
  addCoupon: (couponData: ICouponData, selectedProduct: IOptionWithImage[]) => {
    const formData = new FormData();
    formData.append('title', couponData.title);
    formData.append('discountType', couponData.type);
    formData.append('applyDiscountTo', '3');
    formData.append(
      'startDate',
      Method.convertDateToFormat(couponData.startDate, 'YYYY-MM-DD')
    );
    formData.append(
      'endDate',
      Method.convertDateToFormat(couponData.endDate, 'YYYY-MM-DD')
    );
    formData.append('discountValue', couponData.discountValue);
    formData.append('minPurchaseAmount', couponData.minPurchaseAmount);
    formData.append('description', couponData.description);
    formData.append('placement', couponData.placement);
    formData.append('redemptionLimit', couponData.redemptionLimit);
    if (couponData.imageReader) {
      formData.append('image', couponData.imageReader);
    } else {
      formData.append('image', couponData.image);
    }
    formData.append('couponCode', couponData.couponCode);
    selectedProduct.forEach((item, index) => {
      console.log(item.value, typeof item.value);
      if(item.value !== '0')
      formData.append(`variants[${index}][reference]`, item.value);
    });
    return formData;
  },
};
