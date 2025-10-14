import { motion } from "framer-motion";

import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { Link } from "react-router";
import { sampleProducts } from "../../../Utils/Helpers/Helpers";

const allProducts = sampleProducts();

export default function TrendingNowSection() {
  const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());
  const products = shuffledProducts.slice(0, 8);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <SectionTitle title={"Trending Now"} link="/trending-now#" />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer"
            >
              <Link to="/product">
                <ProductCard item={product} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
