import { Route, Routes } from 'react-router-dom';
import { ForgotPassword } from './components/forgot-password';
import { ContactUs } from './components/contact-us';
import { CreatePassword } from './components/create-password';
import { Login } from './components/login';
import { AuthLayout } from './AuthLayout';
import VerifyOTP from './components/verify-otp';
const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route
        path="login"
        element={<Login />}
      />
      <Route
        path="contact-us"
        element={<ContactUs />}
      />
      <Route
        index
        element={<Login />}
      />
      <Route
        path="forgot-password"
        element={<ForgotPassword />}
      />
      <Route
        path="create-password"
        element={<CreatePassword />}
      />
      <Route
        path="verify-otp"
        element={<VerifyOTP />}
      />
    </Route>
  </Routes>
);
export { AuthPage };
