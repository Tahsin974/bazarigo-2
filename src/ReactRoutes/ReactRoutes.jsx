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

export const router = createBrowserRouter([
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
        path: "/thank-you",
        element: <ThankYouPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
    ],
  },
]);
