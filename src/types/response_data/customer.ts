export interface IGetCustomers {
  _id: string;
  email: string;
  regCompleted: boolean;
  addedByAdmin: boolean;
  createdAt: Date;
  name?: string;
  phoneCountry?: string;
  phone?: string;
}
export interface IGetCustomerProfile {
  user: UserProfile;
  totalOrders: number;
  totalOrderValue: number;
}
export interface UserProfile {
  _id: string;
  name: string;
  date:string;
  image:any;
  phoneCountry: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  regCompleted: boolean;
  deliveryAddresses: any[];
  assignedTo?: any;
}
