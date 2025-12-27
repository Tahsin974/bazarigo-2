import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  ShoppingBag,
  Truck,
  RotateCcw,
  Store,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
} from "lucide-react";
import { motion } from "framer-motion";
import CustomerReviews from "./CustomerReviews";
import { RatingStars } from "./RatingStars";
import VariantSelection from "./VariantSelection";
import { useNavigate } from "react-router";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import useProducts from "../../../Utils/Hooks/useProducts";
import { HashLink } from "react-router-hash-link";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import useAuth from "../../../Utils/Hooks/useAuth";
import { useLocation } from "react-router";
import useCart from "../../../Utils/Hooks/useCart";
import AskQuestion from "./AskQuestion";
import Loading from "../../../components/Loading/Loading";
import ReactImageMagnify from "react-image-magnify";

export default function BaseProductDetails({
  product = {},
  isPending,
  refetch,
}) {
  const baseUrl = import.meta.env.VITE_BASEURL;
  const location = useLocation();
  const { refetch: refetchCarts } = useCart();
  const { user } = useAuth();
  const videoRef = useRef();
  const [isPaused, setIsPaused] = useState(true);

  const axiosPublic = useAxiosPublic();
  const [mainImage, setMainImage] = useState(null);
  const video = mainImage ? mainImage.endsWith(".mp4") : false;
  const [selectedVariant, setSelectedVariant] = useState(null);
  const navigate = useNavigate();
  const encodedId = btoa(product.seller_id);
  const imgUrl = `${baseUrl}${mainImage}`;
  useEffect(() => {
    if (product.extras?.variants && product.extras.variants.length > 0) {
      // sell_price > 0 অনুযায়ী filter & sort করা
      const filteredVariants = product.extras.variants.filter(
        (v) => v.sale_price > 0
      );

      if (filteredVariants.length > 0) {
        const sortedVariants = [...filteredVariants].sort(
          (a, b) => a.sale_price - b.sale_price
        );
        setSelectedVariant(sortedVariants[0]);
      } else {
        // যদি সব sell_price 0 হয়, তাহলে প্রথম variant select করা
        setSelectedVariant(product.extras.variants[0]);
      }
    }
  }, [product.extras?.variants]);

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
      const optionKeys = Object.keys(product.extras.variants[0]).filter(
        (k) => !["sale_price", "regular_price", "stock", "id"].includes(k)
      );

      const matchedVariant = product.extras.variants.find((variant) =>
        optionKeys.every((key) => variant[key] === selectedVariant[key])
      );

      if (matchedVariant) {
        return {
          sale_price: matchedVariant.sale_price,
          regular_price: matchedVariant.regular_price,
          stock: matchedVariant.stock,
        };
      } else {
        // যদি কোন match না পাওয়া যায়
        return {
          sale_price: 0,
          regular_price: 0,
          stock: "Not Available",
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
        const res = await axiosPublic.get(
          `/wishlist?email=${user?.email}&id=${product.id}`
        );
        setIsSelect(res.data.isInWishlist);
      } catch (err) {
        console.error("Wishlist check error:", err);
      }
    };
    if (user && user.email) {
      fetchWishlistStatus();
    }
  }, [user?.email, product.id]);

  // Button toggle

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
  const getImages = (images) => {
    return images.filter((img) => {
      const lower = img.toLowerCase();
      return !(
        lower.endsWith(".mp4") ||
        lower.endsWith(".webm") ||
        lower.endsWith(".mov")
      );
    });
  };

  const handleBuyNowBtn = async (product) => {
    try {
      if (user && user.email) {
        const checkOutItem = {
          product_Id: product.id,
          product_name: product.product_name,
          sale_price: sale_price,
          product_img: getImages(product.images)[0],
          product_category: product.category,
          isflashsale: product.isflashsale,
          regular_price: regular_price,
          variants: selectedVariant,
          weight: parseInt(product.weight),
          brand: product?.brand || "No Brand",
          qty: 1,
        };
        if (stock === 0) {
          return Swal.fire({
            icon: "error",
            title: `sorry this product is out of stock`,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
        }
        if (stock === "Not Available") {
          return Swal.fire({
            icon: "error",
            title: `sorry this product is not available`,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
        }

        const deliveryPayload = {
          sellerId: product.seller_id,

          userId: user.id,
          weight: parseInt(product.weight || 0), // ensure number
          orderAmount: sale_price === 0 ? regular_price : sale_price, // single item price
          isCod: false, // বা তোমার state অনুযায়ী
        };

        // === Step 1: Delivery fetch ===
        const deliveryRes = await axiosPublic.get("/deliveries", {
          params: deliveryPayload,
        });

        const deliveries = deliveryRes.data.result[0] || {};

        // === Step 2: Prepare cart payload with delivery info ===
        const payLoad = {
          sellerid: product.seller_id,
          seller_name: product.seller_name,
          seller_store_name: product.seller_store_name,
          seller_role: product.seller_role,
          productinfo: [checkOutItem],
          deliveries, // attach delivery info
        };
        navigate("/checkout", { state: { items: [payLoad] } });
      } else {
        Swal.fire({
          title: "You Are Not Logged In",
          text: "Please Login For Buy This Product",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00C853",
          cancelButtonColor: "#f72c2c",
          confirmButtonText: "Yes, Login",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/sign-up", { state: { pathName: location.pathname } });
          }
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      return Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        position: "top",
      });
    }
  };
  const handleAddToCart = async (product) => {
    try {
      if (user && user.email) {
        const cartItem = {
          product_Id: product.id,
          product_name: product.product_name,
          sale_price: sale_price,
          product_img: getImages(product.images)[0],
          product_category: product.category,
          isflashsale: product.isflashsale,
          regular_price: regular_price,
          variants: selectedVariant,
          weight: product.weight,
          brand: product?.brand || "No Brand",
          qty: 1,
        };

        if (stock === 0) {
          return Swal.fire({
            icon: "error",
            title: `sorry this product is out of stock`,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
        }
        if (stock === "Not Available") {
          return Swal.fire({
            icon: "error",
            title: `sorry this product is not available`,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
        }

        const deliveryPayload = {
          sellerId: product.seller_id,

          userId: user.id,
          weight: parseInt(product.weight || 0), // ensure number
          orderAmount: sale_price === 0 ? regular_price : sale_price, // single item price
        };

        // === Step 1: Delivery fetch ===
        const deliveryRes = await axiosPublic.get("/deliveries", {
          params: deliveryPayload,
        });

        const deliveries = deliveryRes.data.result[0] || {};

        // === Step 2: Prepare cart payload with delivery info ===
        const payLoad = {
          sellerId: product.seller_id,
          seller_name: product.seller_name,
          seller_store_name: product.seller_store_name,
          seller_role: product.seller_role,
          productInfo: [cartItem],
          deliveries, // attach delivery info
        };

        // === Step 3: Add to cart API call ===
        const res = await axiosPublic.post(
          `/carts?email=${user?.email}`,
          payLoad
        );

        if (res.data.createdCount > 0 || res.data.updatedCount > 0) {
          refetchCarts();
          return Swal.fire({
            icon: "success",
            title: "Product Added To Cart Successfully",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
        } else {
          return Swal.fire({
            icon: "error",
            title: `${res.data.message}`,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
        }
      } else {
        Swal.fire({
          title: "You Are Not Logged In",
          text: "Please Login For Add Product To The Cart",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00C853",
          cancelButtonColor: "#f72c2c",
          confirmButtonText: "Yes, Login",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/sign-up", { state: { pathName: location.pathname } });
          }
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      return Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        position: "top",
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
      Swal.fire({
        icon: "success",
        title: "Link copied to clipboard!",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        position: "top",
      });
    }
  };
  const handleWishlistBtn = async () => {
    const newToggle = !isSelect;
    setIsSelect(newToggle); // UI update

    try {
      if (user && user.email) {
        if (stock === "Not Available") {
          return Swal.fire({
            icon: "error",
            title: `sorry this product is not available`,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
        }
        const res = await axiosPublic.post("/wishlist", {
          email: user?.email,
          product_Id: product.id,
          product_name: product.product_name,
          sale_price: sale_price,
          product_img: getImages(product.images)[0],
          product_category: product.category,
          isflashsale: product.isflashsale,
          regular_price: regular_price,
          variants: selectedVariant,
          weight: product.weight,
          brand: product?.brand || "No Brand",
          qty: 1,
        });
        if (res.data.createdCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Product Added To Wishlist Successfully",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
        } else if (res.data.deletedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Product Remove From Wishlist Successfully",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Opps! Try Again",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
        }
      } else {
        Swal.fire({
          title: "You Are Not Logged In",
          text: "Please Login For Add Product To The Wishlist",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#00C853",
          cancelButtonColor: "#f72c2c",
          confirmButtonText: "Yes, Login",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/sign-up", { state: { pathName: location.pathname } });
          }
        });
      }
    } catch (err) {
      console.error(err);
      setIsSelect(!newToggle); // UI revert if error
    }
  };
  useEffect(() => {
    setIsPaused(true);
  }, [mainImage]);

  if (!product || Object.keys(product).length === 0) return null;
  return (
    <div className="w-full bg-white text-gray-800 font-sans">
      {isPending ? (
        <Loading />
      ) : (
        <>
          <section className="container mx-auto xl:px-6 lg:px-6  px-4 md:py-10 py-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4 items-center"
            >
              {product.images && product.images[0] ? (
                <>
                  {!video && (
                    // <img
                    //   src={`${baseUrl}${mainImage}`}
                    //   alt=""
                    //   className="sm:w-[500px]  w-auto max-h-[500px] object-fill rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    // />
                    <ReactImageMagnify
                      {...{
                        smallImage: {
                          alt: "Wristwatch by Ted Baker London",
                          isFluidWidth: true,
                          src: imgUrl,
                        },
                        largeImage: {
                          src: imgUrl,
                          width: 1080,
                          height: 720,
                        },
                        enlargedImageContainerDimensions: {
                          width: "135%",
                          height: "135%",
                        },
                      }}
                    />
                  )}
                  {video && (
                    <div className="relative group">
                      <video
                        ref={videoRef}
                        controls
                        src={`${baseUrl}${mainImage}`}
                        className="sm:w-[500px]  w-auto max-h-[500px] object-fill rounded-2xl transition-transform duration-300 group-hover:scale-105"
                        onEnded={() => setIsPaused(true)}
                        controlsList="nodownload noremoteplayback" // more options বাদ
                        disablePictureInPicture
                      />
                      <button
                        onClick={() => {
                          if (videoRef.current.paused) {
                            videoRef.current.play();
                            setIsPaused(false);
                          } else {
                            videoRef.current.pause();
                            setIsPaused(true);
                          }
                        }}
                        className="absolute inset-0 m-auto flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-gray-500/60 text-gray-200 p-3 rounded-full shadow-md transition duration-200 ease-in-out w-16 h-16 "
                      >
                        {isPaused ? <Play size={20} /> : <Pause size={20} />}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full  flex items-center justify-center text-gray-400  object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105">
                  No Image
                </div>
              )}

              {product.images && product.images.length > 0 && (
                <div className="relative mt-4 flex justify-center px-6">
                  <button
                    onClick={() => {
                      document
                        .getElementById("thumbScroll")
                        .scrollBy({ left: -120, behavior: "smooth" });
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-800 px-2 py-2 rounded-full"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div
                    id="thumbScroll"
                    className="flex gap-4 overflow-x-auto no-scrollbar mx-3"
                  >
                    {product.images.map((thumb, i) => {
                      const isVideo = thumb.endsWith(".mp4");

                      return (
                        <>
                          {!isVideo && (
                            <img
                              key={i}
                              src={`${baseUrl}${thumb}`}
                              alt=""
                              className="w-20 h-20 object-fill rounded-lg border hover:border-[#FF0055] cursor-pointer"
                              onClick={() => setMainImage(thumb)}
                            />
                          )}
                          {isVideo && (
                            <div
                              className="relative w-20 h-20 flex-shrink-0"
                              onClick={() => setMainImage(thumb)}
                            >
                              <video
                                src={
                                  thumb.includes("/uploads")
                                    ? `${baseUrl}${thumb}`
                                    : thumb
                                }
                                className="w-full h-full object-fill rounded-lg border hover:border-[#FF0055] cursor-pointer"
                              />
                              <button className="absolute inset-0 m-auto flex items-center justify-center   text-white p-3 rounded shadow-md transition duration-200 ease-in-out w-12 border border-white h-10">
                                <Play size={20} />
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      document
                        .getElementById("thumbScroll")
                        .scrollBy({ left: 120, behavior: "smooth" });
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-800 px-2 py-2 rounded-full"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center gap-1.5"
            >
              <h1 className="text-lg sm:text-2xl md:text-3xl  font-bold">
                {product.product_name || "Unnamed Product"}
              </h1>

              {/* id: product.seller_id  */}
              {user && user.email && (
                <HashLink
                  to={`/seller-page/${product.seller_store_name}/store?id=${encodedId}#`}
                  className="flex gap-x-1.5 items-center my-1 text-gray-500 hover:text-orange-400 "
                >
                  <Store size={20} />
                  <span>{product.seller_store_name}</span>
                </HashLink>
              )}

              <div className="flex items-center gap-5">
                <p className="text-[#FF0055] text-2xl  mt-3">
                  <span className="font-bold">
                    {sale_price > 0 ? (
                      <> ৳ {sale_price.toLocaleString("en-IN") || "—"}</>
                    ) : (
                      <> ৳ {regular_price.toLocaleString("en-IN") || "—"}</>
                    )}
                  </span>
                </p>
                {sale_price > 0 && (
                  <p className="text-gray-400 text-2xl  mt-3">
                    <span className="font-bold line-through">
                      ৳ {regular_price.toLocaleString("en-IN") || "—"}
                    </span>
                  </p>
                )}
              </div>
              {user?.role === "seller" ||
              user?.role === "admin" ||
              user?.role === "super admin" ? (
                <div className="flex items-center justify-between">
                  <RatingStars
                    rating={
                      Number(product.rating) > 0
                        ? product.rating
                        : product.reviews && product.reviews.length > 0
                        ? product.reviews.reduce((a, r) => a + r.rating, 0) /
                          product.reviews.length
                        : 0
                    }
                    reviews={product.reviews}
                  />
                  <button className="text-gray-600" onClick={handleShare}>
                    <Share2 size={25} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <RatingStars
                    rating={
                      Number(product.rating) > 0
                        ? product.rating
                        : product.reviews && product.reviews.length > 0
                        ? product.reviews.reduce((a, r) => a + r.rating, 0) /
                          product.reviews.length
                        : 0
                    }
                    reviews={product.reviews}
                  />
                  <div className="sm:hidden flex items-center gap-4 ">
                    <button
                      onClick={handleWishlistBtn}
                      className="text-gray-600"
                    >
                      <Heart
                        size={25}
                        className={` ${isSelect && "fill-red-600"} `}
                      />
                    </button>
                    <button onClick={handleShare} className="text-gray-600">
                      <Share2 size={25} />
                    </button>
                  </div>
                </div>
              )}

              {product.stock !== undefined && (
                <p className="mt-2 text-sm">
                  {stock > 0 ? (
                    <span className="text-green-600 font-medium">In Stock</span>
                  ) : stock === "Not Available" ? (
                    <span className="text-red-600 font-medium">
                      Not Available
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      Out of Stock
                    </span>
                  )}
                </p>
              )}
              <p className="text-sm sm:text-base md:text-lg">
                <strong>Brand:</strong> {product?.brand || "No Brand"}
              </p>

              <VariantSelection
                product={product}
                selected={selectedVariant}
                setSelected={setSelectedVariant}
              />

              <div className="mt-8 flex flex-wrap gap-4">
                {user?.role !== "seller" &&
                  user?.role !== "admin" &&
                  user?.role !== "super admin" && (
                    <>
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

                      <div className="sm:flex sm:items-center gap-4 hidden">
                        <button
                          onClick={handleWishlistBtn}
                          className="bg-gray-100 text-gray-600  sm:px-8 sm:py-4 px-4 py-3 rounded-full shadow hover:bg-gray-200 transition flex justify-center items-center cursor-pointer"
                        >
                          <Heart
                            className={`w-5 h-5 ${isSelect && "fill-red-600"} `}
                          />
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
                          <span>
                            Enjoy Free Delivery On Orders Above ৳2,500!
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <RotateCcw size={25} className=" text-[#FF0055]" />
                          <span>7-day return policy</span>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            </motion.div>
          </section>

          <section className="container mx-auto xl:px-6 lg:px-6 px-4 py-12 border-t border-gray-300">
            <div>
              <h3 className="text-xl font-bold mb-6">Description</h3>
              <div className="mt-6 text-gray-600 leading-relaxed">
                {product.description ? (
                  <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  ></div>
                ) : (
                  <p>No description available for this product.</p>
                )}
              </div>
            </div>
          </section>

          <CustomerReviews
            reviews={product.reviews || []}
            productId={product.id}
            refetch={refetch}
            sellerId={product.seller_id}
          />
          <AskQuestion
            questions={product.questions || []}
            productId={product.id}
            productName={product.product_name}
            sellerId={product.seller_id}
            refetch={refetch}
          />

          {relatedProducts.length > 0 && (
            <section className="bg-gray-50 md:py-10 py-6">
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
