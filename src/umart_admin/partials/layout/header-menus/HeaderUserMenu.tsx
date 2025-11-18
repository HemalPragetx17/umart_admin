/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../app/modules/auth';
import { Languages } from './Languages';
import { toAbsoluteUrl } from '../../../helpers';
import APICallService from '../../../../api/apiCallService';
import { APIJSON } from '../../../../api/apiJSON/auth';
import { LOGOUT } from '../../../../api/apiEndPoints';
import { String } from '../../../../utils/string';
const HeaderUserMenu: FC = () => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleLogout = async (e: any) => {
    e.preventDefault(); // Prevent the default behavior (e.g., navigation)
    e.stopPropagation();
    setLoading(true);
    let apiService = new APICallService(LOGOUT);
    await apiService.callAPI();
    await logout();
    setLoading(false);
  };
  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-900 menu-state-bg menu-state-primary fw-500  fs-16 w-160px py-2"
      data-kt-menu="true"
    >
      <div className="menu-item ">
        <a
          onClick={handleLogout}
          className="menu-link px-5 bg-white text-black"
        >
          {loading ? (
            <span
              className="indicator-progress fs-16 fw-bold  w-100 text-center"
              style={{ display: 'block' }}
            >
              {String.pleaseWait}
              <span className="spinner-border spinner-border-sm align-middle ms-2 "></span>
            </span>
          ) : (
            <span className="ps-3"> Sign Out</span>
          )}
        </a>
      </div>
    </div>
  );
};
export { HeaderUserMenu };
