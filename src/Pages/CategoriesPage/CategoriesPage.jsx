import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import { ChevronDown } from "lucide-react";
import InfiniteControls from "./components/Controls/InfiniteControls";
import Pagination from "../../components/ui/Pagination";
import { useParams, useLocation } from "react-router";

import useProducts from "../../Utils/Hooks/useProducts";
import { useRenderPageNumbers } from "../../Utils/Helpers/useRenderPageNumbers";
import { motion } from "framer-motion";

export default function CategoriesPage() {
  // State & logic ...existing code...
  const { categoryName } = useParams();

  const [activeCategory, setActiveCategory] = useState({
    main: categoryName || "All Products",
    sub: null,
    item: null,
  });

  const [openDropdown, setOpenDropdown] = useState(null);

  const [sortOption, setSortOption] = useState("Newest");
  const [viewMode, setViewMode] = useState("grid");
  const [mode, setMode] = useState("pagination");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

  const [loading, setLoading] = useState(false);
  const { products } = useProducts();
  const categories = [
    {
      name: "Electronics",
      sub: [
        {
          name: "Mobile Phones & Accessories",
          items: [
            "Smartphones",
            "Feature Phones",
            "Phone Cases & Covers",
            "Chargers & Cables",
            "Power Banks",
            "Screen Protectors",
            "Mobile Gadgets & Wearables",
          ],
          attributes: [
            "color",
            "model",
            "ram",
            "storage",
            "warranty",
            "weight",
          ],
        },
        {
          name: "Computers & Accessories",
          items: [
            "Laptops",
            "Desktops",
            "Monitors",
            "Keyboards & Mouse",
            "Storage Devices",
            "Networking Equipment",
            "Printers & Scanners",
            "Laptop Bags & Sleeves",
            "Computer Gadgets & Accessories",
          ],
          attributes: [
            "processor",
            "ram",
            "storage",
            "graphics",
            "color",
            "warranty",
            "weight",
          ],
        },
        {
          name: "Gaming",
          items: ["Gaming Consoles", "Game Controllers", "Gaming Accessories"],
          attributes: [
            "color",
            "compatibility",
            "platform",
            "size",
            "warranty",
            "weight",
          ],
        },
        {
          name: "Audio & Video",
          items: [
            "Headphones & Earphones",
            "Speakers",
            "Home Audio Systems",
            "Televisions & Accessories",
            "Projectors & Screens",
            "Audio Cables & Adapters",
            "Streaming Devices & Media Players",
          ],
          attributes: [
            "color",
            "connectivity",
            "power",
            "type",
            "warranty",
            "weight",
          ],
        },
        {
          name: "Cameras & Photography",
          items: [
            "Digital Cameras",
            "DSLR & Mirrorless Cameras",
            "Camera Lenses",
            "Tripods & Stabilizers",
            "Memory Cards",
            "Camera Bags & Accessories",
            "Photography Gadgets & Accessories",
          ],
          attributes: ["lens", "resolution", "type", "warranty", "weight"],
        },
        {
          name: "Home Appliances",
          items: [
            "Refrigerators",
            "Washing Machines",
            "Microwaves",
            "Air Conditioners",
            "Heaters",
            "Fans",
            "Vacuum Cleaners",
            "Kitchen Appliances",
            "Small Home Appliances & Gadgets",
          ],
          attributes: [
            "capacity",
            "color",
            "energy rating",
            "power",
            "type",
            "warranty",
            "weight",
          ],
        },
      ],
    },
    {
      name: "Fashion",
      sub: [
        {
          name: "Clothing",
          items: [
            "T-Shirts",
            "Shirts",
            "Jeans",
            "Pants & Trousers",
            "Shorts",
            "Jackets & Coats",
            "Hoodies & Sweaters",
            "Dresses",
            "Skirts",
            "Traditional Wear",
            "Innerwear",
            "Sportswear",
          ],
          attributes: ["color", "material", "size"],
        },
        {
          name: "Footwear",
          items: [
            "Sneakers",
            "Formal Shoes",
            "Baby Shoes",
            "Sandals",
            "Boots",
            "Flip-Flops",
          ],
          attributes: ["color", "material", "size"],
        },
        {
          name: "Bags",
          items: ["Backpacks", "Handbags", "Wallets", "Travel Bags"],
          attributes: ["color", "material", "size", "type"],
        },
        {
          name: "Watches & Timepieces",
          items: ["Analog Watches", "Digital Watches", "Smartwatches"],
          attributes: ["color", "material", "size", "type", "water resistance"],
        },
        {
          name: "Jewelry & Accessories",
          items: [
            "Rings",
            "Necklaces",
            "Bracelets",
            "Earrings",
            "Anklets",
            "Sunglasses / Eyewear",
          ],
          attributes: ["color", "size", "material"],
        },
        {
          name: "Head & Face Accessories",
          items: [
            "Caps",
            "Hats",
            "Beanies",
            "Hijab",
            "Scarves",
            "Fabric Face Masks",
            "Buffs",
            "Face Scarves",
          ],
          attributes: ["color", "size", "material", "pattern", "style"],
        },
        {
          name: "Belts & Accessories",
          items: ["Belts", "Suspenders"],
          attributes: ["color", "material", "size", "buckle type", "style"],
        },
        {
          name: "Kids Accessories",
          items: [
            "Kids Backpack",
            "Kids Watch",
            "Hair Accessories",
            "Hats & Caps",
          ],
          attributes: ["age group", "color", "material", "size", "type"],
        },
      ],
    },
    {
      name: "Health & Beauty",
      sub: [
        {
          name: "Skincare",
          items: [
            "Face Cream",
            "Sunscreen",
            "Face Wash",
            "Serums",
            "Face Masks",
          ],
          attributes: ["size", "skin type", "type"],
        },
        {
          name: "Haircare",
          items: [
            "Shampoo",
            "Conditioner",
            "Hair Oil",
            "Hair Serums",
            "Hair Styling Products",
          ],
          attributes: ["hair type", "size", "type"],
        },
        {
          name: "Makeup & Cosmetics",
          items: ["Lipstick", "Foundation", "Eyeliner", "Eyeshadow", "Blush"],
          attributes: ["shade", "size", "type"],
        },
        {
          name: "Personal Care",
          items: [
            "Toothpaste",
            "Body Wash",
            "Deodorant",
            "Shaving Products",
            "Hand Sanitizer",
          ],
          attributes: ["quantity", "type"],
        },
        {
          name: "Fragrances",
          items: ["Perfume", "Body Spray", "Cologne"],
          attributes: ["type", "volumn"],
        },
        {
          name: "Health Supplements",
          items: ["Vitamins", "Protein Powder", "Herbal Supplements"],
          attributes: ["quantity", "size", "type"],
        },
        {
          name: "Beauty Gadgets & Accessories",
          items: ["Grooming Tool"],
          attributes: ["type", "power", "color", "weight", "size"],
        },
      ],
    },
    {
      name: "Furniture & Home Decor",
      sub: [
        {
          name: "Furniture",
          items: ["Sofa", "Bed", "Dining Table", "Chair", "Wardrobe"],
          attributes: ["color", "dimension", "material", "type", "weight"],
        },
        {
          name: "Home Decor",
          items: ["Wall Art", "Lamps", "Rugs", "Clocks", "Decorative Items"],
          attributes: ["color", "material", "size", "type"],
        },
        {
          name: "Kitchen & Dining",
          items: ["Cookware", "Dinnerware", "Cutlery", "Kitchen Storage"],
          attributes: [
            "capacity",
            "color",
            "material",
            "size",
            "type",
            "weight",
          ],
        },
        {
          name: "Bedding & Bath",
          items: ["Bedsheets", "Pillows", "Towels", "Blankets"],
          attributes: ["color", "material", "size", "type", "weight"],
        },
        {
          name: "Home Gadgets & Accessories",
          items: [
            "Air Purifier",
            "Smart Plugs",
            "Humidifier",
            "Electric Kettle",
            "Smart Lighting",
            "Home Organizer & Tissue Holder",
          ],
          attributes: ["color", "power", "size", "type", "weight"],
        },
      ],
    },
    {
      name: "Sports & Outdoors",
      sub: [
        {
          name: "Exercise & Fitness",
          items: ["Treadmill", "Dumbbells", "Yoga Mat", "Resistance Bands"],
          attributes: ["material", "resistance", "type", "weight"],
        },
        {
          name: "Outdoor & Adventure",
          items: [
            "Tents",
            "Sleeping Bags",
            "Camping Lantern",
            "Hiking Backpack",
          ],
          attributes: [
            "capacity",
            "color",
            "material",
            "size",
            "type",
            "weight",
          ],
        },
        {
          name: "Sports Equipment",
          items: [
            "Football",
            "Cricket Bat & Ball",
            "Badminton Set",
            "Basketball",
          ],
          attributes: ["color", "material", "size", "type", "weight"],
        },
        {
          name: "Sports Gadgets & Accessories",
          items: [
            "Water Bottle",
            "Fitness Tracker",
            "Sports Gloves",
            "Gym Bag",
          ],
          attributes: ["color", "material", "size", "type", "weight"],
        },
      ],
    },
    {
      name: "Toys & Baby Products",
      sub: [
        {
          name: "Baby Care",
          items: ["Diapers", "Baby Wipes", "Baby Lotion", "Feeding Bottles"],
          attributes: ["age group", "quantity", "size", "type", "weight"],
        },
        {
          name: "Toys",
          items: [
            "Stuffed Animals",
            "Educational Toys",
            "Action Figures",
            "Puzzles",
          ],
          attributes: [
            "age group",
            "color",
            "material",
            "size",
            "type",
            "weight",
          ],
        },
        {
          name: "Kids Gadgets & Accessories",
          items: [
            "Baby Monitor",
            "Baby Carrier",
            "Kids Watch",
            "Kids Backpack",
          ],
          attributes: ["age group", "power", "type", "weight"],
        },
      ],
    },
    {
      name: "Automotive & Industrial",
      sub: [
        {
          name: "Car Accessories",
          items: [
            "Car Cover",
            "Seat Covers",
            "Car Vacuum Cleaner",
            "Dashboard Camera",
          ],
          attributes: ["compatibility", "size", "type", "quantity", "weight"],
        },
        {
          name: "Motorbike Accessories",
          items: [
            "Helmets",
            "Gloves",
            "Motorbike Cover",
            "Handlebar Accessories",
          ],
          attributes: [
            "color",
            "compatibility",
            "material",
            "size",
            "type",
            "weight",
          ],
        },
        {
          name: "Tools & Equipment",
          items: ["Wrench Set", "Screwdrivers", "Power Drill", "Tool Box"],
          attributes: ["material", "size", "type", "weight"],
        },
        {
          name: "Safety & Security",
          items: [
            "CCTV Camera",
            "Car Alarm",
            "Fire Extinguisher",
            "First Aid Kit",
            "Security Sensors & Gadgets",
          ],
          attributes: ["power", "size", "type", "weight"],
        },
        {
          name: "Automotive Gadgets & Accessories",
          items: [
            "GPS Navigator",
            "Car Charger",
            "Jump Starter",
            "Tire Inflator",
          ],
          attributes: ["color", "compatibility", "material", "type"],
        },
      ],
    },
    {
      name: "Grocery & Food Items",
      sub: [
        {
          name: "Beverages",
          items: ["Tea", "Coffee", "Soft Drinks", "Juices"],
          attributes: ["flavor", "type", "volume", "weight"],
        },
        {
          name: "Snacks & Confectionery",
          items: ["Chips", "Biscuits", "Chocolates", "Nuts"],
          attributes: ["size", "type", "weight"],
        },
        {
          name: "Cooking Essentials",
          items: ["Cooking Oil", "Spices", "Flour", "Sugar"],
          attributes: ["quantity", "size", "type", "weight"],
        },
        {
          name: "Dairy & Eggs",
          items: ["Milk", "Cheese", "Yogurt", "Eggs"],
          attributes: ["quantity", "size", "type", "weight"],
        },
        {
          name: "Organic & Imported Items",
          items: [
            "Organic Honey",
            "Imported Chocolate",
            "Gluten-Free Products",
            "Organic Cereals",
          ],
          attributes: ["quantity", "size", "type", "weight"],
        },
        {
          name: "Specialty Foods & Gourmet Items",
          items: [
            "Sauces & Condiments",
            "Gourmet Snacks",
            "Premium Coffee/Tea",
            "Exotic Spices",
          ],
          attributes: ["quantity", "size", "type", "weight"],
        },
      ],
    },
    {
      name: "Pets & Pet Care",
      sub: [
        {
          name: "Pet Food",
          items: ["Dog Food", "Cat Food", "Bird Feed", "Fish Food"],
          attributes: ["flavor", "quantity", "size", "type", "weight"],
        },
        {
          name: "Pet Accessories",
          items: ["Pet Collar & Leash", "Pet Bed", "Pet Toys", "Pet Bowls"],
          attributes: ["color", "material", "size", "type", "weight"],
        },
        {
          name: "Pet Care Products",
          items: ["Pet Shampoo", "Pet Grooming Tools", "Flea & Tick Treatment"],
          attributes: ["quantity", "size", "type", "weight"],
        },
        {
          name: "Pet Gadgets & Accessories",
          items: ["Automatic Feeder", "Pet Camera", "Pet Tracker"],
          attributes: ["power", "quantity", "type", "weight"],
        },
      ],
    },
  ];

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryProduct = params.get("product"); // encoded product ID
  const subcategory = params.get("subcategory");
  const subcategoryItem = decodeURIComponent(params.get("subcategory_item"));

  const [highlightedProduct, setHighlightedProduct] = useState(
    queryProduct ? queryProduct : null,
  );

  const filteredProducts = products.filter((product) => {
    // Check category match
    const matchesTag =
      activeCategory.main === "All Products" ||
      (product.category === activeCategory.main &&
        product.subcategory === activeCategory.sub &&
        product.subcategory_item === activeCategory.item);

    // Check product highlight / search safely
    const matchesSearch =
      highlightedProduct && product.product_name
        ? product.product_name
            .toLowerCase()
            .includes(highlightedProduct.toLowerCase())
        : true; // যদি highlightedProduct না থাকে, সব match হবে

    return matchesTag && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "Price: Low to High")
      return (
        (a.sale_price > 0 ? a.sale_price : a.regular_price) -
        (b.sale_price > 0 ? b.sale_price : b.regular_price)
      );
    if (sortOption === "Price: High to Low")
      return (
        (b.sale_price > 0 ? b.sale_price : b.regular_price) -
        (a.sale_price > 0 ? a.sale_price : a.regular_price)
      );
    if (sortOption === "Rating") {
      // Compute b's rating
      const bRating =
        b.rating > 0
          ? b.rating
          : b.reviews && b.reviews.length > 0
            ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
            : 0;

      // Compute a's rating
      const aRating =
        a.rating > 0
          ? a.rating
          : a.reviews && a.reviews.length > 0
            ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length
            : 0;

      return bRating - aRating; // High → Low
    }
  });
  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const visibleProducts = sortedProducts.slice(0, visibleCount);

  const loadMore = async () => {
    if (loading) return;
    if (visibleCount >= sortedProducts.length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setVisibleCount((v) => Math.min(sortedProducts.length, v + itemsPerPage));
    setLoading(false);
  };
  useEffect(() => {
    if (mode !== "infinite") return;
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY + 120 >=
        document.documentElement.offsetHeight;
      if (nearBottom && !loading) loadMore();
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode, visibleCount, loading, sortedProducts.length]);
  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(itemsPerPage);
  }, [activeCategory.main, sortOption, mode]);
  useEffect(() => {
    if (categoryName) {
      const findCategory = categories.find((cat) => cat.name === categoryName);
      if (subcategory && subcategoryItem) {
        setActiveCategory({
          main: categoryName,
          sub: subcategory,
          item: subcategoryItem,
        });
      } else {
        const firstSub = findCategory?.sub?.[0];
        const firstItem = firstSub?.items?.[0] || null;

        setActiveCategory({
          main: categoryName,
          sub: firstSub?.name,
          item: firstItem,
        });
      }
    }
  }, [categoryName]);

  const productsToRender =
    mode === "pagination" ? pageProducts : visibleProducts;
  // Main layout

  const renderPageNumbers = useRenderPageNumbers(
    currentPage,
    totalPages,
    setCurrentPage,
  );
  useEffect(() => {
    if (queryProduct) {
      setHighlightedProduct(queryProduct);
    }
  }, [queryProduct]);
  const availableMap = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = {};
    if (!acc[p.category][p.subcategory])
      acc[p.category][p.subcategory] = new Set();
    acc[p.category][p.subcategory].add(p.subcategory_item);
    return acc;
  }, {});

  const filteredCategories = categories
    .map((cat) => {
      const availableSub = availableMap[cat.name];
      if (!availableSub) return null;

      const filteredSub = cat.sub
        .map((sub) => {
          const availableItems = availableSub[sub.name];
          if (!availableItems) return null;

          const filteredItems = sub.items.filter((item) =>
            availableItems.has(item),
          );

          if (filteredItems.length === 0) return null;

          return {
            ...sub,
            items: filteredItems,
          };
        })
        .filter(Boolean);

      if (filteredSub.length === 0) return null;

      return {
        ...cat,
        sub: filteredSub,
      };
    })
    .filter(Boolean);

  return (
    <section>
      <section className="relative w-full py-20 flex items-center justify-center bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] overflow-hidden ">
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="sm:text-4xl text-2xl md:text-6xl font-extrabold text-white drop-shadow-md"
          >
            Explore Categories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 sm:text-lg md:text-xl  text-white drop-shadow-md "
          >
            Browse organized categories and find what you need, with quality
            selections to elevate your experience.
          </motion.p>
        </div>
      </section>
      <div className="w-full bg-gray-100 text-gray-800 min-h-screen md:py-10 py-6">
        <div className="container mx-auto xl:px-6 lg:px-6  px-4 ">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <Sidebar
              categories={filteredCategories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              openDropdown={openDropdown}
              subcategory={subcategory}
              item={subcategoryItem}
              setOpenDropdown={setOpenDropdown}
            />
            {/* Products + controls */}
            <section className="flex-1">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                {/* Showing Count */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Showing</span>
                  <span className="font-semibold text-gray-900">
                    {mode === "pagination"
                      ? `${startIndex + 1} - ${Math.min(
                          startIndex + itemsPerPage,
                          sortedProducts.length,
                        )}`
                      : `1 - ${Math.min(visibleCount, sortedProducts.length)}`}
                  </span>
                  <span>of {sortedProducts.length}</span>
                </div>

                {/* Sorting & View Mode */}
                <div className="flex  items-center gap-4">
                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm text-gray-800 font-semibold shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0055] transition cursor-pointer"
                      style={{ fontFamily: "Poppins", fontWeight: 700 }}
                    >
                      <option>Newest</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Rating</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
                  </div>

                  {/* View Mode Buttons */}

                  <div className="hidden md:flex items-center gap-2 text-sm ">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-2 rounded-lg ${
                        viewMode === "grid"
                          ? "bg-[#FF0055] text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-2 rounded-lg ${
                        viewMode === "list"
                          ? "bg-[#FF0055] text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      List
                    </button>
                  </div>
                </div>

                {/* Display Mode */}
                <div className="flex  items-center gap-2 text-sm text-gray-600">
                  <span>Mode:</span>
                  <button
                    onClick={() => setMode("pagination")}
                    className={`px-3 py-2 rounded-lg ${
                      mode === "pagination"
                        ? "bg-[#FF0055] text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Pagination
                  </button>
                  <button
                    onClick={() => setMode("infinite")}
                    className={`px-3 py-2 rounded-lg ${
                      mode === "infinite"
                        ? "bg-[#FF0055] text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Infinite
                  </button>
                </div>
              </div>

              {/* Products grid / list */}

              <ProductGrid
                products={productsToRender}
                viewMode={viewMode}
                loading={loading}
                itemsPerPage={itemsPerPage}
                sortedProducts={sortedProducts}
              />

              {/* Controls under grid */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Pagination controls */}
                {mode === "pagination" && totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    renderPageNumbers={renderPageNumbers}
                  />
                )}
                {/* Infinite / Load more controls */}
                {mode === "infinite" && (
                  <InfiniteControls
                    visibleCount={visibleCount}
                    sortedProducts={sortedProducts}
                    loading={loading}
                    loadMore={loadMore}
                  />
                )}
                {/* Mode switch for small screens */}
                <div className="sm:hidden mt-2">
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      onClick={() =>
                        setMode(
                          mode === "pagination" ? "infinite" : "pagination",
                        )
                      }
                      className="text-sm underline text-gray-600"
                    >
                      Switch to{" "}
                      {mode === "pagination" ? "Infinite" : "Pagination"}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
