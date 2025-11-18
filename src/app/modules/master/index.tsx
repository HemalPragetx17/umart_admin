import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AllCategories from './category/AllCategories';
import AddSubCategories from './category/add-sub-categories';
import AddPrimaryCategories from './category/add-primary-categories';
import { PageLink, PageTitle } from '../../../umart_admin/layout/core';
import AddGroupCategories from './category/add-group-categories';
import EditPrimaryCategory from './category/edit-primary-categories';
import EditSubCategories from './category/edit-sub-categories';
import EditGroupCategories from './category/edit-group-categories';
import AddBrand from './brands/add-brand';
import Brands from './brands/brands';
import EditBrand from './brands/edit-brand';
import ViewProductVariants from './product-variants/view-product-variants';
import AddProductVariants from './product-variants/add-product-variants';
import EditProductVariant from './product-variants/edit-product-variants';
import DeliveryUser from './delivery-user/all-delivery-user';
import DeliveryProfile from './delivery-user/delivery-profile';
import AddDeliveryUser from './delivery-user/add-delivery-user';
import EditDeliveryUser from './delivery-user/edit-delivery-user';
import GoodsLoadingArea from './loading-area/loading-area';
import AddNewUser from './user-management/add-new-user';
import ViewUserDetails from './user-management/view-user-details';
import EditUser from './user-management/edit-user';
import RolesPermission from './roles-permission/roles-permission';
import AddNewRole from './roles-permission/add-new-role';
import EditRole from './roles-permission/edit-role';
import AllBanners from '../settings/banners/all-banners';
import AddBanner from '../settings/banners/add-banner';
import BannerDetails from '../settings/banners/banner-details';
import EditBanner from '../settings/banners/edit-banner';
import ProductZone from './product-zone/product-zone';
import AddProductZone from './product-zone/add-product-zone';
import EditProductZone from './product-zone/edit-product-zone';
import AssignProductZones from './loading-area/assign-product-zone';
import AllPicker from './picker/all-picker';
import AddPicker from './picker/add-picker';
import EditPicker from './picker/edit-picker';
import PickerDetails from './picker/picker-details';
const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/master/category',
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
const ProfilePage = () => (
  <Routes>
    <Route
      element={
        <>
          <Outlet />
        </>
      }
    >
      <Route
        path="*"
        element={<Navigate to="/error/404" />}
      />
      <Route
        path="categories"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <AllCategories />
          </>
        }
      />
      <Route
        path="add-primary-categories"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <AddPrimaryCategories />
          </>
        }
      />
      <Route
        path="add-sub-categories"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <AddSubCategories />
          </>
        }
      />
      <Route
        path="add-group-categories"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <AddGroupCategories />
          </>
        }
      />
      <Route
        path="edit-primary-categories"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <EditPrimaryCategory />
          </>
        }
      />
      <Route
        path="edit-sub-categories"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <EditSubCategories />
          </>
        }
      />
      <Route
        path="edit-group-categories"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <EditGroupCategories />
          </>
        }
      />
      <Route
        path="brands"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Brands</PageTitle>
            <Brands />
          </>
        }
      />
      <Route
        path="brands/add-brand"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Brands</PageTitle>
            <AddBrand />
          </>
        }
      />
      <Route
        path="brands/edit-brand"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Edit Brands</PageTitle>
            <EditBrand />
          </>
        }
      />
      <Route
        path="product-variants"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
              Product Variants
            </PageTitle>
            <ViewProductVariants />
          </>
        }
      />
      <Route
        path="product-variants/add-product-variants"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <AddProductVariants />
          </>
        }
      />
      <Route
        path="product-variants/edit-product-variants"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <EditProductVariant />
          </>
        }
      />
      <Route
        path="roles-permissions"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <RolesPermission />
          </>
        }
      />
      <Route
        path="roles-permissions/add-new-role"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <AddNewRole />
          </>
        }
      />
      <Route
        path="roles-permission/edit-role"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <EditRole />
          </>
        }
      />
      <Route
        path="user-management"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <ViewUserDetails />
          </>
        }
      />
      <Route
        path="user-management/add-new-user"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <AddNewUser />
          </>
        }
      />
      <Route
        path="user-management/edit-new-user"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <EditUser />
          </>
        }
      />
      <Route
        path="loading-area"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <GoodsLoadingArea />
          </>
        }
      />
      <Route
        path="delivery-users"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <DeliveryUser />
          </>
        }
      />
      <Route
        path="delivery-users/add-delivery-user"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <AddDeliveryUser />
          </>
        }
      />
      <Route
        path="delivery-users/profile"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <DeliveryProfile />
          </>
        }
      />
      <Route
        path="delivery-users/edit-delivery-user"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <EditDeliveryUser />
          </>
        }
      />
      <Route
        path="product-zones"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Product Zone</PageTitle>
            <ProductZone />
          </>
        }
      />
      <Route
        path="product-zones/add-product-zone"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
              Add Product Zone
            </PageTitle>
            <AddProductZone />
          </>
        }
      />
      <Route
        path="product-zones/edit-product-zone"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
              Edit Product Zone
            </PageTitle>
            <EditProductZone />
          </>
        }
      />
      <Route
        path="loading-area/assign"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Categories</PageTitle>
            <AssignProductZones />
          </>
        }
      />
      <Route
        path="all-picker"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>All Picker</PageTitle>
            <AllPicker />
          </>
        }
      />
      <Route
        path="pickers/add-picker"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Add Picker</PageTitle>
            <AddPicker />
          </>
        }
      />
      <Route
        path="pickers/edit-picker"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Edit Picker</PageTitle>
            <EditPicker />
          </>
        }
      />
      <Route
        path="pickers/picker-details"
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>
              Picker Details
            </PageTitle>
            <PickerDetails />
          </>
        }
      />
    </Route>
  </Routes>
);
export default ProfilePage;
