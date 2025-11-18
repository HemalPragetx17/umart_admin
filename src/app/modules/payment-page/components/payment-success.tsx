import Logo from '../../../../umart_admin/assets/media/uMart-logo.png';
const PaymentSuccess = () => {
  return (
    <>
      {/* begin::Title */}
      <img
        src={Logo}
        alt="Umart_Logo"
        className="logo h-60px mb-6"
      ></img>
      <h1
        className="fw-bolder fs-1hx mb-4"
        style={{ color: '#5bbe30' }}
      >
        Payment Successful
      </h1>
      {/* end::Title */}
      {/* begin::Text */}
      <div className="fw-semibold fs-15 text-dark-500 mb-7">
        Thank you for your payment! Your transaction was successful.
      </div>
      {/* end::Text */}
      {/* begin::Illustration */}
      <div className="fw-semibold fs-15 text-dark-500 mb-7">
        We appreciate your business.
      </div>
      <div className="fw-semibold fs-15 text-dark-500 mb-7">
        If you have any questions, please contact our customer support.
      </div>
      {/* end::Illustration */}
      {/* begin::Link */}
    </>
  );
};
export default PaymentSuccess;
