import { useEffect, useState } from 'react';
import { SidebarMenuMain } from './SidebarMenuMain';
const SidebarMenu = () => {
  const [maxSidebarHeight, setHeight] = useState<any>('auto');
  useEffect(() => {
    // Calculate the maximum height based on the window's height
    const windowHeight = window.innerHeight;
    let temp = windowHeight - 120 - 0; // Adjust this based on your header and footer height
    setHeight(temp);
  }, []);
  return (
    <div className="app-sidebar-menu overflow-hidden flex-column-fluid">
      <div
        id="kt_app_sidebar_menu_wrapper"
        className="app-sidebar-wrapper hover-scroll-overlay-y my-5"
        data-kt-scroll="true"
        data-kt-scroll-activate="true"
        data-kt-scroll-height="auto"
        data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
        data-kt-scroll-wrappers="#kt_app_sidebar_menu"
        data-kt-scroll-offset="5px"
        data-kt-scroll-save-state="true"
        style={{ height: maxSidebarHeight }}
      >
        <div
          className="menu menu-column menu-rounded menu-sub-indention px-3"
          id="#kt_app_sidebar_menu"
          data-kt-menu="true"
          data-kt-menu-expand="false"
        >
          <SidebarMenuMain />
        </div>
      </div>
    </div>
  );
};
export { SidebarMenu };
