/* eslint-disable jsx-a11y/anchor-is-valid */
import { Route, Routes } from 'react-router-dom';
import PaymentSuccess from './components/payment-success';
import { PaymentLayout } from './PaymentLayout';
const PaymentPage = () => (
  <Routes>
    <Route element={<PaymentLayout />}>
      <Route
        path="success"
        element={<PaymentSuccess />}
      />
      <Route
        index
        element={<PaymentSuccess />}
      />
    </Route>
  </Routes>
);
export { PaymentPage };
