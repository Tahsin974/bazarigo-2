import SortDropdown from "./components/SortDropdown";
import NewArrivalsGrid from "./components/NewArrivalsGrid";
import img from "../../assets/Products/BAJEAL T350 Luminous USB Keyboard & Mouse Set Computer Gaming Mechanical Feel Floating Rainbow Backli.jpg";

const newArrivals = [
  {
    name: "Portable Bluetooth Speaker",
    oldPrice: 110,
    price: 85,
    discount: 23, // 23% OFF
    rating: 5,
    img: img,
    isNew: true,
    isBestSeller: true,
  },
  {
    name: "Classic Low-Top Sneakers",
    oldPrice: 90,
    price: 75,
    discount: 17, // 17% OFF
    rating: 4,
    img: "https://placehold.co/400x400/00C4B8/ffffff?text=Sneakers",
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
  },
  {
    name: "Smart LED Desk Lamp",
    oldPrice: 60,
    price: 45,
    discount: 25, // 25% OFF
    rating: 5,
    img: "https://placehold.co/400x400/9B59B6/ffffff?text=Desk+Lamp",
    isNew: true,
  },
  {
    name: "Wireless Earbuds Pro",
    oldPrice: 165,
    price: 149,
    discount: 10, // 10% OFF
    rating: 5,
    img: "https://placehold.co/400x400/00C48C/ffffff?text=Earbuds",
  },
  {
    name: "Premium Office Chair",
    oldPrice: 260,
    price: 210,
    discount: 19, // 19% OFF
    rating: 4,
    img: "https://placehold.co/400x400/FF7B7B/ffffff?text=Office+Chair",
    isNew: true,
  },
  {
    name: "4K Ultra HD Monitor",
    oldPrice: 399,
    price: 299,
    discount: 25, // 25% OFF
    rating: 5,
    img: "https://placehold.co/400x400/007BFF/ffffff?text=Monitor",
  },
  {
    name: "Luxury Wristwatch",
    oldPrice: 650,
    price: 420,
    discount: 35, // 35% OFF
    rating: 5,
    img: "https://placehold.co/400x400/FF0055/ffffff?text=Wristwatch",
  },
];

export default function JustArrivedPage() {
  // Filter logic
  const filtered = newArrivals; // Replace with actual filter logic

  return (
    <div>
      <section className="py-8">
        <div className="container mx-auto flex flex-col md:flex-row gap-4 justify-between items-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Just Arrived
          </h1>
          <SortDropdown />
        </div>
      </section>
      <NewArrivalsGrid filtered={filtered} />
    </div>
  );
}
