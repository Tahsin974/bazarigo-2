import { useNavigate, useParams } from "react-router";
import ProductDetails from "./components/ProductDetails";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";
import useAxiosPublic from "../../Utils/Hooks/useAxiosPublic";

import Loading from "../../components/Loading/Loading";

export default function ProductPage() {
  const { id } = useParams();
  // const encodedId = atob(id);
  const navigate = useNavigate();
  let encodedId;
  try {
    encodedId = atob(id); // যদি Base64 হয় তবে ডিকোড হবে
  } catch (e) {
    console.error(e);
    navigate(`/product/${btoa(id)}`, { replace: true });
    // যদি Base64 না হয় (যেমন রিলোড দিলে), তবে যা আছে তাই থাকবে
  }

  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const fromFlashSale = location.state?.fromFlashSale;
  const {
    data: productDetails = {},
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["product", encodedId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products/${encodedId}`);
      const product = { ...res.data.product, isflashsale: false };

      if (fromFlashSale) {
        const flashRes = await axiosPublic.get(`/flash-sale/active`);
        const flashSaleProducts = flashRes.data.sale_products || [];
        const flashProduct = flashSaleProducts.find((p) => p.id === product.id);
        if (flashProduct) return flashProduct; // Flash Sale ডাটা রিটার্ন
      }

      return product; // সাধারণ প্রোডাক্ট
    },
  });

  if (!productDetails) {
    return (
      <div className="xl:px-6 lg:px-6  px-4 text-center text-red-500">
        Product not found
      </div>
    );
  }

  return (
    <>
      {!isPending ? (
        <div className="space-y-10 xl:px-6 lg:px-6  px-4 bg-gray-100">
          <ProductDetails
            product={productDetails}
            category={productDetails.category}
            subcategory={productDetails.subcategory || ""}
            isPending={isPending}
            refetch={refetch}
          />
        </div>
      ) : (
        <>
          <Loading />
        </>
      )}
    </>
  );
}
