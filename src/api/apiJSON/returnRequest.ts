import { IRefundDataType } from '../../types';
import { FullRefund } from '../../utils/constants';
export const returnRequestJson = {
  makeRefundJson: (data: IRefundDataType) => {
    const params: any = { ...data };
    params.variants = params.variants.map((item: any) => {
      if (item.refundType === FullRefund) {
        return {
          variant: item.variant,
          refundType: item.refundType,
          refundAmount: parseInt(item.refundAmountFull),
          message: '',
          name: item.name,
        };
      } else {
        return {
          variant: item.variant,
          refundType: item.refundType,
          refundAmount: parseInt(item.refundAmountPartial),
          message: item.message,
          name: item.name,
        };
      }
    });
    return params;
  },
};
