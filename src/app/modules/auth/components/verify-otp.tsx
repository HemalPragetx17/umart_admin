/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OtpInput from '../../../custom/otp-input/otp-input';
import BrandLogo from '../../../../umart_admin/assets/media/uMart-logo.png';
import { Authentication } from '../../../../utils/string';
import { useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import APICallService from '../../../../api/apiCallService';
import { AUTH } from '../../../../api/apiEndPoints';
import { APIJSON } from '../../../../api/apiJSON/auth';
import { success } from '../../../../Global/toast';
import { Auth } from '../../../../utils/toast';
import { OtpSeconds } from '../../../../utils/constants';
const VerifyOTP = () => {
  const { state }: any = useLocation();
  const navigate = useNavigate();
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
      if (root) {
        root.style.height = 'auto';
      }
    };
  }, []);
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState<any>('');
  const [seconds, setSeconds] = useState(OtpSeconds);
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        const temp = seconds;
        setSeconds(temp - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [seconds]);
  const onChange = (value: string) => {
    setOtp(value);
  };
  const handleResendOtp = async () => {
    const data = { email: state?.email || '' };
    const apiService = new APICallService(
      AUTH.FORGOT_PASSWORD,
      APIJSON.forgotPassword(data)
    );
    const response = await apiService.callAPI();
    if (response) {
      success(Auth.optSent);
      setSeconds(OtpSeconds);
      // navigate('/auth/verify-otp', { state: data });
    }
  };
  const isOtpEmpty = otp.length === 4;
  return (
    <div className="d-flex flex-column flex-root bg-white ">
      <div className="d-flex flex-column align-items-center flex-lg-row-fluid py-10">
        <div className="">
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
        <div className="d-flex flex-center pt-lg-0 pt-15 flex-column flex-column-fluid">
          <div className="w-lg-550px p-8 p-md-10 p-lg-15 ">
            <form
              className="form w-100"
              action="/auth/create-password"
            >
              <div className="mb-6 text-center">
                <h1 className="fs-35 fw-bolder text-dark mb-3 ">
                  {Authentication.Verify}
                </h1>
                <div className="text-black fs-16 fw-400">
                  {/* We’ve sent an OTP to <span>wadsworth@email.com.</span>
                                    Please enter it below to reset the password. */}
                  {`We’ve sent an OTP to ${state?.email || ''}`}
                  <br></br>
                  {Authentication.VText}
                </div>
              </div>
              <div className="d-flex flex-wrap mb-2 justify-content-center">
                <div className="d-flex flex-wrap ">
                  <OtpInput
                    value={otp}
                    valueLength={6}
                    onChange={onChange}
                    inputRefs={inputRefs}
                  />
                </div>
              </div>
              <div className="text-center pt-7">
                <button
                  type="submit"
                  //id="kt_sign_in_submit
                  onClick={() => {
                    navigate('/auth/create-password', {
                      state: {
                        code: otp.join(''),
                        email: state?.email || '',
                      },
                    });
                  }}
                  className="btn btn-primary br-8 w-lg-375px w-xs-95px w-md-375px  h-60px"
                  disabled={!isOtpEmpty}
                >
                  {/* <span className='indicator-progress' style={{display: 'block'}}>
                                        Please wait...
                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span> */}
                  <span className="indicator-label fs-16 fw-600">
                    {Authentication.Verify}
                  </span>
                </button>
              </div>
              <div className="fs-14 fw-400 text-center pt-3">
                {seconds > 0 ? (
                  <>
                    {Authentication.ResendOtp}{' '}
                    <span>
                      00:{seconds < 10 && 0}
                      {seconds}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      <Nav.Link
                        href="#"
                        onClick={handleResendOtp}
                      >
                        Resend Otp
                      </Nav.Link>
                    </span>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="d-flex flex-center flex-wrap fs-6 p-5 pb-0">
          <div className="d-flex flex-center fs-16">
            <span>
              {Authentication.GoBack}
              <Link
                to="/auth/login"
                className="text-primary fs-16 fw-500"
              >
                &nbsp;{Authentication.SignIn}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VerifyOTP;
