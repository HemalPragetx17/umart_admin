/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import BrandLogo from '../../../umart_admin/assets/media/uMart-logo.png';
const AuthLayout = () => {
  // useEffect(() => {
  //   const root = document.getElementById('root');
  //   if (root) {
  //     root.style.height = '100%';
  //   }
  //   return () => {
  //     if (root) {
  //       root.style.height = 'auto';
  //     }
  //   };
  // }, []);
  return (
    <div className="d-flex flex-column flex-lg-row flex-column-fluid ">
      <div
        className="d-flex flex-column flex-lg-row-fluid pt-lg-20 w-lg-50 bg-body order-2 overflow-lg-hidden position-relative"
        style={{ height: '100vh' }}
      >
        <div
          className="d-flex flex-center flex-column flex-lg-row-fluid h-100vh"
          style={{ height: '100vh' }}
        >
          <div className="w-lg-425px pt-10">
            <Outlet />
          </div>
        </div>
        {/* <div className="d-flex flex-center flex-wrap px-5">
          <div className="text-gray-500 text-center fw-semibold fs-6">
            Don’t have an account?{' '}
            <Link
              to="/auth/registration"
              className="link-primary"
            >
              Sign up
            </Link>
          </div>
        </div> */}
      </div>
      <div className="d-flex flex-lg-row-fluid w-lg-50 bg-light-primary order-1 position-relative">
        <div className="d-flex flex-column flex-center py-15 px-5 px-md-15 w-100">
          <div className="mb-lg-0 mb-md-5 mb-10">
            <Link
              to="/"
              className="mb-12 position-absolute top-0 start-0 mt-10 ms-10"
            >
              <img
                alt="Logo"
                src={BrandLogo}
                className="h-40px"
              />
            </Link>
          </div>
          <div className="d-flex flex-center flex-column flex-lg-row-fluid">
            <div className="mx-auto w-275px w-md-75 w-xl-500px">
              <div>
                <h1 className="pt-3 fs-42 lh-1n2 fw-600">
                  “If you are not taking care of your customers, your competitor
                  will”
                </h1>
                <span className="text-muted fw-600 fs-28 text-align-left text-italic">
                  Bob Hooey
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export { AuthLayout };
