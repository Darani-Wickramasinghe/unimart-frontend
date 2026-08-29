import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import ProtectedRoute from './ProtectedRoute';

function RootLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', lazy: () => import('../features/listings/pages/ListingsPage') },
      { path: '/listings/:id', lazy: () => import('../features/listings/pages/ListingDetailsPage') },
      { path: '/login', lazy: () => import('../features/auth/pages/LoginPage') },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/listings/new', lazy: () => import('../features/listings/pages/ListingFormPage') },
          { path: '/listings/:id/edit', lazy: () => import('../features/listings/pages/ListingFormPage') },
          { path: '/my/listings', lazy: () => import('../features/listings/pages/MyListingsPage') },
          { path: '/orders/:orderId/review', lazy: () => import('../features/reviews/pages/ReviewFormPage') },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}