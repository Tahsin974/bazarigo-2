import { Button } from "@/components/ui/button";
import { Heart, Share2, ShoppingBag, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import CustomerReviews from "./CustomerReviews";
import ProductCard from "./ProductCard";
import { RatingStars } from "./RatingStars";
import VariantSelection from "./VariantSelection";
import { Link } from "react-router";

export default function BaseProductDetails({
  product = {},
  extraDetails = null,
}) {
  if (!product || Object.keys(product).length === 0) return null;

  const related = Array.isArray(product.related) ? product.related : [];
  const recommendations = Array.isArray(product.recommendations)
    ? product.recommendations
    : [];
  const rating = Number.isFinite(product.rating) ? product.rating : 0;

  return (
    <div className="w-full bg-white text-gray-800 font-sans">
      <section className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 items-center"
        >
          <img
            src={
              product.img ||
              "https://placehold.co/600x600/eee/333?text=No+Image"
            }
            alt={product.name || "Product Image"}
            className="rounded-2xl shadow-lg max-h-[500px] object-contain hover:scale-105 transition-transform"
          />
          {product.gallery && product.gallery.length > 0 && (
            <div className="flex gap-4 mt-4 overflow-x-auto">
              {product.gallery.map((thumb, i) => (
                <img
                  key={i}
                  src={thumb}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border hover:border-[#FF0055] cursor-pointer"
                />
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            {product.name || "Unnamed Product"}
          </h1>
          <p className="text-[#FF0055] text-2xl font-bold mt-3">
            {product.price || "—"}
          </p>

          <RatingStars rating={rating} reviews={product.reviews} />
          {product.stock !== undefined && (
            <p className="mt-2 text-sm">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </p>
          )}
          {product.description && (
            <p className="mt-6 text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}
          <VariantSelection product={product} />
          {extraDetails && (
            <div className="mt-6 space-y-2 text-gray-700">{extraDetails}</div>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            <Button className="bg-[#FF0055] text-white px-8 py-4 rounded-full shadow-md hover:bg-[#e6004e] transition flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
            </Button>
            <Link to="/checkout">
              <Button className="bg-gray-200 text-gray-800 px-8 py-4 rounded-full shadow hover:bg-gray-300 transition">
                Buy Now
              </Button>
            </Link>

            <Button className="bg-gray-100 text-gray-600 px-4 py-4 rounded-full shadow hover:bg-gray-200 transition">
              <Heart className="w-5 h-5" />
            </Button>
            <Button className="bg-gray-100 text-gray-600 px-4 py-4 rounded-full shadow hover:bg-gray-200 transition">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700 border border-dashed p-4 rounded-lg border-gray-300">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#FF0055]" />
              <span>Free delivery on orders over ৳50</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#FF0055]" />
              <span>30-day return policy</span>
            </div>
          </div>
        </motion.div>
      </section>

      <CustomerReviews reviews={product.reviewsList || []} />

      {related.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
              Related Products
            </h2>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((item, index) => (
                <ProductCard key={index} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
              You May Also Like
            </h2>
            <div className="mt-12 flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
              {recommendations.map((item, index) => (
                <div key={index} className="min-w-[250px] flex-shrink-0">
                  <ProductCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
