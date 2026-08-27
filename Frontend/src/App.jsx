import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import LoginPage from './modules/auth/pages/LoginPage';
import SignupPage from './modules/auth/pages/SignupPage';
import Dashboard from './modules/templates/components/Dashboard';
import StoreHeader from './modules/templates/components/StoreHeader';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import ProductDetailPage from './modules/products/pages/ProductDetailPage';
import Home from './modules/home/pages/Home';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';
import CustomerProductsPage from './modules/products/pages/CustomerProductsPage';
import CartPage from './modules/products/pages/CartPage';
import OrderDetailPage from './modules/orders/pages/OrderDetailPage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <StoreHeader />
          <Outlet />
        </>
      ),
      children: [
        {
          path: '/',
          element: <CustomerProductsPage />,
        },
        {
          path: '/cart',
          element: <CartPage />,
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <SignupPage />,
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute requiredRole="admin">
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/admin',
          element: <Home />,
        },
        {
          path: '/admin/products',
          element: <ListProductsPage />,
        },
        {
          path: '/admin/products/:id',
          element: <ProductDetailPage />,
        },
        {
          path: '/admin/products/create',
          element: <CreateProductPage />,
        },
        {
          path: '/admin/orders',
          element: <ListOrdersPage />,
        },
        {
          path: '/admin/orders/:id',
          element: <OrderDetailPage />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
