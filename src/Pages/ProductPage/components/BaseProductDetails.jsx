import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  ShoppingBag,
  Truck,
  RotateCcw,
  Store,
} from "lucide-react";
import { motion } from "framer-motion";
import CustomerReviews from "./CustomerReviews";
import { RatingStars } from "./RatingStars";
import VariantSelection from "./VariantSelection";
import { Link, useNavigate } from "react-router";

import ProductCard from "../../../components/ProductCard/ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useProducts from "../../../Utils/Hooks/useProducts";
import { HashLink } from "react-router-hash-link";

export default function BaseProductDetails({
  product = {},
  email = "tahsin123@gmail.com",
  isPending,
}) {
  const [mainImage, setMainImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product.images]);
  const getSelectedVariantDetails = () => {
    if (
      selectedVariant &&
      Object.keys(selectedVariant).length > 0 &&
      product.extras?.variants
    ) {
      const matchedVariant = product.extras.variants.find((variant) =>
        Object.entries(selectedVariant).every(([key, value]) => {
          // normalize keys: trim and lowercase
          const variantKey = Object.keys(variant).find(
            (k) => k.toLowerCase() === key.toLowerCase()
          );
          return variantKey && variant[variantKey] === value;
        })
      );

      if (matchedVariant) {
        return {
          sale_price: matchedVariant["sale price"],
          regular_price: matchedVariant["regular price"],
          stock: matchedVariant.stock,
        };
      }
    }

    return {
      sale_price: product.sale_price,
      regular_price: product.regular_price,
      stock: product.stock,
    };
  };

  const { sale_price, regular_price, stock } = getSelectedVariantDetails();

  const [isSelect, setIsSelect] = useState(false);
  const { products } = useProducts();

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/wishlist?email=${email}&id=${product.id}`
        );
        setIsSelect(res.data.isInWishlist);
      } catch (err) {
        console.error("Wishlist check error:", err);
      }
    };
    fetchWishlistStatus();
  }, [email, product.id]);

  // Button toggle
  const handleWishlistBtn = async () => {
    const newToggle = !isSelect;
    setIsSelect(newToggle); // UI update

    try {
      const res = await axios.post("http://localhost:3000/wishlist", {
        email,
        productId: product.id,
        productName: product.product_name,
        price: product.sale_price,
        img: product.images[0],
        toggle: newToggle,
      });
      if (res.data.createdCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Product Added To Wishlist Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (res.data.deletedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Product Remove From Wishlist Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Opps! Try Again",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      setIsSelect(!newToggle); // UI revert if error
    }
  };

  if (!product || Object.keys(product).length === 0) return null;

  const rating = Number.isFinite(product.rating) ? product.rating : 0;

  // Function to get related products
  function getRelatedProducts(products, currentProduct, limit = 4) {
    // Filter products by same category/subcategory, exclude the current product
    const related = products.filter(
      (p) =>
        p.id !== currentProduct.id &&
        (p.subcategory === currentProduct.subcategory ||
          p.category === currentProduct.category)
    );

    // Optional: sort by rating, bestseller, or trending
    related.sort((a, b) => b.rating - a.rating);

    // Return limited number of related products
    return related.slice(0, limit);
  }

  // Usage

  const relatedProducts = getRelatedProducts(products, product);

  const handleBuyNowBtn = async (product) => {
    try {
      const checkOutItem = {
        product_Id: product.id,
        product_name: product.product_name,
        sale_price: product.sale_price,
        product_img: product.images[0],
        regular_price: product.regular_price,
        variants: selectedVariant,
        weight: product.weight,
        brand: product.brand,
        qty: 1,
      };

      const user = {
        email: "tahsinislam974@gmail.com",
        id: "438fdd77-ae20-40f9-9878-66342f07ac30", // userId backend API call এর জন্য
      };

      // === Step 1: Delivery fetch ===
      const deliveryRes = await axios.get("http://localhost:3000/deliveries", {
        params: {
          sellerId: "2c576f40-7bbb-4df0-87ec-389e9a10a5ce",
          userId: user.id,
          weight: parseFloat(product.weight || 0), // ensure number
          orderAmount: product.sale_price, // single item price
          isCod: false, // বা তোমার state অনুযায়ী
        },
      });

      const deliveries = deliveryRes.data.result[0] || {};

      // === Step 2: Prepare cart payload with delivery info ===
      const payLoad = {
        sellerId: "2c576f40-7bbb-4df0-87ec-389e9a10a5ce",
        productinfo: [checkOutItem],
        deliveries, // attach delivery info
      };
      navigate("/checkout", { state: { items: [payLoad] } });
    } catch (err) {
      console.error("Error adding to cart:", err);
      return Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const handleAddToCart = async (product) => {
    try {
      const cartItem = {
        product_Id: product.id,
        product_name: product.product_name,
        sale_price: product.sale_price,
        product_img: product.images[0],
        regular_price: product.regular_price,
        variants: selectedVariant,
        weight: product.weight,
        brand: product.brand,
        qty: 1,
      };

      const user = {
        email: "tahsinislam974@gmail.com",
        id: "438fdd77-ae20-40f9-9878-66342f07ac30", // userId backend API call এর জন্য
      };

      // === Step 1: Delivery fetch ===
      const deliveryRes = await axios.get("http://localhost:3000/deliveries", {
        params: {
          sellerId: "2c576f40-7bbb-4df0-87ec-389e9a10a5ce",
          userId: user.id,
          weight: parseFloat(product.weight || 0), // ensure number
          orderAmount: product.sale_price, // single item price
          isCod: false, // বা তোমার state অনুযায়ী
        },
      });

      const deliveries = deliveryRes.data.result[0] || {};

      // === Step 2: Prepare cart payload with delivery info ===
      const payLoad = {
        sellerId: "2c576f40-7bbb-4df0-87ec-389e9a10a5ce",
        productInfo: [cartItem],
        deliveries, // attach delivery info
      };

      // === Step 3: Add to cart API call ===
      const res = await axios.post(
        `http://localhost:3000/carts?email=${user.email}`,
        payLoad
      );

      if (res.data.createdCount > 0 || res.data.updatedCount > 0) {
        return Swal.fire({
          icon: "success",
          title: "Product Added To Cart Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        return Swal.fire({
          icon: "error",
          title: `${res.data.message}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      return Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleShare = async (product) => {
    const shareData = {
      title: product.name || "Check this product",
      text: product.description || "Take a look at this great product!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Sharing failed:", err);
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="w-full bg-white text-gray-800 font-sans">
      {isPending ? (
        <div class="flex justify-center items-center h-screen">
          <div class="loading loading-spinner text-primary"></div>
        </div>
      ) : (
        <>
          <section className="container mx-auto xl:px-6 lg:px-6  px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4 items-center"
            >
              {product.images && product.images[0] ? (
                <img
                  src={`http://localhost:3000${mainImage}`}
                  alt=""
                  className="w-full max-h-[500px] object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full  flex items-center justify-center text-gray-400  object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105">
                  No Image
                </div>
              )}

              {product.images && product.images.length > 0 && (
                <div className="flex gap-4 mt-4 overflow-x-auto">
                  {product.images.map((thumb, i) => (
                    <img
                      key={i}
                      src={`http://localhost:3000${thumb}`}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border hover:border-[#FF0055] cursor-pointer"
                      onClick={() => setMainImage(thumb)}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center gap-1.5"
            >
              <h1 className="text-3xl md:text-4xl font-bold">
                {product.product_name || "Unnamed Product"}
              </h1>
              <HashLink
                to={`/seller-page/rahimghosh/store#`}
                className="flex gap-x-1.5 items-center my-1 text-gray-500 hover:text-orange-400 "
              >
                <Store size={20} />
                <span>Rahim Ghosh</span>
              </HashLink>

              <div className="flex items-center gap-5">
                <p className="text-[#FF0055] text-2xl  mt-3">
                  <span className="font-bold">
                    ৳ {sale_price.toLocaleString("en-IN") || "—"}
                  </span>
                </p>
                {product.regular_price > 1 && (
                  <p className="text-gray-400 text-2xl  mt-3">
                    <span className="font-bold line-through">
                      ৳ {regular_price.toLocaleString("en-IN") || "—"}
                    </span>
                  </p>
                )}
              </div>

              <RatingStars rating={rating} reviews={product.reviews} />
              {product.stock !== undefined && (
                <p className="mt-2 text-sm">
                  {stock > 0 ? (
                    <span className="text-green-600 font-medium">In Stock</span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      Out of Stock
                    </span>
                  )}
                </p>
              )}
              <p className="text-lg">
                <strong>Brand:</strong> {product.brand}
              </p>

              <VariantSelection
                product={product}
                selected={selectedVariant}
                setSelected={setSelectedVariant}
              />

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-[#FF0055] text-white sm:px-8  sm:py-4  px-4 py-3 rounded-full shadow-md hover:bg-[#e6004e] transition flex items-center justify-center w-full sm:w-auto cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
                </button>

                <button
                  onClick={() => handleBuyNowBtn(product)}
                  className="bg-gray-200 text-gray-800  sm:px-8  sm:py-4 px-4 py-3 rounded-full shadow hover:bg-gray-300 transition justify-center w-full sm:w-auto cursor-pointer"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleWishlistBtn}
                  className="bg-gray-100 text-gray-600  sm:px-8 sm:py-4 px-4 py-3 rounded-full shadow hover:bg-gray-200 transition flex justify-center items-center cursor-pointer"
                >
                  <Heart className={`w-5 h-5 ${isSelect && "fill-red-600"} `} />
                </button>

                <button
                  onClick={handleShare}
                  className="bg-gray-100 text-gray-600 px-4 py-3 sm:px-8  sm:py-4 rounded-full shadow hover:bg-gray-200 transition flex justify-center items-center cursor-pointer"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-6 sm:text-base text-sm text-gray-700 border border-dashed p-4 rounded-lg border-gray-300">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:text-left text-center">
                  <Truck size={25} className=" text-[#FF0055]" />
                  <span>Enjoy Free Delivery On Orders Above ৳2,500!</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <RotateCcw size={25} className=" text-[#FF0055]" />
                  <span>7-day return policy</span>
                </div>
              </div>
            </motion.div>
          </section>

          <section className="container mx-auto xl:px-6 lg:px-6 px-4 py-12 border-t border-gray-300">
            <div>
              <h3 className="text-xl font-bold mb-6">Description</h3>
              {product.description && (
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                  className="mt-6 text-gray-600 leading-relaxed"
                ></div>
              )}
            </div>
          </section>

          <CustomerReviews reviews={product.reviewsList || []} />

          {relatedProducts.length > 0 && (
            <section className="bg-gray-50 py-16">
              <div className="container mx-auto xl:px-6 lg:px-6  px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
                  Related Products
                </h2>
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {relatedProducts.map((item, index) => (
                    <ProductCard key={index} item={item} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
