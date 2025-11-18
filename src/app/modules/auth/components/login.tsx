/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useAuth } from '../core/Auth';
import { success } from '../../../../Global/toast';
import { Auth } from '../../../../utils/toast';
import { Authentication } from '../../../../utils/string';
import APICallService from '../../../../api/apiCallService';
import { APIJSON } from '../../../../api/apiJSON/auth';
import { LOGIN } from '../../../../api/apiEndPoints';
import EyeIcon from '../../../../umart_admin/assets/media/svg_uMart/view.svg';
import { KTSVG } from '../../../../umart_admin/helpers';
import EyeGreen from '../../../../umart_admin/assets/media/svg_uMart/eye-green.svg';
import { useSocket } from '../../socket/core/Socket';
const commonPasswords = ['password', '12345678'];
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      'Invalid email address'
    ),
  password: Yup.string()
    .min(8, 'Length should be minimum 8')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    //.matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/^\S*$/, 'Password must not contain spaces or special characters')
    .notOneOf(commonPasswords, 'Password is too common')
    .required('Password is required'),
});
const initialValues = {
  email: '',
  password: '',
};
export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { saveAuth, saveCurrentUser } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [formValues, setFormValues] = useState(initialValues);
  /* const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        let apiService = new APICallService(
          LOGIN,
          APIJSON.login({ email: values.email, password: values.password })
        );
        let response = await apiService.callAPI();
        if (response) {
          saveAuth(response.token);
          let user = response.user;
          saveCurrentUser(user);
          success(Auth.login);
        }
      } catch (error) {
        console.error(error);
        saveAuth(undefined);
        saveCurrentUser(undefined);
        setStatus('The login details are incorrect');
        setSubmitting(false);
        setLoading(false);
      }
      setLoading(false);
    },
  });*/
  /**
   * Dummy Login
   */
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting, setFieldValue }) => {
      setLoading(true);
      const apiService = new APICallService(
        LOGIN,
        APIJSON.login({ email: values.email, password: values.password })
      );
      const response = await apiService.callAPI();
      if (response) {
        saveAuth(response.token);
        saveCurrentUser(response.user);
        success(Auth.login);
        navigate('/dashboard');
      } else {
        setStatus('The login details are incorrect');
        saveAuth(undefined);
        saveCurrentUser(undefined);
      }
      setLoading(false);
      setSubmitting(false);
    },
  });
  return (
    <form
      className="form w-100 h-100 overflow-hidden"
      onSubmit={formik.handleSubmit}
      noValidate
      id="kt_login_signin_form"
    >
      <div className="d-flex flex-column flex-root bg-white">
        <div className="d-flex flex-column flex-lg-row-fluid py-10">
          <div className="text-left mb-6 pt-15">
            <h2 className="fs-35 fw-bolder text-dark mb-3">
              {Authentication.Login}
            </h2>
          </div>
          <div className="fv-row mb-3">
            <input
              placeholder="Email"
              {...formik.getFieldProps('email')}
              name="email"
              value={formik.values.email.trimStart()}
              onChange={(e) => {
                formik.handleChange(e);
              }}
              className={clsx(
                'form-control form-control-custom',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                }
              )}
              type="text"
              autoComplete="off"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="fv-plugins-message-container">
                <span className="text-danger fs-12 fw-bold">
                  {formik.errors.email}
                </span>
              </div>
            )}
          </div>
          <div className="fv-row mb-5">
            <div
              className={clsx(
                'input-group input-group-solid  border rounded  bg-light ',
                {
                  'border-danger':
                    formik.touched.password && formik.errors.password,
                },
                {
                  'is-valid':
                    formik.touched.password && !formik.errors.password,
                }
              )}
            >
              <input
                placeholder="Password"
                {...formik.getFieldProps('password')}
                value={formik.values.password.trimStart()}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                className={clsx('form-control form-control-custom')}
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                autoComplete="off"
              />
              <span
                className="input-group-text fs-1 fw-500 text-dark bg-light "
                id="basic-addon1"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <>
                    <img src={EyeGreen} />
                  </>
                ) : (
                  <img src={EyeIcon} />
                )}
              </span>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="fv-plugins-message-container mt-2">
                <span className="text-danger fs-12 fw-bold">
                  {formik.errors.password}
                </span>
              </div>
            )}
          </div>
          <div className="d-grid mb-6">
            <button
              type="submit"
              id="kt_sign_in_submit"
              className="btn btn-primary btn-lg min-h-lg-60px"
              disabled={formik.isSubmitting || !formik.isValid}
              // onClick={handleClick}
            >
              {!loading && (
                <span className="indicator-label fs-16 fw-bolder">
                  {Authentication.SignIn}
                </span>
              )}
              {loading && (
                <span
                  className="indicator-progress fs-16 fw-bold"
                  style={{ display: 'block' }}
                >
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
          </div>
          <div className="d-grid mb-10 mb-lg-20">
            <div className="d-flex flex-center">
              <Link
                to="/auth/forgot-password"
                className="text-dark fs-16 fw-normal"
              >
                {Authentication.ForgetPassword}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
