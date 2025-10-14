import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Rating from "react-rating";

export default function ProductCard({ product: item, viewMode }) {
  return (
    <Card
      className={`rounded-2xl shadow hover:shadow-lg transition bg-white ${
        viewMode === "list" ? "flex items-center" : ""
      }`}
    >
      <div
        className={`relative ${
          viewMode === "list" && "h-48 flex-shrink-0 overflow-hidden rounded-lg"
        }`}
      >
        {item.images && item.images[0] ? (
          <img
            src={item.images[0]}
            alt=""
            className="w-full h-full  object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full  flex items-center justify-center text-gray-400 h-48 sm:h-56 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105">
            No Image
          </div>
        )}

        <div className={` ${viewMode === "list" && "hidden"}`}>
          {item.isLimitedStock && (
            <span
              className={`absolute ${
                item.isBestSeller && item.isNew
                  ? "bottom-3 right-3"
                  : item.isNew
                  ? "top-3 right-3 "
                  : "top-3 left-3"
              }  bg-[#FF0055] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white animate-pulse`}
            >
              Limited Stock
            </span>
          )}

          {item.isNew && (
            <span className="absolute top-3 left-3 bg-[#FF0055] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white animate-pulse">
              New
            </span>
          )}
          {item.isBestSeller && (
            <span
              className={`absolute  ${
                item.isLimitedStock && item.isNew
                  ? "top-3 left-3"
                  : item.isNew
                  ? "top-3 right-3 "
                  : item.isLimitedStock
                  ? "top-3 right-3"
                  : "top-3 left-3"
              }  text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white animate-gradient`}
              style={{
                background: "linear-gradient(90deg, #FFD700 0%, #FFFACD 100%)",
                color: "#8B8000",
                boxShadow: "0 2px 8px rgba(255, 215, 0, 0.3)",
              }}
            >
              Best Seller
            </span>
          )}
        </div>
      </div>
      <CardContent
        className={`p-4 ${
          viewMode === "list" ? "flex gap-4 items-center" : ""
        }`}
      >
        <div
          className={
            viewMode === "grid" ? "mt-4 space-y-3" : "flex-1 space-y-3"
          }
        >
          <h2 className="mt-4 font-bold text-gray-800">{item.name}</h2>
          <div
            className={`flex ${
              viewMode === "list" && "flex-col items-start"
            } items-center justify-between gap-2 mt-2`}
          >
            <div className="flex items-center gap-2">
              <p className="text-[#FF0055] font-bold">
                ৳{item.price.toFixed(2)}
              </p>
              {item.oldPrice > 1 && (
                <p className="text-gray-400 line-through text-sm">
                  ৳{item.oldPrice.toFixed(2)}
                </p>
              )}
            </div>
            <div className="flex gap-4 justify-between">
              <div
                className={` ${viewMode === "list" ? "flex gap-4" : "hidden"}`}
              >
                {item.isLimitedStock && (
                  <span
                    className={`  bg-[#FF0055] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white `}
                  >
                    Limited Stock
                  </span>
                )}
                {item.isNew && (
                  <span className=" bg-[#FF0055] text-white text-xs font-bold px-3 py-1 rounded-full  border border-white ">
                    New
                  </span>
                )}
                {item.isBestSeller && (
                  <span
                    className=" text-white text-xs font-bold px-3 py-1 rounded-full  border border-white animate-gradient"
                    style={{
                      background:
                        "linear-gradient(90deg, #FFD700 0%, #FFFACD 100%)",
                      color: "#8B8000",
                      boxShadow: "0 2px 8px rgba(255, 215, 0, 0.3)",
                    }}
                  >
                    Best Seller
                  </span>
                )}
              </div>
              {item.discount && (
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`   bg-[#FF0055] text-white text-xs font-semibold px-3 py-1 rounded-full`}
                >
                  {item.discount}% OFF
                </motion.span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <Rating
              emptySymbol={<Star size={20} className=" text-gray-300" />}
              fullSymbol={
                <Star size={20} className="text-[#FFD700] fill-[#FFD700]" />
              }
              initialRating={item.rating}
              readonly
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
