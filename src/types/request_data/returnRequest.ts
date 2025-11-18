interface IRefundVariant {
  variant: string;
  refundType: any;
  refundAmountFull: number | string;
  refundAmountPartial: any;
  message?: string;
  name:string;
}
export interface IRefundDataType {
  password: string;
  variants: Array<IRefundVariant>;
}
