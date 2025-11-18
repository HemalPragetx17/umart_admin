import { Navigate, Route, Routes } from 'react-router-dom';
import { PageLink, PageTitle } from '../../../umart_admin/layout/core';
import GeneralSettings from './general-settings';
import AllBanners from './banners/all-banners';
import AddBanner from './banners/add-banner';
import BannerDetails from './banners/banner-details';
import EditBanner from './banners/edit-banner';
import AppSettings from './app-settings';
const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/settings/general-settings',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
];
const Settings = () => {
  return (
    <Routes>
      <Route
        path="*"
        element={<Navigate to="/error/404" />}
      />
      <Route
        path="general-settings"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
              General Settings
            </PageTitle>
            <GeneralSettings />
          </>
        }
      />
      <Route
        path="banners"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Banners</PageTitle>
            <AllBanners />
          </>
        }
      />
      <Route
        path="banners/add-banner"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Add Banner</PageTitle>
            <AddBanner />
          </>
        }
      />
      <Route
        path="banners/banner-details"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Add Banner</PageTitle>
            <BannerDetails />
          </>
        }
      />
      <Route
        path="banners/edit-banner"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Add Banner</PageTitle>
            <EditBanner />
          </>
        }
      />
      <Route
        path="app-settings"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Add Settings</PageTitle>
            <AppSettings />
          </>
        }
      />
    </Routes>
  );
};
export default Settings;
