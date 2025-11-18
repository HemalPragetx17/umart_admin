export const instantOrderApiJson = {
  placeOrder: (
    products: any,
    customer: any,
    rewardDetails: any,
    campaign: any
  ) => {
    let data: any = {
      buyer: customer.value,
      instantOrder: true,
      paymentMode: 1,
      variants: products.map((item: any) => ({
        variant: item._id,
        quantityType: item?.quantityTypes[0]?.type,
        stockCount:
          item?.isDiscountByQuantity && item?.bunchObj
            ? item.quantityTypes[0]['discountsByQuantities'][
                item?.bunchObj?.index
              ]['stockCount'] * item?.bunchObj?.quantity
            : item?.quantityTypes[0]?.stockCount,
        discountByQuantitiesEnabled:
          item?.isDiscountByQuantity && item?.bunchObj ? true : false,
        bundleSize:
          item?.isDiscountByQuantity && item?.bunchObj
            ? item?.bunchObj?.quantity || 0
            : 0,
        totalBundle:
          item?.isDiscountByQuantity && item?.bunchObj
            ? item.quantityTypes[0]['discountsByQuantities'][
                item?.bunchObj?.index
              ]['stockCount'] || 0
            : 0,
      })),
    };
    if (rewardDetails) {
      data = {
        ...data,
        reward: rewardDetails,
      };
    }
    if (campaign) {
      data = {
        ...data,
        campaign,
      };
    }
    return data;
  },
};
