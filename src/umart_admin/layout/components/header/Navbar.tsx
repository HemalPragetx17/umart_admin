import clsx from 'clsx';
import { toAbsoluteUrl } from '../../../helpers';
import { HeaderNotificationsMenu, HeaderUserMenu } from '../../../partials';
// import { useLayout } from '../../core'
// Media
import NotificationSVG from '../../../../umart_admin/assets/media/svg_uMart/bell.svg';
import { getAuth, useAuth } from '../../../../app/modules/auth';
import { UEAT_URL } from '../../../../utils/constants';
import { useEffect, useRef, useState } from 'react';
import APICallService from '../../../../api/apiCallService';
import { dashBoardEndPoints } from '../../../../api/apiEndPoints';
const itemClass = 'ms-1 ms-lg-3';
const btnClass = 'btn btn-icon btn-custom btn-icon-muted';
const userAvatarClass =
  'symbol-40px symbol-md-45px symbol-lg-50px symbol-circle';
// const btnIconClass = 'svg-icon-1'
const Navbar = () => {
  // const { config } = useLayout()
  const [showNotifications, setShowNotifications] = useState(false);
  const { currentUser } = useAuth();
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    (async () => {
      await fethcNotificationCount();
    })();
  }, []);
  useEffect(() => {
    if (showNotifications) {
      document.addEventListener('click', handleClickOutSide);
    } else {
      document.removeEventListener('click', handleClickOutSide);
    }
    return () => {
      document.removeEventListener('click', handleClickOutSide);
    };
  }, [showNotifications]);

  const fethcNotificationCount = async () => {
    const apiCallService = new APICallService(
      dashBoardEndPoints.notifcationCount
    );
    const response = await apiCallService.callAPI();
    if (response) {
      setCount(response?.unreadItems?.length || 0);
    }
  };
  const handleMarkAsRead = async () => {
    const apiCallService = new APICallService(dashBoardEndPoints.markAsRead);
    const response = await apiCallService.callAPI();
    if (response) {
      await fethcNotificationCount();
    }
  };
  const handleToggle = () => {
    const token = getAuth();
    const url = `${UEAT_URL}?token=${token}`;
    window.open(url, '_blank');
  };
  const handleClickOutSide = (event: any) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };
  return (
    <div className="app-navbar flex-shrink-0">
      <div className={clsx('app-navbar-item', itemClass)}>
        <div className="d-flex bg-light rounded-pill px-5 py-2 align-items-center position-relative me-5 fw-500">
          <div
            className={`fs-14 px-5 py-3 rounded-pill me-3 cursor-pointer custom-slider-tab bg-primary text-white`}
          >
            U-Mart
          </div>
          <div
            className={`fs-14 px-5 py-3 rounded-pill me-3 cursor-pointer custom-slider-tab text-black`}
            onClick={() => handleToggle()}
          >
            U-Eat
          </div>
        </div>
        <div ref={notificationRef}>
          <div className={btnClass}>
            <div className="position-relative">
              <img
                className="img-fluid cursor-pointer"
                src={NotificationSVG}
                alt=""
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  handleMarkAsRead();
                }}
              />
              {count ? (
                <span
                  className="bullet bullet-dot bg-success position-absolute translate-end top-10 start-400 animation-blink"
                  style={{
                    top: '-3px',
                    right: '-3px',
                    height: '7px',
                    width: '7px',
                  }}
                ></span>
              ) : (
                <></>
              )}
            </div>
          </div>
          {showNotifications && (
            <HeaderNotificationsMenu show={showNotifications} />
          )}
        </div> 
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
        >
          <div className="symbol  symbol-50px symbol-circle ">
            <div className="symbol-label fs-1 fw-bold bg-light-primary text-primary fw-700">
              {currentUser?.name[0] || 'A'}
            </div>
          </div>
        </div>
        <HeaderUserMenu />
      </div>
    </div>
  );
};
export { Navbar };
