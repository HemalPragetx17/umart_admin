import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../helpers';
import { useLayout } from '../../core';
import BurgurMenu from '../../../../umart_admin/assets/media/burgur-menu.svg';
import BrandLogo from '../../../../umart_admin/assets/media/uMart-logo.png';
const SidebarLogo = () => {
  const { config } = useLayout();
  const appSidebarDefaultMinimizeDesktopEnabled =
    config?.app?.sidebar?.default?.minimize?.desktop?.enabled;
  const appSidebarDefaultCollapseDesktopEnabled =
    config?.app?.sidebar?.default?.collapse?.desktop?.enabled;
  const toggleType = appSidebarDefaultCollapseDesktopEnabled
    ? 'collapse'
    : appSidebarDefaultMinimizeDesktopEnabled
    ? 'minimize'
    : '';
  const toggleState = appSidebarDefaultMinimizeDesktopEnabled ? 'active' : '';
  const appSidebarDefaultMinimizeDefault =
    config.app?.sidebar?.default?.minimize?.desktop?.default;
  return (
    <div
      className="app-sidebar-logo px-6"
      id="kt_app_sidebar_logo"
    >
      <Link to="/dashboard">
        {config.layoutType === 'dark-sidebar' ? (
          <img
            alt="Logo"
            src={BrandLogo}
            width={169}
            height="auto"
            className=" app-sidebar-logo-default"
          />
        ) : (
          <>
            <img
              alt="Logo"
              src={toAbsoluteUrl('/media/logos/default.svg')}
              className="h-25px app-sidebar-logo-default theme-light-show"
            />
            <img
              alt="Logo"
              src={toAbsoluteUrl('/media/logos/default-dark.svg')}
              className="h-25px app-sidebar-logo-default theme-dark-show"
            />
          </>
        )}
        {/* <img
          alt='Logo'
          src={toAbsoluteUrl('/media/logos/default-small.svg')}
          className='h-20px app-sidebar-logo-minimize'
        /> */}
      </Link>
      {(appSidebarDefaultMinimizeDesktopEnabled ||
        appSidebarDefaultCollapseDesktopEnabled) && (
        <div
          id="kt_app_sidebar_toggle"
          className={clsx(
            'app-sidebar-toggle btn btn-flush bg-transprant rotate',
            { active: appSidebarDefaultMinimizeDefault }
          )}
          data-kt-toggle="true"
          data-kt-toggle-state={toggleState}
          data-kt-toggle-target="body"
          data-kt-toggle-name={`app-sidebar-${toggleType}`}
        >
          <img
            src={BurgurMenu}
            className="h-34px w-34px rotate-180 d-none d-lg-flex"
            alt=""
          />
        </div>
      )}
    </div>
  );
};
export { SidebarLogo };
