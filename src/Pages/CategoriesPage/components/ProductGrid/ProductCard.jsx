import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function ProductCard({ product, viewMode }) {
  return (
    <Card
      className={`rounded-2xl shadow hover:shadow-lg transition bg-white ${
        viewMode === "list" ? "flex items-center" : ""
      }`}
    >
      <CardContent
        className={`p-4 ${
          viewMode === "list" ? "flex gap-4 items-center" : ""
        }`}
      >
        <div
          className={
            viewMode === "grid"
              ? "w-full h-48 overflow-hidden rounded-xl"
              : "w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg"
          }
        >
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt=""
              className="w-full h-full  object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full  h-full   flex items-center justify-center text-gray-400  object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105">
              No Image
            </div>
          )}
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className={viewMode === "grid" ? "mt-4" : "flex-1"}>
          <h3 className="font-semibold text-gray-800">{product.name}</h3>
          <div className="text-[#FF0055] font-bold mt-1">{product.price}</div>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < product.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
