import { createBrowserRouter } from "react-router";
import MainLayOut from "../LayOut/MainLayOut";
import HomePage from "../Pages/HomePage/HomePageLayOut/HomePage";
import CategoriesPage from "../Pages/CategoriesPage/CategoriesPage";
import FlashSalePage from "../Pages/FlashSalePage/FlashSalePage";
import JustArrivedPage from "../Pages/JustArrivedPage/JustArrivedPage";
import TrendingNowPage from "../Pages/TrendingNowPage/TrendingNowPage";
import ProductPage from "../Pages/ProductPage/ProductPage";
import CartPage from "../Pages/CartPage/CartPage";
import CheckOutPage from "../Pages/CheckoutPage/CheckoutPage";
import ThankYouPage from "../Pages/ThankYouPage/ThankYouPage";
import SignUpPage from "../Pages/SignUpPage/SignUpPage";
import UserAccountDashboard from "../Pages/Dashboard/UserAccountDashboard/UserAccountDashboard";
import DashBoardLayOut from "../LayOut/DashBoardLayOut";
import AdminPanelDashboard from "../Pages/Dashboard/AdminPanelDashboard/AdminPanelDashboard";
import SellerPanelDashboard from "../Pages/Dashboard/SellerPanelDashboard/SellerPanelDashboard";
import TermsConditionsPage from "../Pages/TermsConditionsPage/TermsConditionsPage";
import PrivacyPolicyPage from "../Pages/PrivacyPolicyPage/PrivacyPolicyPage";
import ReturnRefundPolicyPage from "../Pages/ReturnRefundPolicyPage/ReturnRefundPolicyPage";
import ContactUsPage from "../Pages/ContactUsPage/ContactUsPage";
import AboutPage from "../Pages/AboutPage/AboutPage";

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <DashBoardLayOut />,
    children: [
      { path: "/dashboard", element: <UserAccountDashboard /> },
      { path: "/dashboard/admin", element: <AdminPanelDashboard /> },
      { path: "/dashboard/seller", element: <SellerPanelDashboard /> },
    ],
  },
  {
    path: "/",
    element: <MainLayOut />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/categories",
        element: <CategoriesPage />,
      },
      {
        path: "/flash-sale",
        element: <FlashSalePage />,
      },
      {
        path: "/just-arrived",
        element: <JustArrivedPage />,
      },
      {
        path: "/trending-now",
        element: <TrendingNowPage />,
      },
      {
        path: "/product",
        element: <ProductPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/checkout",
        element: <CheckOutPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact-us",
        element: <ContactUsPage />,
      },
      {
        path: "/thank-you",
        element: <ThankYouPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/terms-conditions",
        element: <TermsConditionsPage />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "/return-refund",
        element: <ReturnRefundPolicyPage />,
      },
    ],
  },
]);
