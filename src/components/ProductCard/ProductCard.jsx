import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Rating from "react-rating";
import { motion } from "framer-motion";
import { HashLink } from "react-router-hash-link";

export default function ProductCard({ item, fromFlashSale = false }) {
  const baseUrl = import.meta.env.VITE_BASEURL;

  return (
    <>
      <HashLink
        to={`/product/${btoa(item.id)}#`}
        state={fromFlashSale ? { fromFlashSale: true } : {}}
      >
        <Card className="rounded-2xl shadow-lg bg-white overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full ">
          <div className="relative">
            {item.images && item.images[0] ? (
              <img
                src={`${baseUrl}${item.images[0]}`}
                alt=""
                className="w-full h-48 sm:h-56 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full  flex items-center justify-center text-gray-400 h-48 sm:h-56 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105">
                No Image
              </div>
            )}

            {item.islimitedstock && (
              <span
                style={{
                  fontWeight: "bold",

                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                className={`absolute ${
                  item.isbestseller && item.isnew
                    ? "bottom-3 right-3"
                    : item.isnew
                    ? "top-3 right-3 "
                    : "top-3 left-3"
                }  bg-[#FF0055] text-white text-xs font-bold px-3 py-1 rounded-full    animate-pulse`}
              >
                Limited Stock
              </span>
            )}
            {item.isnew && (
              <span
                className="absolute top-3 left-3 bg-[#FF0055] text-white text-xs font-bold px-3 py-1 rounded-full   animate-pulse"
                style={{
                  fontWeight: "bold",

                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                New
              </span>
            )}
            {item.isbestseller && (
              <span
                className={`absolute  top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full animate-gradient`}
                style={{
                  background: "linear-gradient(45deg, #E6C200, #E6B200)",
                  fontWeight: "bold",

                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                Best Seller
              </span>
            )}
          </div>
          <CardContent className="px-5 py-3 flex flex-col gap-2 flex-1 justify-between">
            <h2 className="mt-4 font-bold text-gray-800">
              {item.product_name}
            </h2>
            <div className="flex items-center justify-between gap-2 ">
              <div className="flex items-center gap-2">
                <span className="text-[#FF0055] font-bold">
                  {item.sale_price > 1 ? (
                    <>৳{item.sale_price.toLocaleString("en-IN")}</>
                  ) : (
                    <>৳{item.regular_price.toLocaleString("en-IN")}</>
                  )}
                </span>
                {item.sale_price > 1 && (
                  <span className="text-gray-400 line-through ">
                    ৳{item.regular_price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              {item.discount > 0 && (
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`   bg-[#FF0055] text-white text-xs font-semibold px-3 py-1 rounded-full`}
                >
                  {item.discount}% OFF
                </motion.span>
              )}
            </div>
            <div className="flex items-center gap-1 mb-1">
              <Rating
                emptySymbol={<Star size={20} className=" text-gray-300" />}
                fullSymbol={
                  <Star size={20} className="text-[#FFD700] fill-[#FFD700]" />
                }
                initialRating={
                  Number(item.rating) > 0
                    ? item.rating
                    : item.reviews && item.reviews.length > 0
                    ? item.reviews.reduce((a, r) => a + r.rating, 0) /
                      item.reviews.length
                    : 0
                }
                readonly
              />
            </div>
          </CardContent>
        </Card>
      </HashLink>
    </>
  );
}
