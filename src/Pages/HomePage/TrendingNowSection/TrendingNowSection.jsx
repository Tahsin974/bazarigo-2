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
    img: "https://placehold.co/400x400/00C4B8/ffffff?text=Sneakers",
    isBestSeller: true,
    isTrending: true,
  },
  {
    name: "Automatic Drip Coffee Maker",
    oldPrice: 72,
    price: 50,
    discount: 31, // 31% OFF
    rating: 5,
    img: "https://placehold.co/400x400/FF0055/ffffff?text=Coffee+Maker",
    isBestSeller: true,
  },
  {
    name: "Insulated Travel Mug",
    oldPrice: 35,
    price: 25,
    discount: 29, // 29% OFF
    rating: 4,
    img: "https://placehold.co/400x400/007BFF/ffffff?text=Travel+Mug",
    isHot: true,
  },
  {
    name: "Smart LED Desk Lamp",
    oldPrice: 60,
    price: 45,
    discount: 25, // 25% OFF
    rating: 5,
    img: "https://placehold.co/400x400/9B59B6/ffffff?text=Desk+Lamp",
  },
  {
    name: "Wireless Earbuds Pro",
    oldPrice: 165,
    price: 149,
    discount: 10, // 10% OFF
    rating: 5,
    img: "https://placehold.co/400x400/00C48C/ffffff?text=Earbuds",
    isLimitedStock: true,
  },
  {
    name: "Premium Office Chair",
    oldPrice: 260,
    price: 210,
    discount: 19, // 19% OFF
    rating: 4,
    img: "https://placehold.co/400x400/FF7B7B/ffffff?text=Office+Chair",
  },
  {
    name: "4K Ultra HD Monitor",
    oldPrice: 399,
    price: 299,
    discount: 25, // 25% OFF
    rating: 5,
    img: "https://placehold.co/400x400/007BFF/ffffff?text=Monitor",
    isTrending: true,
  },
  {
    name: "Luxury Wristwatch",
    oldPrice: 650,
    price: 420,
    discount: 35, // 35% OFF
    rating: 5,
    img: "https://placehold.co/400x400/FF0055/ffffff?text=Wristwatch",
    isExclusive: true,
  },
];

export default function TrendingNowSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <SectionTitle title={"Trending Now"} link="/trending-now" />
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
