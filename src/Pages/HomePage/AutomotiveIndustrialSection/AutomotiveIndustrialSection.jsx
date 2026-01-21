import { motion } from "framer-motion";
import Loading from "../../../components/Loading/Loading";
import { HashLink } from "react-router-hash-link";
import ProductCard from "../../../components/ProductCard/ProductCard";

import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import useAutomotiveCategoryProducts from "../../../Utils/Hooks/useAutomotiveCategoryProducts";

export default function AutomotiveIndustrialSection() {
  const { data: products = [], isPending } = useAutomotiveCategoryProducts();

  return (
    <section className="md:py-10 py-6 bg-gray-50">
      {isPending ? (
        <Loading />
      ) : (
        <div className="container mx-auto xl:px-6 lg:px-6  px-4">
          <SectionTitle title={"Automotive & Industrial"} showViewAll={false} />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="cursor-pointer"
              >
                <HashLink to="/product#">
                  <ProductCard item={product} />
                </HashLink>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
