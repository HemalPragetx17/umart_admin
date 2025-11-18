export interface AuthModel {
  token: string;
}
export interface UserModel {
  name: string;
  image: string;
  userType: number;
  active: boolean;
  roleAndPermission?: any;
  phoneCountry: string;
  phone: string;
  email: string;
}
