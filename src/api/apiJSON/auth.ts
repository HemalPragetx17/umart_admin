import { ILoginData, IForgotPassword } from '../../types';
export const APIJSON = {
  login: ({ email, password }: ILoginData) => {
    return {
      email: email,
      password: password,
    };
  },
  forgotPassword: ({ email }: IForgotPassword) => {
    return {
      email: email,
    };
  },
};
