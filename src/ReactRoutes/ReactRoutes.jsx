import { createBrowserRouter } from "react-router";
import MainLayOut from "../LayOut/MainLayOut";
import HomePage from "../Pages/HomePage/HomePageLayOut/HomePage";
import CategoriesPage from "../Pages/CategoriesPage/CategoriesPage";
import FlashSalePage from "../Pages/FlashSalePage/FlashSalePage";
import JustArrivedPage from "../Pages/JustArrivedPage/JustArrivedPage";
import TrendingNowPage from "../Pages/TrendingNowPage/TrendingNowPage";
import ProductPage from "../Pages/ProductPage/ProductPage";
import CartPage from "../Pages/CartPage/CartPage";

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
import SellerRegistrationPage from "../Pages/SellerRegistration/SellerRegistration";
import SellerTermsConditionsPage from "../Pages/SellerTermsConditionsPage/SellerTermsConditionsPage";
import SellerShopPage from "../Pages/SellerShopPage/SellerShopPage";
import InstructionPage from "../Pages/InstructionPage/InstructionPage";
import DataDeletionPage from "../Pages/DataDeletionPage/DataDeletionPage";
import CheckOutPage from "../Pages/CheckOutPage/CheckOutPage";
import VerifyOtp from "../Pages/SignUpPage/VerifyOtp";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import PasswordResetPanel from "../Pages/SignUpPage/PasswordResetPanel";
import SetNewPasswordPanel from "../Pages/SignUpPage/SetNewPasswordPanel";

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <DashBoardLayOut />,
    children: [
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowRoles={["customer", "admin", "super admin"]}>
            <UserAccountDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/admin",
        element: (
          <ProtectedRoute allowRoles={["admin", "super admin", "moderator"]}>
            <AdminPanelDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/moderator",
        element: (
          <ProtectedRoute allowRoles={["admin", "super admin", "moderator"]}>
            <AdminPanelDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/seller",
        element: (
          <ProtectedRoute allowRoles={["admin", "super admin", "seller"]}>
            <SellerPanelDashboard />
          </ProtectedRoute>
        ),
      },
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
        path: "/categories/:categoryName",
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
        path: "/product/:id",
        element: <ProductPage />,
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute allowRoles={["customer"]}>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute allowRoles={["customer"]}>
            <CheckOutPage />
          </ProtectedRoute>
        ),
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
        element: (
          <ProtectedRoute allowRoles={["customer"]}>
            <ThankYouPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "/reset",
        element: <PasswordResetPanel />,
      },
      {
        path: "/change-password",
        element: <SetNewPasswordPanel />,
      },
      {
        path: "/seller-registration",
        element: <SellerRegistrationPage />,
      },
      {
        path: "/seller-page/:seller/store",
        element: <SellerShopPage />,
      },
      {
        path: "/terms-conditions",
        element: <TermsConditionsPage />,
      },
      {
        path: "/seller-terms-conditions",
        element: <SellerTermsConditionsPage />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicyPage />,
      },

      {
        path: "/return-refund",
        element: <ReturnRefundPolicyPage />,
      },
      {
        path: "/data-deletion",
        element: <DataDeletionPage />,
      },
      {
        path: "/instruction",
        element: (
          <ProtectedRoute allowRoles={["admin", "super admin", "seller"]}>
            <InstructionPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
