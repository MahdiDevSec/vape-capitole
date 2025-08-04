import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layouts/Layout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Products from '../pages/Products';
import Stores from '../pages/Stores';
import StoreDetail from '../pages/StoreDetail';
import StoreProducts from '../pages/StoreProducts';
import MixLiquids from '../pages/MixLiquids';
import Liquids from '../pages/Liquids';
import Favorites from '../pages/Favorites';
import AdminLogin from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import AdminStores from '../pages/admin/Stores';
import AdminLiquids from '../pages/admin/Liquids';
import AdminUsers from '../pages/admin/Users';
import AdminOrders from '../pages/admin/Orders';
import NewAdminOrders from '../pages/admin/NewOrders';
import AdminTranslations from '../pages/admin/Translations';
import AdminSettings from '../pages/admin/Settings';
import Checkout from '../pages/Checkout';
import CartPage from '../pages/Cart';
import ErrorBoundary from '../components/ErrorBoundary';
import VapeKits from '../pages/products/VapeKits';
import VapeBoxes from '../pages/products/VapeBoxes';
import Atomisers from '../pages/products/Atomisers';
import Pyrex from '../pages/products/Pyrex';
import Batteries from '../pages/products/Batteries';
import Accessories from '../pages/products/Accessories';
import Cotton from '../pages/products/Cotton';
import Coils from '../pages/products/Coils';
import Resistors from '../pages/products/Resistors';
import ProductDetail from '../pages/products/ProductDetail';
import Cart from '../components/Cart';
import UsedProducts from '../pages/UsedProducts';
import AdminUsedProducts from '../pages/admin/UsedProducts';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:productId', element: <ProductDetail /> },
      { path: 'products/vape-kits', element: <VapeKits /> },
      { path: 'products/vapeboxes', element: <VapeBoxes /> },
      { path: 'products/atomisers', element: <Atomisers /> },
      { path: 'products/pyrex', element: <Pyrex /> },
      { path: 'products/batteries', element: <Batteries /> },
      { path: 'products/accessories', element: <Accessories /> },
      { path: 'products/cotton', element: <Cotton /> },
      { path: 'products/coils', element: <Coils /> },
      { path: 'products/resistors', element: <Resistors /> },
      { path: 'stores', element: <Stores /> },
      { path: 'stores/:storeId', element: <StoreDetail /> },
      { path: 'stores/:storeId/products', element: <StoreProducts /> },
      { path: 'liquids', element: <Liquids /> },
      { path: 'mix', element: <MixLiquids /> },
      { path: 'favorites', element: <Favorites /> },
      { path: 'checkout', element: <CartPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'used-products', element: <UsedProducts /> },
    ],
  },
  {
    path: '/admin',
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'login', element: <AdminLogin /> },
      {
        element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'stores', element: <AdminStores /> },
          { path: 'liquids', element: <AdminLiquids /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'orders', element: <NewAdminOrders /> },
          { path: 'used-products', element: <AdminUsedProducts /> },
          { path: 'translations', element: <AdminTranslations /> },
          { path: 'settings', element: <AdminSettings /> },
        ],
      },
    ],
  },
]);
