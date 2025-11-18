import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { lazy } from 'react';
import EditProduct from './edit-master-product/edit-products';
import EditProductVariant from './edit-product-variant/edit-products';
import EditStockCount from './tabs/edit-stock-count';
const Products = lazy(() => import('./products'));
const AddNewProduct = lazy(() => import('./add-new-product'));
const AllProducts = lazy(() => import('./all-products'));
const ProductDetails = lazy(() => import('./product-details'));
const Index = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="*"
          element={<Navigate to="/error/404" />}
        />
        <Route
          index
          element={<AllProducts />}
        />
        <Route
          path="/add-new-product"
          element={<AddNewProduct />}
        />
        <Route
          path="/view-all-products"
          element={<AllProducts />}
        />
        <Route
          path="/product-details"
          element={<ProductDetails />}
        />
      </Route>
      <Route
        path="/edit-product"
        element={<EditProduct />}
      ></Route>
      <Route
        path="/edit-product-variant"
        element={<EditProductVariant />}
      ></Route>
      <Route
        path="/edit-stock-count"
        element={<EditStockCount />}
      ></Route>
    </Routes>
  );
};
export default Index;
