import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { Home, ProductList, ProductDetail, Cart, Login, AdminDashboard, StaffDashboard, AddProduct, AddStaff, StaffDetails } from '@pages';
import { ROUTES } from '@constants';

const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductList />} />
        <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
        <Route path={ROUTES.CART} element={<Cart />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.STAFF_LOGIN} element={<Login isStaffLogin={true} />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<Login isAdminLogin={true} />} />
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTES.STAFF_DASHBOARD} element={<StaffDashboard />} />
        <Route path={ROUTES.ADMIN_ADD_PRODUCT} element={<AddProduct />} />
        <Route path={ROUTES.ADMIN_ADD_STAFF} element={<AddStaff />} />
        <Route path={ROUTES.ADMIN_STAFF_DETAILS} element={<StaffDetails />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;
