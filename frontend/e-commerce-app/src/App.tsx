import Login from "./pages/Login/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminOverviewPage from "./pages/AdminDashboard/AdminOverviewPage";
import AdminCreateUserPage from "./pages/AdminDashboard/AdminCreateUserPage";
import AdminUpdateUserPage from "./pages/AdminDashboard/AdminUpdateUserPage";
import AdminAnalyticsPage from "./pages/AdminDashboard/AdminAnalyticsPage";
import AdminCustomerSearchPage from "./pages/AdminDashboard/AdminCustomerSearchPage";
import AdminSupportPage from "./pages/AdminDashboard/AdminSupportPage";
import AdminAccountPage from "./pages/AdminDashboard/AdminAccountPage";
import SellerDashboard from "./pages/SellerDashboard/SellerDashboard";
import SellerDashboardPage from "./pages/SellerDashboard/SellerDashboardPage";
import SellerAddProductPage from "./pages/SellerDashboard/SellerAddProductPage";
import SellerProductManagementPage from "./pages/SellerDashboard/SellerProductManagementPage";
import SellerPricingPage from "./pages/SellerDashboard/SellerPricingPage";
import SellerCouponsPage from "./pages/SellerDashboard/SellerCouponsPage";
import SellerPromotionsPage from "./pages/SellerDashboard/SellerPromotionsPage";
import SellerOrdersPage from "./pages/SellerDashboard/SellerOrdersPage";
import SellerShipmentPage from "./pages/SellerDashboard/SellerShipmentPage";
import SellerAccountPage from "./pages/SellerDashboard/SellerAccountPage";
import SellerSettingsPage from "./pages/SellerDashboard/SellerSettingsPage";
import CartPage from "./pages/Customer/CartPage";
import WishlistPage from "./pages/Customer/WishlistPage";
import ProductDetailsPage from "./pages/Customer/ProductDetailsPage";
import OrdersPage from "./pages/Customer/OrdersPage";
import { RedirectIfAuthenticated, RequireAuth } from "./components/RouteGuards";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth allowedRoles={["customer", "buyer"]}>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/cart"
          element={
            <RequireAuth allowedRoles={["customer", "buyer"]}>
              <CartPage />
            </RequireAuth>
          }
        />
        <Route
          path="/wishlist"
          element={
            <RequireAuth allowedRoles={["customer", "buyer"]}>
              <WishlistPage />
            </RequireAuth>
          }
        />
        <Route
          path="/products/:productId"
          element={
            <RequireAuth allowedRoles={["customer", "buyer"]}>
              <ProductDetailsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAuth allowedRoles={["customer", "buyer"]}>
              <OrdersPage />
            </RequireAuth>
          }
        />
        <Route
          path="/seller"
          element={
            <RequireAuth allowedRoles={["seller"]}>
              <SellerDashboard />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="dashboard" element={<SellerDashboardPage />} />
          <Route path="products/add" element={<SellerAddProductPage />} />
          <Route path="products/update" element={<SellerProductManagementPage />} />
          <Route path="products/search" element={<SellerProductManagementPage />} />
          <Route path="pricing" element={<SellerPricingPage />} />
          <Route path="coupons" element={<SellerCouponsPage />} />
          <Route path="promotions" element={<SellerPromotionsPage />} />
          <Route path="orders" element={<SellerOrdersPage />} />
          <Route path="shipment" element={<SellerShipmentPage />} />
          <Route path="account" element={<SellerAccountPage />} />
          <Route path="settings" element={<SellerSettingsPage />} />
        </Route>
        <Route
          path="/admin"
          element={
            <RequireAuth allowedRoles={["admin", "support"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminOverviewPage />} />
          <Route path="users/create" element={<AdminCreateUserPage />} />
          <Route path="users/update" element={<AdminUpdateUserPage />} />
          <Route path="customers/search" element={<AdminCustomerSearchPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="support" element={<AdminSupportPage />} />
          <Route path="account" element={<AdminAccountPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
