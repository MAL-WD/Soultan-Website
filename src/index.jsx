// Polyfill for Safari / WebKit / Google Translate / Browser Extensions mutating React DOM nodes
if (typeof window !== 'undefined' && typeof Node !== 'undefined' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode !== this) {
      if (child.parentNode) {
        return child.parentNode.removeChild(child);
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (referenceNode.parentNode) {
        return referenceNode.parentNode.insertBefore(newNode, referenceNode);
      }
      return this.appendChild(newNode);
    }
    return originalInsertBefore.apply(this, arguments);
  };
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './i18n'; // Import i18n config
import App from './App';
import { HomePageFrame } from "./screens/HomePageFrame";
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import ProductListScreen from './screens/ProductListScreen';
import { ProductsMain } from './screens/ProductsMain/ProductsMain';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import DahebiaPaymentScreen from './screens/DahebiaPaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AnalyticsDashboard from './screens/admin/AnalyticsDashboard';
import AdminProductListScreen from './screens/admin/ProductListScreen';
import UserListScreen from './screens/admin/UserListScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import NotFoundScreen from './screens/NotFoundScreen';
import QuickCheckoutScreen from './screens/QuickCheckoutScreen';
import ContactScreen from './screens/ContactScreen';
import AboutScreen from './screens/AboutScreen';


import PaymentInstructionsScreen from './screens/PaymentInstructionsScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomePageFrame />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/search" element={<SearchResultsScreen />} />
      <Route path="/products" element={<ProductsMain />} />
      <Route path="/product/:id" element={<ProductDetailScreen />} />

      <Route path="/cart" element={<CartScreen />} />
      <Route path="/quick-checkout" element={<QuickCheckoutScreen />} />
      <Route path="/contact" element={<ContactScreen />} />
      <Route path="/about" element={<AboutScreen />} />

      
      {/* Protected Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/payment/instructions" element={<PaymentInstructionsScreen />} />
        <Route path="/payment/dahabia/:orderId" element={<DahebiaPaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>

      {/* Admin Routes */}
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
        <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
        <Route path="/admin/productlist" element={<AdminProductListScreen />} />
        <Route path="/admin/product/create" element={<ProductEditScreen />} />
        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
        <Route path="/admin/orderlist" element={<OrderListScreen />} />
      </Route>
      <Route path="*" element={<NotFoundScreen />} />
    </Route>
  )
);

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
