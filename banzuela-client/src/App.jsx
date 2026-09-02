import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import DashLayout from "./layouts/DashLayout";

// Landing Pages
import HomePage from "./pages/LandingPages/HomePage";
import ProductPage from "./pages/LandingPages/ProductPage";
import ProductListPage from "./pages/LandingPages/ProductListPage";
import CartPage from "./pages/LandingPages/CartPage";
import OrderPage from "./pages/LandingPages/OrderPage";
import ReviewPage from "./pages/LandingPages/ReviewPage";
import ProfilePage from "./pages/LandingPages/ProfilePage";
import AboutPage from "./pages/LandingPages/AboutPage";

// Auth Pages
import SignInPage from "./pages/AuthPages/SignInPage";
import SignUpPage from "./pages/AuthPages/SignUpPage";

// Dashboard Pages
import DashboardPage from "./pages/DashboardPages/DashboardPage";
import DashProductPage from "./pages/DashboardPages/DashProductPage";
import DashOrdersPage from "./pages/DashboardPages/DashOrdersPage";
import DashReviewsPage from "./pages/DashboardPages/DashReviewsPage";
import DashUsersPage from "./pages/DashboardPages/DashUsersPage";

// Not Found
import NotFoundPage from "./pages/NotFoundPage";

const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductListPage /> },
      { path: "products/:id", element: <ProductPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "orders", element: <OrderPage /> },
      { path: "reviews", element: <ReviewPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },
    ],
  },

  {
    path: "/dashboard",
    element: <DashLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "products", element: <DashProductPage /> },
      { path: "orders", element: <DashOrdersPage /> },
      { path: "reviews", element: <DashReviewsPage /> },
      { path: "users", element: <DashUsersPage /> },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
];

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;