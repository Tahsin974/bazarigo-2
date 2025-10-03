import { createBrowserRouter } from "react-router";
import MainLayOut from "../LayOut/MainLayOut";
import HomePage from "../Pages/HomePage/HomePageLayOut/HomePage";
import CategoriesPage from "../Pages/CategoriesPage/CategoriesPage";
import FlashSalePage from "../Pages/FlashSalePage/FlashSalePage";
import JustArrivedPage from "../Pages/JustArrivedPage/JustArrivedPage";
import TrendingNowPage from "../Pages/TrendingNowPage/TrendingNowPage";
import ProductPage from "../Pages/ProductPage/ProductPage";

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
    ],
  },
]);
