import { motion } from "framer-motion";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { Link } from "react-router";

const products = [
  {
    name: "Classic Low-Top Sneakers",
    oldPrice: 90,
    price: 75,
    discount: 17, // 17% OFF
    rating: 4,
    images: ["https://placehold.co/400x400/00C4B8/ffffff?text=Sneakers"],
  },
  {
    name: "Automatic Drip Coffee Maker",
    oldPrice: 72,
    price: 50,
    discount: 31, // 31% OFF
    rating: 5,
    images: ["https://placehold.co/400x400/FF0055/ffffff?text=Coffee+Maker"],
    isBestSeller: true,
  },
  {
    name: "Insulated Travel Mug",
    oldPrice: 35,
    price: 25,
    discount: 29, // 29% OFF
    rating: 4,
    images: ["https://placehold.co/400x400/007BFF/ffffff?text=Travel+Mug"],
  },
  {
    name: "Smart LED Desk Lamp",
    oldPrice: 60,
    price: 45,
    discount: 25, // 25% OFF
    rating: 5,
    images: ["https://placehold.co/400x400/9B59B6/ffffff?text=Desk+Lamp"],
    isNew: true,
  },
  {
    name: "Wireless Earbuds Pro",
    oldPrice: 165,
    price: 149,
    discount: 10, // 10% OFF
    rating: 5,
    images: ["https://placehold.co/400x400/00C48C/ffffff?text=Earbuds"],
  },
  {
    name: "Premium Office Chair",
    oldPrice: 260,
    price: 210,
    discount: 19, // 19% OFF
    rating: 4,
    images: ["https://placehold.co/400x400/FF7B7B/ffffff?text=Office+Chair"],
    isNew: true,
  },
];

export default function JustArrivedSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto xl:px-6 lg:px-6  px-4">
        <SectionTitle title={"Just Arrived"} link="/just-arrived" />
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
