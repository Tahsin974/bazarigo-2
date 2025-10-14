import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  ShoppingBag,
  Laptop,
  Shirt,
  Home,
  Gem,
  Volleyball,
} from "lucide-react";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { HashLink } from "react-router-hash-link";

export default function CategoriesSection() {
  const categories = [
    {
      name: "Electronics",
      icon: <Laptop size={32} className="text-[#007BFF]" />,
      bg: "#E5F5FF",
    },
    {
      name: "Fashion",
      icon: <Shirt size={32} className="text-[#FF0055]" />,
      bg: "#FFE5E5",
    },
    {
      name: "Groceries",
      icon: <ShoppingBag size={32} className="text-[#F39C12]" />,
      bg: "#FFFBE5",
    },
    {
      name: "Health & Beauty",
      icon: <Gem size={32} className="text-[#00C48C]" />,
      bg: "#E5FFF2",
    },
    {
      name: "Home & Living",
      icon: <Home size={32} className="text-[#00C4B8]" />,
      bg: "#E5FFFF",
    },
    {
      name: "Sports",
      icon: <Volleyball size={32} className="text-[#9B59B6]" />,
      bg: "#F5E5FF",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto xl:px-6 lg:px-6  px-4">
        <SectionTitle title={"Categories"} link="/categories/All Products#" />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group cursor-pointer transform transition-transform"
            >
              <HashLink to={`/categories/${cat.name}#`}>
                <Card className="rounded-2xl shadow-lg bg-white p-6 text-center group-hover:shadow-xl transition-shadow duration-300">
                  <div className="flex justify-center mb-4">
                    <div
                      className="p-4 rounded-full   transform group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: cat.bg }}
                    >
                      {cat.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 sm:text-base text-xs">
                    {cat.name}
                  </h3>
                </Card>
              </HashLink>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
