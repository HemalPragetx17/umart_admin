import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../../../../umart_admin/assets/media/uMart-logo.png';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Authentication, String } from '../../../../utils/string';
import EyeIcon from '../../../../umart_admin/assets/media/svg_uMart/view.svg';
import EyeGreen from '../../../../umart_admin/assets/media/svg_uMart/eye-green.svg';
import clsx from 'clsx';
import APICallService from '../../../../api/apiCallService';
import { Auth } from '../../../../utils/toast';
import { AUTH } from '../../../../api/apiEndPoints';
import { error, success } from '../../../../Global/toast';
import { useAuth } from '../core/Auth';
const CreatePassword = () => {
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { saveAuth, saveCurrentUser } = useAuth();
  useEffect(() => {
    window.history.pushState(
      { name: 'browserBack' },
      'on browser back click',
      window.location.href
    );
    window.history.pushState(
      { name: 'browserBack' },
      'on browser back click',
      window.location.href
    );
    const onBackPress = (event: any) => {
      if (event.state) {
        navigate('/auth/login');
      }
    };
    window.addEventListener('popstate', onBackPress);
    return () => {
      window.removeEventListener('popstate', onBackPress);
    };
  }, []);
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.style.height = '100%';
    }
    return () => {
      // navigate('/auth/login');
      if (root) {
        root.style.height = 'auto';
      }
    };
  }, []);
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      // .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /^\S*$/,
        'Password must not contain spaces or special characters'
      )
      .notOneOf(['password', '12345678'], 'Password is too common')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      // .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /^\S*$/,
        'Password must not contain spaces or special characters'
      )
      .notOneOf(['password', '12345678'], 'Password is too common')
      .required('Password is required'),
  });
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      // navigate('/auth/login');
      if (values.password === values.confirmPassword) {
        setLoading(true);
        const params = {
          newPassword: values.password,
          code: state.code,
          email: state.email,
        };
        const apiService = new APICallService(AUTH.RESET_PASSWORD, params);
        const response = await apiService.callAPI();
        if (response) {
          //  success('Password reset successfully!');
          saveAuth(response.token);
          saveCurrentUser(response.user);
          success(Auth.login);
          navigate('/dashboard');
        }
        setLoading(false);
      } else {
        error('Password did not match !!');
      }
    },
  });
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };
  return (
    <div className="d-flex flex-column flex-root bg-white">
      <div className="d-flex flex-column align-items-center flex-lg-row-fluid py-10">
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
        <div className="d-flex flex-center pt-lg-0 pt-15 flex-column  flex-column-fluid">
          <div className="w-lg-475px p-8 p-md-10 p-lg-15 mx-auto">
            <form
              className="form w-100"
              action="/auth/login"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-4 text-center">
                <h1 className="text-dark fs-36 mb-3 fw-bold">
                  {Authentication.CreatePassword}
                </h1>
                <div className="text-dark fs-16 fw-500">
                  {Authentication.CreateText}
                  <br></br>
                </div>
              </div>
              <div className="d-flex flex-center flex-wrap fs-6 ">
                <div className="w-100">
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
              </div>
              <div className="d-flex flex-center flex-wrap fs-6 mt-5">
                <div className="w-100">
                  <div
                    className={clsx(
                      'input-group input-group-solid  border rounded  bg-light ',
                      {
                        'border-danger':
                          formik.touched.confirmPassword &&
                          formik.errors.confirmPassword,
                      },
                      {
                        'is-valid':
                          formik.touched.confirmPassword &&
                          !formik.errors.confirmPassword,
                      }
                    )}
                  >
                    <input
                      placeholder="Confirm password"
                      {...formik.getFieldProps('confirmPassword')}
                      value={formik.values.confirmPassword.trimStart()}
                      onChange={(e) => {
                        formik.handleChange(e);
                      }}
                      className={clsx('form-control form-control-custom')}
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      name="confirmPassword"
                      autoComplete="off"
                    />
                    <span
                      className="input-group-text fs-1 fw-500 text-dark bg-light "
                      id="basic-addon1"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {confirmPasswordVisible ? (
                        <>
                          <img src={EyeGreen} />
                        </>
                      ) : (
                        <img src={EyeIcon} />
                      )}
                    </span>
                  </div>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <div className="fv-plugins-message-container mt-2">
                        <span className="text-danger fs-12 fw-bold">
                          {formik.errors.confirmPassword}
                        </span>
                      </div>
                    )}
                </div>
              </div>
              <div className="text-center pt-3 mt-3">
                <button
                  type="submit"
                  id="kt_sign_in_submit"
                  className="btn btn-primary br-8 w-lg-375px h-60px"
                  disabled={!formik.isValid || loading}
                >
                  {!loading && (
                    <span className="indicator-label fs-16 fw-600">
                      {Authentication.CreatePasswordButton}
                    </span>
                  )}
                  {loading && (
                    <span
                      className="indicator-progress fs-16 fw-bold"
                      style={{ display: 'block' }}
                    >
                      {String.pleaseWait}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="d-flex flex-center flex-wrap fs-6 p-5 pb-0">
          <div className="d-flex flex-center  fs-16">
            <span>
              {Authentication.GoBack}
              <Link
                to="/auth/login"
                className="text-primary fs-16 fw-500"
              >
                &nbsp;Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export { CreatePassword };
