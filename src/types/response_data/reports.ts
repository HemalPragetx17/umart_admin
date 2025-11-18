export interface IPendingRefundReport {
  _id: string;
  refKey: string;
  payment: {
    totalCharge: number;
  };
  customer: {
    name: string;
    reference: string;
  };
  address: {
    addressLine1: string;
    city: string;
    phone: string;
    phoneCountry: string;
  };
}
