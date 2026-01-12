import { useCallback, useEffect, useRef, useState } from "react";
import { Info, Pause, Play, Trash2, X } from "lucide-react";
import SelectField from "../../ui/SelectField";
import { motion } from "framer-motion";
import UploadImages from "../../ui/UploadImages";

import Swal from "sweetalert2";
import TextEditor from "../../ui/TextEditor";
import { InputField } from "../../ui/InputField";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import useAuth from "../../../Utils/Hooks/useAuth";
import { v4 as uuidv4 } from "uuid";

export default function ProductModal({ onClose, refetch }) {
  const axiosPublic = useAxiosPublic();
  const [attributes, setAttributes] = useState({});
  const [variants, setVariants] = useState([]);
  const { user } = useAuth();
  const videoRef = useRef();
  const [isPaused, setIsPaused] = useState(true);

  const [form, setForm] = useState(() => ({
    id: null,
    productName: "",
    regular_price: 0,
    sale_price: 0,
    discount: 0,
    rating: 0,
    isBestSeller: false,
    isHot: false,
    isNew: true,
    isTrending: false,
    isLimitedStock: false,
    isExclusive: false,
    isFlashSale: false,
    category: "",
    subcategory: "",
    subcategory_item: "",
    description: "",
    stock: 0,
    brand: "",
    weight: 1,
    images: [],
    extras: {},
    createdAt: new Date().toLocaleString("en-CA", {
      timeZone: "Asia/Dhaka",
      hour12: false,
    }),
    updatedAt: null,
    sellerId: "",
    sellerName: "",
    sellerStoreName: "",
  }));

  const handleAttributeChange = (attr, value) => {
    setAttributes((prev) => ({ ...prev, [attr]: value }));
  };

  const addVariant = () => {
    const allAttributes = { ...attributes };

    // অন্তত একটি value আছে কিনা
    const hasAnyValue = Object.values(allAttributes).some(
      (v) => String(v).trim() !== ""
    );
    if (!hasAnyValue) return;

    let isExactDuplicate = false;
    let isOverlap = false;

    variants.forEach((v) => {
      // duplicate/overlap check: আগের variant-এর keys (price/stock ছাড়া)
      const keysToCheck = Object.keys(v).filter(
        (key) => !["regular_price", "sale_price", "stock"].includes(key)
      );

      // ✅ Exact duplicate: আগের variant-এর সব key নতুন variant-এ value মিলছে
      const allMatch = keysToCheck.every(
        (key) => v[key] === allAttributes[key]
      );

      // কোন attribute মিলেছে
      const matchCount = keysToCheck.filter(
        (key) => v[key] && v[key] === allAttributes[key]
      ).length;

      // 🔹 নতুন attribute আছে কি না
      const newAttributesCount = Object.keys(allAttributes).filter(
        (key) =>
          !["regular_price", "sale_price", "stock"].includes(key) && !(key in v)
      ).length;

      // ✅ Partial overlap: কিছু match হয়েছে + নতুন attribute আছে
      const hasPartialOverlap =
        matchCount > 0 && !allMatch && newAttributesCount > 0;

      if (allMatch) isExactDuplicate = true;
      else if (hasPartialOverlap) isOverlap = true;
    });

    if (isExactDuplicate) {
      Swal.fire({
        icon: "error",
        title: `This variant is a duplicate of an existing variant!`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const cleared = Object.keys(allAttributes).reduce(
            (acc, key) => ({ ...acc, [key]: "" }),
            {}
          );
          return setAttributes(cleared);
        }
      });
      return;
    }

    if (isOverlap) {
      Swal.fire({
        icon: "warning",
        title: `This variant partially overlaps with an existing variant.`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const cleared = Object.keys(allAttributes).reduce(
            (acc, key) => ({ ...acc, [key]: "" }),
            {}
          );
          return setAttributes(cleared);
        }
      });
      return;
    }

    const cleanedAttributes = Object.fromEntries(
      Object.entries(allAttributes).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );

    // নতুন variant তৈরি, price এবং stock সবসময় শেষে
    const {
      regular_price: rp,
      sale_price: sp,
      stock,
      ...rest
    } = cleanedAttributes;

    const newVariant = {
      ...rest,
      id: uuidv4(),
      regular_price: rp || form.regular_price || 0,
      sale_price: sp || form.sale_price || 0,
      stock: stock || 0,
    };

    setVariants((prev) => [...prev, newVariant]);

    setForm((prevForm) => ({
      ...prevForm,
      extras: {
        ...prevForm.extras,
        variants: [...(prevForm.extras?.variants || []), newVariant],
      },
    }));

    // ইনপুট ক্লিয়ার
    const cleared = Object.keys(allAttributes).reduce(
      (acc, key) => ({ ...acc, [key]: "" }),
      {}
    );

    setAttributes(cleared);
  };

  const handleRemoveVariant = (id) => {
    const updatedVariants = variants.filter((v) => v.id !== id);
    setVariants(updatedVariants);
  };

  const onImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const maxSizeImage = 2 * 1024 * 1024; // 1MB
    const validFiles = [];
    let hasInvalid = false;

    files.forEach((file) => {
      if (file.type.startsWith("image") && file.size > maxSizeImage) {
        hasInvalid = true;
      } else if (
        file.type.startsWith("image") ||
        file.type.startsWith("video")
      ) {
        validFiles.push(file);
      }
    });

    if (hasInvalid) {
      Swal.fire({
        icon: "error",
        title: "File too large!",
        text: "Each image must be less than 1MB.",
        confirmButtonColor: "#FF0055",
      });
    }

    if (validFiles.length === 0) return;

    // Update state with files directly (for FormData)
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...validFiles],
    }));
  };

  const removeImage = (index) => {
    setForm((s) => ({
      ...s,
      images: s.images.filter((_, i) => i !== index),
    }));
  };

  // 🔽 Define subcategories for each category

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

  // Get subcategories based on selected category

  const subcategories = categories.find((cat) => cat.name === form.category);
  const availableSubcategories = subcategories?.sub || [];

  const subcategoryItem = availableSubcategories.find(
    (sub) => sub.name === form.subcategory
  );
  const availableSubcategoryItems = subcategoryItem
    ? subcategoryItem?.items
    : [];

  const getVariantsFor = (subcategoryItem) => {
    return subcategoryItem?.attributes || [];
  };

  const variablesType =
    variants.length > 0
      ? [
          ...new Set(
            variants.flatMap((v) => Object.keys(v).map((k) => k.toLowerCase()))
          ),
        ].filter(
          (k) =>
            k !== "regular_price" &&
            k !== "sale_price" &&
            k !== "stock" &&
            k !== "id"
        )
      : getVariantsFor(subcategoryItem).map((v) => String(v).toLowerCase());
  const handleCreate = async () => {
    if (
      form.productName.trim() === "" ||
      form.category.trim() === "" ||
      form.subcategory.trim() === "" ||
      form.subcategory_item.trim() === "" ||
      form.images.length === 0 ||
      form.regular_price <= 0
    ) {
      return Swal.fire({
        icon: "error",
        title: "Please fill all required fields!",
        showConfirmButton: false,
        toast: true,
        position: "top",
        timer: 1500,
      });
    } else {
      try {
        const formData = new FormData();

        // Normal fields যোগ করুন
        for (let key in form) {
          if (key !== "images") {
            if (key === "extras") {
              formData.append(key, JSON.stringify(form[key]));
            } else {
              formData.append(key, form[key]);
            }
          }
        }

        // Images & videos যোগ করুন
        (form.images || []).forEach((file) => {
          formData.append("images", file); // Multer single/multiple জন্য একই নাম
        });

        const res = await axiosPublic.post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.data.createdCount > 0) {
          Swal.fire({
            icon: "success",
            title: `${form.productName} has been added successfully`,
            showConfirmButton: false,
            toast: true,
            position: "top",
            timer: 1500,
          });
          refetch();
          onClose();
        }
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    }
  };

  const getGridCols = (len) => {
    if (len <= 1) return "grid-cols-1";
    if (len === 2) return "sm:grid-cols-2 grid-cols-1";
    if (len === 3) return "sm:grid-cols-3 grid-cols-1";
    if (len === 4) return "sm:grid-cols-4 grid-cols-1";
    if (len === 5) return "sm:grid-cols-5 grid-cols-1";
    return "sm:grid-cols-3 grid-cols-1"; // fallback
  };

  const tableHeaders =
    variants.length > 0
      ? [
          ...new Set(
            variants.flatMap((v) => Object.keys(v).map((k) => k.toLowerCase()))
          ),
        ].filter((k) => k !== "id")
      : [];

  useEffect(() => {
    setForm({
      id: null,
      productName: "",
      regular_price: 0,
      sale_price: 0,
      discount: 0,
      rating: 0,
      isBestSeller: false,
      isHot: false,
      isNew: true,
      isTrending: false,
      isLimitedStock: false,
      isExclusive: false,
      isFlashSale: false,
      category: "",
      subcategory: "",
      subcategory_item: "",
      description: "",
      stock: 0,
      brand: "",
      weight: 1,
      images: [],
      extras: {},
      createdAt: new Date().toLocaleString("en-CA", {
        timeZone: "Asia/Dhaka",
        hour12: false,
      }),
      updatedAt: null,
      sellerId: user.id,
      sellerName: user.full_name,
      sellerStoreName: user.store_name,
    });
  }, []);

  useEffect(() => {
    const total = Object.values(variants)
      .flat()
      .reduce((acc, v) => acc + (v.stock || 0), 0);

    setForm((prev) => ({ ...prev, stock: total }));
  }, [variants]);

  const handleChange = useCallback(
    (newContent) => setForm((s) => ({ ...s, description: newContent })),
    []
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl bg-white rounded shadow overflow-auto max-h-[90vh] relative"
      >
        <header className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white">
          <div className="flex items-center justify-between">
            {/* Title */}
            <h2 className="text-xl font-semibold">New Product</h2>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Instruction */}
              <a
                href="/instruction#"
                className="flex items-center gap-1 text-sm font-semibold px-4 py-1.5 rounded-md bg-white text-[#FF0055] shadow hover:bg-gray-100 transition"
              >
                <Info size={16} />
                Instruction
              </a>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-white/20 transition cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 ">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <InputField
                  label="Product Name"
                  className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                  placeholder="Product Name"
                  onChange={(e) =>
                    setForm((s) => ({ ...s, productName: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Brand */}
              <div>
                <InputField
                  label="Brand"
                  className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                  placeholder="Brand"
                  onChange={(e) =>
                    setForm((s) => ({ ...s, brand: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Regular Price */}
              <div>
                <InputField
                  type="number"
                  label=" Regular Price (৳)"
                  className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                  placeholder="Regular Price"
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      regular_price: parseInt(e.target.value) || 0,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault(); // keyboard up/down disable
                    }
                  }}
                  onWheel={(e) => e.target.blur()}
                  required
                />
              </div>
              {/* Sale Price */}
              <div>
                <InputField
                  type="number"
                  label=" Sale Price (৳)"
                  className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                  placeholder="Sale Price"
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      sale_price: parseInt(e.target.value) || 0,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault(); // keyboard up/down disable
                    }
                  }}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              {/* Total Stock */}
              <div>
                <InputField
                  type="number"
                  label=" Total Stock"
                  className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                  placeholder="Total Stock"
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      stock: parseInt(e.target.value) || 0,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault(); // keyboard up/down disable
                    }
                  }}
                  onWheel={(e) => e.target.blur()}
                />
              </div>

              {/* Discount */}
              <div>
                <InputField
                  type="number"
                  label=" Discount (%)"
                  className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                  placeholder="Discount"
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      discount: parseInt(e.target.value),
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault(); // keyboard up/down disable
                    }
                  }}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              {/* Rating */}
              {user?.role !== "seller" && user?.role !== "moderator" && (
                <div>
                  <InputField
                    type="number"
                    min="0"
                    max="5"
                    step={0.1}
                    label=" Rating (0-5)"
                    className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                    placeholder="Rating"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value < 0 || value > 5) {
                        alert("Please enter a value between 0 and 5");
                        e.target.value = 0;
                        setForm((s) => ({ ...s, rating: 0 }));
                      } else {
                        setForm((s) => ({ ...s, rating: value }));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault(); // keyboard up/down disable
                      }
                    }}
                    onWheel={(e) => e.target.blur()}
                  />
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <SelectField
                  selectValue={form.category}
                  selectValueChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      category: e.target.value,
                      subcategory: "",
                      extras: {},
                    }))
                  }
                  isWide={true}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.name}>{cat.name}</option>
                  ))}
                </SelectField>
              </div>

              {/* Dynamic Subcategory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <SelectField
                  selectValue={form.subcategory}
                  selectValueChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      subcategory: e.target.value,
                    }))
                  }
                  isWide={true}
                  disabled={form.category === ""}
                >
                  <option value="" disabled>
                    Select Subcategory
                  </option>
                  {availableSubcategories.map((sub) => (
                    <option key={sub.name}>{sub.name}</option>
                  ))}
                </SelectField>
              </div>
              {/* Dynamic Subcategory Item */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory Item
                </label>
                <SelectField
                  selectValue={form.subcategory_item}
                  selectValueChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      subcategory_item: e.target.value,
                    }))
                  }
                  isWide={true}
                  disabled={form.subcategory === ""}
                >
                  <option value="" disabled>
                    Select Subcategory Item
                  </option>
                  {availableSubcategoryItems.map((subItem) => (
                    <option key={subItem}>{subItem}</option>
                  ))}
                </SelectField>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <TextEditor value={form.description} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <UploadImages video={true} handleImageUpload={onImageChange}>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {(form.images || []).map((file, i) => {
                    const isVideo = file.type.startsWith("video");
                    const mediaURL = URL.createObjectURL(file); // File থেকে preview

                    return (
                      <div
                        key={i}
                        className="w-full h-24 rounded overflow-hidden relative flex justify-center items-center bg-gray-100"
                      >
                        {!isVideo && (
                          <img
                            src={mediaURL}
                            alt={`media-${i}`}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {isVideo && (
                          <>
                            <video
                              ref={videoRef}
                              src={mediaURL}
                              className="w-full h-full object-cover"
                              onEnded={() => setIsPaused(true)}
                            />

                            <button
                              onClick={() => {
                                if (videoRef.current.paused) {
                                  videoRef.current.play();
                                  setIsPaused(false);
                                } else {
                                  videoRef.current.pause();
                                  setIsPaused(true);
                                }
                              }}
                              className="absolute bottom-2 left-2 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-md transition duration-200 ease-in-out "
                            >
                              {isPaused ? (
                                <Play size={16} />
                              ) : (
                                <Pause size={16} />
                              )}
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm transition"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </UploadImages>
            </div>

            {/* Badge */}

            <div className="md:col-span-2 pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Badge
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {user?.role === "seller" ? (
                  <>
                    {["isHot", "isNew", "isLimitedStock"].map((flag) => (
                      <label
                        key={flag}
                        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-[#FF0055] transition"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                          checked={form[flag]}
                          onChange={(e) =>
                            setForm((s) => ({
                              ...s,
                              [flag]: e.target.checked,
                            }))
                          }
                        />
                        <span className="select-none">
                          {flag.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </label>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      "isBestSeller",
                      "isHot",
                      "isNew",
                      "isTrending",
                      "isLimitedStock",
                    ].map((flag) => (
                      <label
                        key={flag}
                        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-[#FF0055] transition"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                          checked={form[flag]}
                          onChange={(e) =>
                            setForm((s) => ({ ...s, [flag]: e.target.checked }))
                          }
                        />
                        <span className="select-none">
                          {flag.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </label>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                form.subcategory_item !== "" && variablesType?.length > 0
                  ? "max-h-max opacity-100 my-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div>
                <h4 className="font-medium">Product Variants (Options)</h4>

                <div className="px-5 py-5 bg-[#F9FAFB] rounded-2xl border-gray-300 border space-y-4">
                  <div
                    className={`grid ${getGridCols(
                      variablesType?.length
                    )}   gap-4 `}
                  >
                    {variablesType.map((type, idx) => (
                      <div key={idx}>
                        <div className="flex gap-2  ">
                          <InputField
                            type="text"
                            label={type.replace("_", " ")}
                            className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                            placeholder={`${type.replace("_", " ")}`}
                            value={attributes[type] || ""}
                            onChange={(e) =>
                              handleAttributeChange(type, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}

                    <div>
                      <div className="flex gap-2  ">
                        <InputField
                          label="Regular Price"
                          type="number"
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                              e.preventDefault(); // keyboard up/down disable
                            }
                          }}
                          onWheel={(e) => e.target.blur()}
                          placeholder={`Regular Price`}
                          className=" w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                          required
                          value={
                            attributes.regular_price !== undefined &&
                            attributes.regular_price !== ""
                              ? attributes.regular_price
                              : form.regular_price || ""
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            handleAttributeChange(
                              "regular_price",
                              parseInt(val)
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-2  ">
                        <InputField
                          label="Sale Price"
                          type="number"
                          placeholder={`Sale Price`}
                          className=" w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                          value={
                            attributes.sale_price !== undefined &&
                            attributes.sale_price !== ""
                              ? attributes.sale_price
                              : form.sale_price || ""
                          }
                          required
                          onChange={(e) =>
                            handleAttributeChange(
                              "sale_price",
                              parseInt(e.target.value)
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                              e.preventDefault(); // keyboard up/down disable
                            }
                          }}
                          onWheel={(e) => e.target.blur()}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-2  ">
                        <InputField
                          label="Stock"
                          type="number"
                          placeholder={`Stock`}
                          className=" w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                          value={attributes.stock || ""}
                          onChange={(e) =>
                            handleAttributeChange(
                              "stock",
                              parseInt(e.target.value)
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                              e.preventDefault(); // keyboard up/down disable
                            }
                          }}
                          onWheel={(e) => e.target.blur()}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={addVariant}
                      className="px-3 py-1 rounded border border-[#00C853] hover:bg-[#00B34A]  text-[#00C853] hover:text-white cursor-pointer"
                    >
                      Add Variant
                    </button>
                  </div>
                </div>

                {variants.length > 0 && (
                  <div className="overflow-x-auto bg-white rounded-box shadow-sm my-4">
                    <table className="table text-center w-full">
                      <thead className="text-black">
                        <tr>
                          {tableHeaders.map((key) => (
                            <th className="capitalize" key={key}>
                              {key.replace("_", " ")}
                            </th>
                          ))}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((variant) => (
                          <tr key={variant.id}>
                            {tableHeaders
                              .filter((key) => key !== "id")
                              .map((key) => (
                                <td key={key}>{variant[key]}</td>
                              ))}

                            <td>
                              <button
                                onClick={() => handleRemoveVariant(variant.id)}
                                className=" bg-red-100 hover:bg-[#e92323] text-red-600 rounded  px-3 py-2  hover:text-white cursor-pointer"
                              >
                                <Trash2 size={20} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCreate}
                className="px-3 py-1 rounded bg-[#00C853] hover:bg-[#00B34A] text-white cursor-pointer"
              >
                Create
              </button>
              <button
                onClick={onClose}
                className="px-3 py-1 rounded text-white bg-[#f72c2c] hover:bg-[#e92323] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
