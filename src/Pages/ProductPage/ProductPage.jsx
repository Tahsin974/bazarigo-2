import { useParams } from "react-router";
import { sampleProducts } from "../../Utils/Helpers/Helpers";
import ProductDetails from "./components/ProductDetails";

export default function ProductPage() {
  const { id } = useParams();
  const AllProducts = sampleProducts();
  const productDetails = AllProducts.find((p) => p.id === id);
  if (!productDetails) {
    return (
      <div className="xl:px-6 lg:px-6  px-4 text-center text-red-500">
        Product not found
      </div>
    );
  }
  return (
    <div className="space-y-24 xl:px-6 lg:px-6  px-4 bg-gray-100">
      <ProductDetails
        product={productDetails}
        category={productDetails.category}
        subcategory={productDetails.subcategory || ""}
      />
    </div>
  );
}

// const SAMPLE = {
//   electronics: {
//     name: "Sleek Wireless Headphones",
//     price: "৳120.00",
//     rating: 4,
//     reviews: 87,
//     stock: 12,
//     img: "https://placehold.co/600x600/FF0055/fff?text=Headphones",
//     brand: "AudioTech",
//     model: "AT-X100",
//     specs: "Bluetooth 5.2, 30h battery, Noise-canceling",
//     related: [
//       {
//         name: "Portable Bluetooth Speaker",
//         price: "৳85.00",
//         img: "https://placehold.co/400x400/F39C12/ffffff?text=Speaker",
//       },
//     ],
//     variants: {
//       size: ["S", "M", "L"],
//       color: ["Red", "Blue"],
//       weight: ["Light", "Regular", "Heavy"],
//     },
//     recommendations: [],
//     reviewsList: [
//       {
//         name: "Jane Doe",
//         rating: 5,
//         comment: "Fantastic sound!",
//         date: new Date().toISOString(),
//       },
//     ],
//   },
//   fashion: {
//     name: "Classic Cotton Shirt",
//     price: "৳35.00",
//     rating: 5,
//     stock: 30,
//     img: "https://placehold.co/600x600/00C48C/fff?text=Shirt",
//     material: "100% Cotton",
//     size: "S, M, L, XL",
//     color: "Navy",
//     related: [],
//     recommendations: [],
//     reviewsList: [],
//   },
//   book: {
//     name: "The Modern Developer",
//     price: "৳22.00",
//     rating: 4,
//     stock: 5,
//     img: "https://placehold.co/600x600/9B59B6/fff?text=Book",
//     author: "A. Coder",
//     publisher: "Tech Press",
//     isbn: "978-1-23456-789-7",
//     related: [],
//     recommendations: [],
//     reviewsList: [],
//   },
//   home: {
//     name: "Ceramic Coffee Mug",
//     price: "৳12.00",
//     rating: 4,
//     stock: 100,
//     img: "https://placehold.co/600x600/FF7B7B/fff?text=Mug",
//     material: "Ceramic",
//     dimensions: "8cm x 10cm",
//     care: "Dishwasher safe",
//     related: [],
//     recommendations: [],
//     reviewsList: [],
//   },
//   decor: {
//     name: "Minimalist Wall Clock",
//     price: "৳48.00",
//     rating: 4,
//     stock: 7,
//     img: "https://placehold.co/600x600/E5FFFF/333?text=Clock",
//     material: "Metal & Glass",
//     style: "Scandinavian",
//     dimensions: "30cm diameter",
//     related: [],
//     recommendations: [],
//     reviewsList: [],
//   },
// };
