import { motion } from "framer-motion";

import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import ProductCard from "../../../components/ProductCard/ProductCard";
import useProducts from "../../../Utils/Hooks/useProducts";

export default function TrendingNowSection() {
  const { products: allProducts } = useProducts();
  const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());
  const products = shuffledProducts.slice(0, 8);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto xl:px-6 lg:px-6  px-4">
        <SectionTitle title={"Trending Now"} link="/trending-now#" />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer"
            >
              <ProductCard item={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
