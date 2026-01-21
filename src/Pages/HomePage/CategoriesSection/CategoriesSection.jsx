import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Laptop,
  Shirt,
  Home,
  Activity,
  Heart,
  ShoppingCart,
  PawPrint,
  Wrench,
} from "lucide-react";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { HashLink } from "react-router-hash-link";
import useProducts from "../../../Utils/Hooks/useProducts";

export default function CategoriesSection() {
  const { products } = useProducts(); // all products
  const categories = [
    {
      name: "Electronics",
      link: "Electronics",
      icon: <Laptop size={32} className="text-[#007BFF]" />,
      bg: "#E5F5FF",
    },
    {
      name: "Fashion",
      link: "Fashion",
      icon: <Shirt size={32} className="text-[#FF0055]" />,
      bg: "#FFE5E5",
    },
    {
      name: "Groceries",
      link: "Grocery & Food Items",
      icon: <ShoppingCart size={32} className="text-[#F39C12]" />,
      bg: "#FFFBE5",
    },
    {
      name: "Health & Beauty",
      link: "Health & Beauty",
      icon: <Heart size={32} className="text-[#00C48C]" />,
      bg: "#E5FFF2",
    },
    {
      name: "Home Decor",
      link: "Furniture & Home Decor",
      icon: <Home size={32} className="text-[#00C4B8]" />,
      bg: "#E5FFFF",
    },
    {
      name: "Sports",
      link: "Sports & Outdoors",
      icon: <Activity size={32} className="text-[#9B59B6]" />,
      bg: "#F5E5FF",
    },
    {
      name: "Tools",
      link: "Automotive & Industrial",
      icon: <Wrench size={32} className="text-[#FF8C00]" />,
      bg: "#FFF0E5",
    },
    {
      name: "Pet Care",
      link: "Pets & Pet Care",
      icon: <PawPrint size={32} className="text-[#6C63FF]" />,
      bg: "#EDE5FF",
    },
  ];

  // Filter categories: only show if products exist
  const filteredCategories = categories
    .filter((cat) => products.some((p) => p.category === cat.link))
    .slice(0, 6); // max 6 categories

  return (
    <section className="md:py-10 py-6 bg-gray-50">
      <div className="container mx-auto xl:px-6 lg:px-6  px-4">
        <SectionTitle title={"Categories"} link="/categories/All Products#" />
        <div
          className={`mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-${filteredCategories.length} gap-6 `}
        >
          {filteredCategories.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group cursor-pointer transform transition-transform"
            >
              <HashLink to={`/categories/${cat.link}#`}>
                <Card className="rounded-2xl shadow-lg bg-white p-6 text-center group-hover:shadow-xl transition-shadow duration-300">
                  <div className="flex justify-center mb-4">
                    <div
                      className="p-4 rounded-full   transform group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: cat.bg }}
                    >
                      {cat.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-[clamp(12px,2vw,16px)]">
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
