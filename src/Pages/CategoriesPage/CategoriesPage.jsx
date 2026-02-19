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
          name: "Mobile Phones",
          items: ["Smartphone", "Feature Phone"],
          attributes: [
            "model",
            "ram",
            "storage",
            "color",
            "screen size",
            "battery capacity",
            "warranty",
          ],
        },
        {
          name: "Tablets & Readers",
          items: ["Tablet", "E-Reader"],
          attributes: [
            "model",
            "ram",
            "storage",
            "color",
            "screen size",
            "battery capacity",
            "warranty",
          ],
        },
        {
          name: "Mobile Accessories",
          items: [
            "Charger",
            "USB Cable",
            "Power Bank",
            "Battery",
            "Mobile Cover",
            "Screen Protector",
            "Camera Lens Protector",
            "Charging Dock",
            "Mobile Stand",
            "Mobile Mouse & Keyboard",
            "Selfie Stick",
            "Tripod",
            "Smart Watch",
            "Ring Light",
            "Phone Cooling Fan",
            "SIM Ejector Pin",
          ],
          attributes: ["type", "compatibility", "color", "size"],
        },
        {
          name: "Audio & Headphones",
          items: [
            "Earphones",
            "Earbuds",
            "Headphones",
            "Speaker",
            "Sound Bar",
            "Home Theater",
            "Karaoke System",
            "Microphone",
            "Audio Interface",
            "Sound Card",
          ],
          attributes: ["type", "connectivity", "color", "battery life"],
        },
        {
          name: "Computers & Laptops",
          items: ["Laptop", "Desktop", "Mini PC", "All In One PC", "Monitor"],
          attributes: [
            "model",
            "processor",
            "ram",
            "storage",
            "color",
            "screen size",
            "warranty",
            "weight",
          ],
        },
        {
          name: "Computer Accessories",
          items: [
            "Keyboard",
            "Mouse",
            "Mouse Pad",
            "Laptop Stand",
            "Monitor Stand",
            "Cooling Pad",
            "Laptop Charger",
            "Laptop Battery",
            "Keyboard Cover",
            "Screen Protector",
            "Laptop Bag",
            "USB Hub",
            "Docking Station",
            "Hard Disk",
            "SSD",
            "Pen Drive",
            "Memory Card",
            "Card Reader",
            "Webcam",
            "Headphone Stand",
          ],
          attributes: ["type", "compatibility", "color", "size"],
        },
        {
          name: "Printers & Scanners",
          items: [
            "Printer",
            "Scanner",
            "Photocopy Machine",
            "Printer Ink",
            "POS Machine",
            "Barcode Scanner",
            "Barcode Printer",
            "Label Printer",
            "Cash Drawer",
            "Money Counter",
            "Paper Shredder",
          ],
          attributes: [
            "type",
            "connectivity",
            "color",
            "warranty",
            "size",
            "weight",
          ],
        },
        {
          name: "Television & Display",
          items: [
            "Television",
            "Set Top Box",
            "Streaming Device",
            "Projector",
            "Projector Screen",
            "Television Remote",
            "Television Stand",
            "Television Wall Mount",
          ],
          attributes: [
            "screen size",
            "resolution",
            "color",
            "smart tv",
            "warranty",
            "weight",
          ],
        },
        {
          name: "Power & Electricals",
          items: [
            "UPS",
            "Inverter",
            "Solar Panel",
            "Solar Charge Controller",
            "Solar Battery",
            "Voltage Stabilizer",
            "Extension Board",
            "Electrical Wire",
            "Power Cable",
            "Plug",
            "Switch",
            "Socket",
            "Circuit Breaker",
            "Fuse",
            "Emergency Light",
          ],
          attributes: [
            "type",
            "capacity",
            "color",
            "voltage",
            "size",
            "weight",
          ],
        },
        {
          name: "Camera & Security",
          items: [
            "Camera",
            "Lens",
            "Filter",
            "Battery",
            "Charger",
            "Tripod",
            "Gimbal",
            "Bag",
            "Drone",
            "CCTV",
            "IP Camera",
            "PTZ Camera",
            "DVR",
            "NVR",
            "Video Door Bell",
            "Smart Door Lock",
          ],
          attributes: [
            "type",
            "resolution",
            "color",
            "night vision",
            "warranty",
            "size",
          ],
        },
      ],
    },
    {
      name: "Fashion",
      sub: [
        {
          name: "Men's Clothing",
          items: [
            "T-Shirt",
            "Polo Shirt",
            "Shirt",
            "Pant",
            "Shorts",
            "Joggers",
            "Panjabi",
            "Sherwani",
            "Lungi",
            "Pajama",
            "Kurta",
            "Jacket",
            "Coat",
            "Hoodie",
            "Sweater",
            "Sweatshirt",
            "Cardigan",
            "Blazer",
            "Waistcoat",
            "Raincoat",
            "Thermal Inner",
          ],
          attributes: ["type", "size", "material", "color"],
        },
        {
          name: "Women's Clothing",
          items: [
            "Top",
            "T-Shirt",
            "Shirt",
            "Kurti",
            "Tunic",
            "Jacket",
            "Coat",
            "Hoodie",
            "Sweater",
            "Blazer",
            "Gown",
            "Skirt",
            "Palazzo",
            "Leggings",
            "Jeggings",
            "Saree",
            "Salwar Kameez",
            "Three Piece",
            "Two Piece",
            "Nighty",
            "Loungewear",
            "Hijab",
            "Niqab",
            "Burqa",
            "Shawl",
            "Dupatta",
          ],
          attributes: ["type", "size", "material", "color"],
        },
        {
          name: "Kids' Clothing",
          items: [
            "Kids T-Shirt",
            "Kids Polo Shirt",
            "Kids Shirt",
            "Kids Pant",
            "Kids Shorts",
            "Kids Sweatshirt",
            "Kids Jacket",
            "Kids Hoodie",
            "Kids Sweater",
            "Kids Dress",
            "Baby T-Shirt",
            "Baby Shirt",
            "Baby Pant",
            "Baby Jumpsuit",
            "Baby Romper",
            "Baby Frock",
            "Baby Pajama",
          ],
          attributes: ["age", "type", "size", "material", "color"],
        },
        {
          name: "Inner & Sleepwear",
          items: [
            "Bra",
            "Panty",
            "Lingerie Set",
            "Nightwear Set",
            "Boxer",
            "Trunk",
            "Brief",
            "Vest",
            "Thermal Wear",
          ],
          attributes: ["type", "size", "color", "material"],
        },
        {
          name: "Footwear",
          items: [
            "Shoes",
            "Sandal",
            "Slipper",
            "Flip Flop",
            "Loafer",
            "Boot",
            "Heel",
            "Flat",
            "Wedge",
            "Kids Shoes",
            "Kids Sandal",
            "Kids Slipper",
            "Kids Flip Flop",
            "Kids Loafer",
            "Baby Shoes",
            "Baby Sandal",
            "Baby Slipper",
          ],
          attributes: ["type", "size", "material", "color"],
        },
        {
          name: "Fashion Accessories",
          items: [
            "Wrist Watch",
            "Smart Watch Strap",
            "Sunglass",
            "Optical Frame",
            "Belt",
            "Wallet",
            "Card Holder",
            "Handbag",
            "Shoulder Bag",
            "Tote Bag",
            "Backpack",
            "Travel Bag",
            "Luggage",
            "Cap",
            "Hat",
            "Tie",
            "Fabric Mask",
            "Scarf",
            "Socks",
            "Gloves",
            "Umbrella",
          ],
          attributes: ["type", "size", "material", "color"],
        },
        {
          name: "Jewelry",
          items: [
            "Necklace",
            "Pendant",
            "Earring",
            "Nose Pin",
            "Ring",
            "Bracelet",
            "Bangle",
            "Anklet",
            "Toe Ring",
            "Bridal Jewelry",
          ],
          attributes: ["type", "size", "material", "color"],
        },
      ],
    },
    {
      name: "Health & Beauty",
      sub: [
        {
          name: "Skin Care",
          items: [
            "Face Wash",
            "Cleanser",
            "Scrub",
            "Exfoliator",
            "Mask",
            "Cream",
            "Moisturizer",
            "Sunscreen",
            "Toner",
            "Serum",
            "Face Oil",
          ],
          attributes: ["type", "skin type", "volume", "weight"],
        },
        {
          name: "Hair Care",
          items: [
            "Shampoo",
            "Conditioner",
            "Hair Oil",
            "Serum",
            "Mask",
            "Color",
            "Spray",
            "Gel",
            "Wax",
          ],
          attributes: ["type", "hair type", "volume", "weight"],
        },
        {
          name: "Makeup",
          items: [
            "Foundation",
            "BB Cream",
            "CC Cream",
            "Concealer",
            "Powder",
            "Blush",
            "Highlighter",
            "Bronzer",
            "Eyeshadow",
            "Eyeliner",
            "Kajal",
            "Mascara",
            "Lipstick",
            "Lip Balm",
            "Lip Gloss",
            "Nail Polish",
            "Remover",
          ],
          attributes: ["type", "shade", "volume", "weight"],
        },
        {
          name: "Beauty Tools",
          items: [
            "Makeup Brush",
            "Makeup Sponge",
            "Face Roller",
            "Massager",
            "Facial Steamer",
            "Hair Dryer",
            "Straightener",
            "Curler",
            "Trimmer",
            "Shaver",
            "Epilator",
          ],
          attributes: ["type", "power source", "size", "color"],
        },
        {
          name: "Personal Care",
          items: [
            "Soap",
            "Body Wash",
            "Shower Gel",
            "Body Lotion",
            "Body Butter",
            "Body Scrub",
            "Hand Wash",
            "Hand Cream",
            "Foot Cream",
            "Toothpaste",
            "Toothbrush",
            "Mouthwash",
            "Deodorant",
            "Perfume",
            "Talcum Powder",
          ],
          attributes: ["type", "quantity", "volume", "weight"],
        },
        {
          name: "Feminine & Baby Products",
          items: [
            "Sanitary Napkin",
            "Panty Liner",
            "Menstrual Cup",
            "Pregnancy Test Kit",
            "Baby Shampoo",
            "Baby Soap",
            "Baby Lotion",
            "Baby Oil",
            "Baby Powder",
          ],
          attributes: ["type", "quantity", "volume", "weight"],
        },
        {
          name: "Medical Supplies",
          items: [
            "Thermometer",
            "Blood Pressure Machine",
            "Glucometer",
            "Pulse Oximeter",
            "Nebulizer",
            "Heating Pad",
            "Hot Water Bag",
            "Medical Mask",
            "Sanitizer",
            "Vitamins",
            "Supplements",
            "First Aid Kit",
            "Bandage",
            "Gauze",
            "Medical Gloves",
          ],
          attributes: ["type", "certification", "expiry date", "weight"],
        },
      ],
    },
    {
      name: "Home & Living",
      sub: [
        {
          name: "Furniture",
          items: [
            "Sofa",
            "Chair",
            "Table",
            "Bed",
            "Mattress",
            "Wardrobe",
            "Cabinet",
            "Drawer",
            "Shelf",
            "Shoe Rack",
            "Storage Rack",
            "Television Cabinet",
            "Dressing Table",
            "Prayer Stool",
          ],
          attributes: ["type", "material", "color", "dimensions", "weight"],
        },
        {
          name: "Home Appliances",
          items: [
            "Refrigerator",
            "Deep Freezer",
            "Washing Machine",
            "Oven",
            "Rice Cooker",
            "Pressure Cooker",
            "Induction Stove",
            "Electric Stove",
            "Gas Stove",
            "Air Fryer",
            "Sandwich Maker",
            "Waffle Maker",
            "Toaster",
            "Blender",
            "Juicer",
            "Mixer Grinder",
            "Yogurt Maker",
            "Food Processor",
            "Electric Kettle",
            "Coffee Maker",
            "Vacuum Cleaner",
            "Iron",
            "Sewing Machine",
            "Fan",
            "Air Cooler",
            "Room Heater",
            "Water Heater",
            "Geyser",
            "Water Purifier",
            "Air Conditioner",
            "Air Purifier",
            "Humidifier",
            "Dehumidifier",
            "Electric Insect Trap",
            "Electric Rat Trap",
          ],
          attributes: [
            "type",
            "capacity",
            "size",
            "color",
            "warranty",
            "weight",
          ],
        },
        {
          name: "Kitchen & Dining",
          items: [
            "Cooking Pot",
            "Saucepan",
            "Frying Pan",
            "Wok",
            "Knife",
            "Chopper",
            "Peeler",
            "Grater",
            "Spoon",
            "Fork",
            "Plate",
            "Bowl",
            "Glass",
            "Mug",
            "Water Bottle",
            "Lunch Box",
            "Food Container",
            "Spice Box",
            "Oil Dispenser",
            "Cutting Board",
            "Kitchen Scale",
            "Dumpling Maker",
          ],
          attributes: [
            "type",
            "material",
            "color",
            "size",
            "capacity",
            "weight",
          ],
        },
        {
          name: "Cleaning Supplies",
          items: [
            "Air Freshener",
            "Bleach",
            "Broom",
            "Cleaning Brush",
            "Cleaning Cloth",
            "Cleaning Duster",
            "Cleaning Gloves",
            "Dish Wash Gloves",
            "Dishwashing Liquid",
            "Dishwashing Sponge",
            "Disinfectant Spray",
            "Drain Cleaner Tool",
            "Dustpan",
            "Floor Cleaner",
            "Floor Disinfectant",
            "Garbage Bag",
            "Glass Cleaner",
            "Kitchen Gloves",
            "Microfiber Cloth",
            "Mop",
            "Steel Wool",
            "Toilet Brush",
            "Toilet Cleaner",
            "Toilet Freshener",
            "Toilet Plunger",
            "Wiper",
            "Scrubber",
          ],
          attributes: [
            "type",
            "material",
            "color",
            "size",
            "quantity",
            "volume",
            "weight",
          ],
        },
        {
          name: "Home Essentials",
          items: [
            "Curtain",
            "Carpet",
            "Rug",
            "Mat",
            "Doormat",
            "Tissue Box Organizer",
          ],
          attributes: ["type", "material", "color", "size", "weight"],
        },
        {
          name: "Bedding",
          items: [
            "Pillow",
            "Cushion",
            "Bed Sheet",
            "Pillow Cover",
            "Blanket",
            "Comforter",
            "Quilt",
            "Mosquito Net",
          ],
          attributes: ["type", "material", "color", "size", "weight"],
        },
        {
          name: "Lighting & Décor",
          items: [
            "Bulbs",
            "Lights",
            "Lamps",
            "Wall Clock",
            "Photo Frame",
            "Mirror",
            "Flower Vase",
            "Artificial Flower",
          ],
          attributes: ["type", "dimensions", "color"],
        },
        {
          name: "Laundry",
          items: [
            "Laundry Basket",
            "Laundry Bag",
            "Detergent Powder",
            "Detergent Liquid",
            "Iron Board",
            "Hanger",
          ],
          attributes: ["type", "quantity", "weight", "color", "size"],
        },
        {
          name: "Bathroom",
          items: [
            "Bucket",
            "Bathroom Mug",
            "Water Drum",
            "Bathroom Mat",
            "Bathroom Shelf",
            "Soap Dispenser",
            "Toothbrush Holder",
            "Shower Head",
            "Tap",
            "Water Valve",
          ],
          attributes: ["type", "quantity", "volume", "color", "size"],
        },
        {
          name: "Hardware & Tools",
          items: [
            "Hammer",
            "Screwdriver",
            "Plier",
            "Wrench",
            "Measuring Tape",
            "Digital Weighing Scale",
            "Mechanical Scale",
            "Cutter",
            "Drill Machine",
            "Drill Bit",
            "Screw",
            "Nail",
            "Nut",
            "Bolt",
            "Padlock",
          ],
          attributes: ["type", "material", "size", "weight"],
        },
        {
          name: "Religious & Spiritual",
          items: [
            "Prayer Mat",
            "Tasbih",
            "Holy Books",
            "Book Stand",
            "Agarbatti",
            "Dhoop",
            "Diya",
            "Puja Thali",
            "Bell",
            "Religious Idol",
            "Wall Frame",
            "Photo Frame",
            "Prayer Cap",
            "Attar",
            "Rudraksha",
            "Spiritual Bracelet",
            "Yantra",
            "Talisman",
            "Festival Decoration",
            "Donation Box",
          ],
          attributes: ["type", "material", "color", "size", "occasion"],
        },
      ],
    },
    {
      name: "Grocery & Food",
      sub: [
        {
          name: "Staples & Grains",
          items: [
            "Rice",
            "Wheat",
            "Flour",
            "Semolina",
            "Lentil",
            "Chickpea",
            "Green Pea",
          ],
          attributes: ["type", "weight", "quantity", "volume"],
        },
        {
          name: "Cooking Essentials",
          items: [
            "Salt",
            "Sugar",
            "Molasses",
            "Oil",
            "Ghee",
            "Butter",
            "Spice",
          ],
          attributes: ["type", "weight", "quantity", "volume"],
        },
        {
          name: "Dairy & Protein",
          items: ["Milk", "Powder Milk", "Yogurt", "Cheese", "Egg"],
          attributes: ["type", "weight", "quantity", "volume"],
        },
        {
          name: "Meat & Fish",
          items: ["Chicken", "Beef", "Mutton", "Fish"],
          attributes: ["type", "quantity", "weight"],
        },
        {
          name: "Snacks",
          items: [
            "Biscuit",
            "Cookies",
            "Cake",
            "Chocolate",
            "Candy",
            "Chips",
            "Chanachur",
            "Muri",
            "Chira",
            "Popcorn",
          ],
          attributes: ["type", "weight", "quantity", "volume"],
        },
        {
          name: "Frozen & Packaged Food",
          items: [
            "Frozen Paratha",
            "Ice Cream",
            "Nugget",
            "Singara",
            "Sausage",
            "Ready Meal",
          ],
          attributes: ["type", "weight", "quantity", "volume"],
        },
        {
          name: "Beverages",
          items: [
            "Tea",
            "Coffee",
            "Mineral Water",
            "Soft Drink",
            "Energy Drink",
            "Juice",
            "Syrup",
          ],
          attributes: ["type", "weight", "quantity", "volume"],
        },
        {
          name: "Baby Food & Formula",
          items: ["Baby Food", "Baby Cereal"],
          attributes: ["age", "type", "weight", "quantity", "volume"],
        },
        {
          name: "Condiments & Spreads",
          items: ["Honey", "Jam", "Pickle", "Sauce"],
          attributes: ["type", "weight", "quantity", "volume"],
        },
      ],
    },
    {
      name: "Sports & Outdoor",
      sub: [
        {
          name: "Sports Equipment",
          items: [
            "Cricket Equipment",
            "Football Equipment",
            "Basketball Equipment",
            "Volleyball Equipment",
            "Badminton Equipment",
            "Tennis Equipment",
            "Table Tennis Equipment",
          ],
          attributes: ["type", "size", "color", "material", "weight"],
        },
        {
          name: "Sports Accessories",
          items: [
            "Cricket Accessories",
            "Football Accessories",
            "Basketball Accessories",
            "Volleyball Accessories",
            "Badminton Accessories",
            "Tennis Accessories",
            "Table Tennis Accessories",
          ],
          attributes: ["type", "color", "size", "material"],
        },
        {
          name: "Fitness & Exercise",
          items: ["Gym Equipment"],
          attributes: ["type", "color", "size", "material", "weight"],
        },
        {
          name: "Cycling",
          items: ["Bicycle", "Helmet", "Light", "Lock"],
          attributes: ["type", "size", "color", "material", "weight"],
        },
        {
          name: "Camping & Hiking",
          items: [
            "Camping Tent",
            "Sleeping Bag",
            "Camping Chair",
            "Camping Table",
            "Hiking Backpack",
            "Hiking Stick",
          ],
          attributes: ["type", "size", "color", "material", "weight"],
        },
        {
          name: "Fishing",
          items: ["Fishing Rod", "Fishing Reel"],
          attributes: ["type", "color", "size", "material"],
        },
      ],
    },
    {
      name: "Toys & Kids",
      sub: [
        {
          name: "Toys",
          items: [
            "Soft Toy",
            "Teddy Bear",
            "Doll",
            "Action Figure",
            "Remote Control Car",
            "Remote Control Drone",
            "Puzzle",
            "Board Game",
            "Building Blocks",
            "Musical Toy",
            "Educational Toy",
            "Science Kit",
          ],
          attributes: ["type", "age", "size", "color", "material"],
        },
        {
          name: "Baby care & Essentials",
          items: [
            "Diaper",
            "Wipes",
            "Kids Water Bottle",
            "Feeder",
            "Sterilizer",
          ],
          attributes: ["type", "age", "quantity", "size"],
        },
        {
          name: "Baby Gear",
          items: [
            "Walker",
            "Stroller",
            "Carrier",
            "Crib",
            "Bed",
            "Mosquito Net",
          ],
          attributes: ["type", "age", "color", "material", "size", "weight"],
        },
        {
          name: "Learning & School Supplies",
          items: ["School Bag", "Lunch Bag", "Stationery", "Books"],
          attributes: ["type", "size", "color", "material"],
        },
      ],
    },
    {
      name: "Pet Supplies",
      sub: [
        {
          name: "Pet Food",
          items: [
            "Cat Food",
            "Dog Food",
            "Bird Food",
            "Fish Food",
            "Turtle Food",
            "Rabbit Food",
          ],
          attributes: ["age", "weight", "quantity", "volume"],
        },
        {
          name: "Pet Accessories",
          items: [
            "Pet Bed",
            "Pet Cage",
            "Pet House",
            "Pet Carrier",
            "Pet Leash",
            "Pet Collar",
            "Pet Harness",
            "Pet Diaper",
            "Pet Wipes",
            "Pet Training Pad",
            "Pet Food Bowl",
            "Pet Water Fountain",
            "Pet Litter Box",
            "Pet Litter Tray & Scooper",
          ],
          attributes: ["age", "type", "size", "color", "material", "weight"],
        },
        {
          name: "Pet Care",
          items: [
            "Pet Shampoo",
            "Pet Conditioner",
            "Pet Brush",
            "Pet Nail Cutter",
            "Pet Toothbrush",
            "Pet Toothpaste",
            "Pet Medicine",
            "Pet Vitamin",
            "Pet Odor Spray",
            "Pet Flea & Tick Treatment",
            "Pet Lice Treatment",
            "Pet Ear Cleaner",
            "Pet Eye Cleaner",
            "Pet First Aid Kit",
            "Pet Litter",
          ],
          attributes: ["type", "age", "volume", "quantity", "weight"],
        },
        {
          name: "Aquarium Supplies",
          items: [
            "Aquarium Tank",
            "Aquarium Stand",
            "Aquarium Filter",
            "Aquarium Light",
            "Oxygen Pump",
            "Aquarium Heater",
          ],
          attributes: ["type", "size", "color", "material", "weight"],
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
