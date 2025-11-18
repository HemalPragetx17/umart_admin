import { useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Row, Col } from 'react-bootstrap';
import { Authentication } from '../../../../utils/string';
import APICallService from '../../../../api/apiCallService';
import { AUTH } from '../../../../api/apiEndPoints';
import { APIJSON } from '../../../../api/apiJSON/auth';
import { toast } from 'react-toastify';
import { Auth } from '../../../../utils/toast';
import { success } from '../../../../Global/toast';
const initialValues = {
  email: '',
};
const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      'Invalid email address'
    ),
});
export function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
      const data = { email: values.email };
      const apiService = new APICallService(
        AUTH.FORGOT_PASSWORD,
        APIJSON.forgotPassword(data)
      );
      const response = await apiService.callAPI();
      if (response) {
        success(Auth.optSent);
        navigate('/auth/verify-otp', { state: data });
      } else {
        setStatus('The login detail is incorrect');
      }
      // setTimeout(() => {
      //   requestPassword(values.email)
      //     .then(({ data: { result } }) => {
      //       setHasErrors(false);
      //       setLoading(false);
      //     })
      //     .catch(() => {
      //       setHasErrors(true);
      //       setLoading(false);
      //       setSubmitting(false);
      //       setStatus('The login detail is incorrect');
      //     });
      // }, 1000);
      setLoading(false);
      setSubmitting(false);
    },
  });
  return (
    <form
      className="form w-100"
      noValidate
      id="kt_login_password_reset_form"
      onSubmit={formik.handleSubmit}
    >
      <div
        className="d-flex flex-column flex-root bg-white"
        // style={{ height: '100vh' }}
      >
        <div className="d-flex flex-column flex-lg-row-fluid py-md-10 py-5 pb-0 align-items-center">
          {/* <div className="">
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
          </div> */}
          <div className="d-flex flex-center pt-lg-0 pt-15 flex-column ">
            <div className="w-lg-500px p-8 p-md-10 p-lg-15 mx-auto">
              <div className="form w-100">
                <div className="mb-4 text-center">
                  <h1 className="fs-35 fw-bolder text-dark mb-3">
                    {Authentication.ForgetPassword}
                  </h1>
                  <p className="text-black fs-16 fw-400">
                    {Authentication.ForgetText}
                  </p>
                </div>
                <Row>
                  <Col
                    lg={12}
                    className="mb-5"
                  >
                    <input
                      type="email"
                      placeholder="Email"
                      autoComplete="off"
                      {...formik.getFieldProps('email')}
                      className={clsx(
                        'form-control form-control-custom',
                        {
                          'is-invalid':
                            formik.touched.email && formik.errors.email,
                        },
                        {
                          'is-valid':
                            formik.touched.email && !formik.errors.email,
                        }
                      )}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.email}</span>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
                <Row className="lg-12">
                  <Col className="mb-3 mb-lg-0">
                    <button
                      type="submit"
                      id="kt_password_reset_submit"
                      className="btn btn-primary me-4 w-100 min-h-lg-60px min-h-55px"
                      disabled={
                        loading || formik.isSubmitting || !!formik.errors.email
                      }
                    >
                      {!loading && (
                        <span className="indicator-label">
                          {Authentication.Submit}
                        </span>
                      )}
                      {loading && (
                        <span
                          className="indicator-progress fs-12 fw-bold"
                          style={{ display: 'block' }}
                        >
                          {'Please wait...'}
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      )}
                    </button>
                  </Col>
                  {/* <Col lg={6}>
                    <Link to="/auth/login">
                      <button
                        type="button"
                        id="kt_login_password_reset_form_cancel_button"
                        className="btn btn-light w-100 min-h-lg-60px min-h-55px"
                        disabled={formik.isSubmitting || !formik.isValid}
                      >
                        Cancel
                      </button>
                    </Link>{' '}
                  </Col> */}
                </Row>
              </div>
            </div>
          </div>
          <div className="d-flex flex-center flex-wrap fs-6 py-5 pb-0">
            <div className="d-flex flex-center fs-16">
              {Authentication.GoBack}
              <Link
                to="/auth/login"
                className="text-primary fs-16 fw-bold"
              >
                &nbsp;Sign in
              </Link>
            </div>
          </div>
        </div>
        {hasErrors === true && (
          <div className="mb-lg-15 alert alert-danger">
            <div className="alert-text font-weight-bold">
              Sorry, looks like there are some errors detected, please try
              again.
            </div>
          </div>
        )}
        {hasErrors === false && (
          <div className="mb-10 bg-light-info p-8 rounded">
            <div className="text-info">
              Sent password reset. Please check your email
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
