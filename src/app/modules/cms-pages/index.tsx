import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { PageLink, PageTitle } from '../../../umart_admin/layout/core';
import Faqs from './faqs/faqs';
import PrivacyPolicy from './privacy-policy';
import AboutUs from './about-us';
import TermsConditions from './terms-condition';
import RefundPolicy from './refund-policy';
const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/cms-pages',
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
const CmsPages = () => {
  return (
    <Routes>
      <Route
        path="*"
        element={<Navigate to="/error/404" />}
      />
      <Route
        index
        element={<Navigate to="/cms-pages" />}
      />
      <Route
        path="faqs"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>FAQs</PageTitle>
            <Faqs />
          </>
        }
      />
      <Route
        path="about-us"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>About Us</PageTitle>
            <AboutUs />
          </>
        }
      />
      <Route
        path="privacy-policy"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
              Privacy Policy
            </PageTitle>
            <PrivacyPolicy />
          </>
        }
      />
      <Route
        path="refund-policy"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
              Refund Policy
            </PageTitle>
            <RefundPolicy />
          </>
        }
      />
      <Route
        path="terms-conditions"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
              Terms and Conditions
            </PageTitle>
            <TermsConditions />
          </>
        }
      />
    </Routes>
  );
};
export default CmsPages;
