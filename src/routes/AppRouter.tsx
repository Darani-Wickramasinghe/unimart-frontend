import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', lazy: () => import('../features/listings/pages/ListingsPage') },
  { path: '/listings/:id', lazy: () => import('../features/listings/pages/ListingDetailsPage') },
  { path: '/login', lazy: () => import('../features/auth/pages/LoginPage') },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}