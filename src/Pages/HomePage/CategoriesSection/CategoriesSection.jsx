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

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <SectionTitle title={"Explore Our Top Categories"} link="/categories" />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="group cursor-pointer transform transition-transform"
          >
            <Card className="rounded-2xl shadow-lg bg-white p-6 text-center group-hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-[#FFE5E5] text-[#FF0055] transform group-hover:scale-110 transition-transform duration-300">
                  <Shirt size={32} />
                </div>
              </div>
              <span className="font-semibold text-gray-800">Fashions</span>
            </Card>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="group cursor-pointer transform transition-transform"
          >
            <Card className="rounded-2xl shadow-lg bg-white p-6 text-center group-hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-[#E5F5FF] text-[#007BFF] transform group-hover:scale-110 transition-transform duration-300">
                  <Laptop size={32} />
                </div>
              </div>
              <span className="font-semibold text-gray-800">Electronics</span>
            </Card>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="group cursor-pointer transform transition-transform"
          >
            <Card className="rounded-2xl shadow-lg bg-white p-6 text-center group-hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-[#E5FFF2] text-[#00C48C] transform group-hover:scale-110 transition-transform duration-300">
                  <Gem size={32} />
                </div>
              </div>
              <span className="font-semibold text-gray-800">
                Health & Beauty
              </span>
            </Card>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="group cursor-pointer transform transition-transform"
          >
            <Card className="rounded-2xl shadow-lg bg-white p-6 text-center group-hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-[#F5E5FF] text-[#9B59B6] transform group-hover:scale-110 transition-transform duration-300">
                  <Volleyball size={32} />
                </div>
              </div>
              <span className="font-semibold text-gray-800">Sports</span>
            </Card>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="group cursor-pointer transform transition-transform"
          >
            <Card className="rounded-2xl shadow-lg bg-white p-6 text-center group-hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-[#FFFBE5] text-[#F39C12] transform group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag size={32} />
                </div>
              </div>
              <span className="font-semibold text-gray-800">Groceries</span>
            </Card>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="group cursor-pointer transform transition-transform"
          >
            <Card className="rounded-2xl shadow-lg bg-white p-6 text-center group-hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-[#E5FFFF] text-[#00C4B8] transform group-hover:scale-110 transition-transform duration-300">
                  <Home size={32} />
                </div>
              </div>
              <span className="font-semibold text-gray-800">Home & Living</span>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
