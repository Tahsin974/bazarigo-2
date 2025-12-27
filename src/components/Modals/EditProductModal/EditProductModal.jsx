import { useRef, useState } from "react";
import SelectField from "../../ui/SelectField";
import TextEditor from "../../ui/TextEditor";
import UploadImages from "../../ui/UploadImages";
import { Pause, Play, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "../../ui/InputField";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import { v4 as uuidv4 } from "uuid";

export default function EditProductModal({
  product = {},
  onClose,
  refetch,
  user,
}) {
  const baseUrl = import.meta.env.VITE_BASEURL;
  const axiosPublic = useAxiosPublic();
  const [form, setForm] = useState({
    productName: product.product_name || "",
    brand: product.brand || "No Brand",
    regular_price: product.regular_price || 0,
    sale_price: product.sale_price || 0,
    discount: product.discount || 0,
    rating: product.rating || 0,
    category: product.category || "",
    subcategory: product.subcategory || "",
    subcategory_item: product.subcategory_item || "",
    description: product.description || "",
    stock: product.stock || 0,
    images: product.images || [],
    extras: product.extras || {},
    isBestSeller: product.isbestseller || false,
    isHot: product.ishot || false,
    isNew: product.isnew || false,
    isTrending: product.istrending || false,
    isLimitedStock: product.islimitedstock || false,
    isExclusive: product.isexclusive || false,
    isFlashSale: product.isflashsale || false,
    createdAt: product.createdat,
    updatedAt: new Date().toLocaleString("en-CA", {
      timeZone: "Asia/Dhaka",
      hour12: false,
    }),
    sellerId: product.sellerId || "",
    sellerName: product.sellerName || "",
    sellerStoreName: product.sellerStoreName || "",
  });
  const videoRefs = useRef([]); // All refs stored here
  const [pausedVideos, setPausedVideos] = useState(
    form.images.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  ); // Store pause state per index
  const togglePlayPause = (idx) => {
    const video = videoRefs.current[idx];
    if (!video) return;
    console.log(video.paused);

    if (video.paused) {
      video.play();
      setPausedVideos((p) => ({ ...p, [idx]: false }));
    } else {
      video.pause();
      setPausedVideos((p) => ({ ...p, [idx]: true }));
    }
  };

  const [attributes, setAttributes] = useState({});
  const [variants, setVariants] = useState(product.extras?.variants || []);

  const handleAttributeChange = (attr, value) => {
    setAttributes((prev) => ({ ...prev, [attr]: value }));
  };

  const addVariant = () => {
    const allAttributes = { ...attributes };
    const hasAnyValue = Object.values(allAttributes).some(
      (v) => v?.toString().trim() !== ""
    );
    if (!hasAnyValue) return;

    let isExactDuplicate = false;
    variants.forEach((v) => {
      const keysToCheck = Object.keys(allAttributes).filter(
        (key) => !["regular_price", "sale_price", "stock"].includes(key)
      );
      const allMatch = keysToCheck.every(
        (key) => v[key] === allAttributes[key]
      );
      if (allMatch) isExactDuplicate = true;
    });

    if (isExactDuplicate) {
      alert("Duplicate variant!");
      return;
    }

    const newVariant = {
      ...allAttributes,
      id: uuidv4(),
      regular_price:
        parseInt(attributes.regular_price) || parseInt(form.regular_price) || 0,
      sale_price:
        parseInt(attributes.sale_price) || parseInt(form.sale_price) || 0,

      stock: parseInt(attributes.stock) || 0,
    };

    const updatedVariants = [...variants, newVariant];

    setVariants(updatedVariants);

    // 🟢 UPDATED: মোট stock হিসাব করা হচ্ছে
    const totalStock = updatedVariants.reduce(
      (sum, v) => sum + (v.stock || 0),
      0
    );

    setForm((prev) => ({
      ...prev,
      stock: totalStock,
      extras: {
        ...prev.extras,
        variants: updatedVariants,
      },
    }));

    const cleared = Object.keys(allAttributes).reduce(
      (acc, key) => ({ ...acc, [key]: "" }),
      {}
    );
    setAttributes(cleared);
  };

  const removeVariant = (id) => {
    console.log("Removing variant at index:", id);
    const updated = variants.filter((v) => v.id !== id);
    console.log("Removing variant at index:", updated);
    // 🟢 UPDATED: variant বাদ দিলে total stock পুনরায় হিসাব
    const totalStock = updated.reduce((sum, v) => sum + (v.stock || 0), 0);
    setVariants(updated);
    console.log("Removing variant at index:", updated);

    setForm((prev) => ({
      ...prev,
      stock: totalStock,
      extras: { ...prev.extras, variants: updated },
    }));
  };
  console.log("Variants", variants);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const maxSizeImage = 2 * 1024 * 1024; // 1MB for images

    const validFiles = [];
    let hasInvalid = false;

    files.forEach((file) => {
      if (file.type.startsWith("image") && file.size > maxSizeImage) {
        hasInvalid = true;
      } else if (file.type.startsWith("video")) {
        validFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });
    console.log(validFiles);

    if (hasInvalid) {
      Swal.fire({
        icon: "error",
        title: "File too large!",
        text: "Each image must be less than 1MB.",
        confirmButtonColor: "#FF0055",
      });
    }

    if (validFiles.length === 0) return;

    // FormData তে সংরক্ষণ করুন

    setForm((prev) => ({
      ...prev,
      images: [...validFiles, ...(prev.images || [])],
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
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
            "Jackets & Coats",
            "Dresses",
            "Skirts",
            "Traditional Wear",
          ],
          attributes: ["color", "material", "size"],
        },
        {
          name: "Footwear",
          items: ["Sneakers", "Formal Shoes", "Sandals", "Boots", "Flip-Flops"],
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
            "Sunglasses / Eyewear",
          ],
          attributes: ["color", "size", "material"],
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
          items: [
            "Hair Straightener",
            "Hair Dryer",
            "Facial Massager",
            "Manicure Set",
          ],
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

  const LAST_KEYS = ["regular_price", "sale_price", "stock"];
  const getVariantsFor = (subcategoryItem) => {
    return subcategoryItem?.attributes || [];
  };

  const variablesType =
    variants.length > 0
      ? [
          ...new Set(variants.flatMap((v) => Object.keys(v).toLowerCase())),
        ].filter(
          (k) =>
            k !== "regular_price" &&
            k !== "sale_price" &&
            k !== "stock" &&
            k !== "id"
        )
      : getVariantsFor(subcategoryItem).map((v) => String(v).toLowerCase());
  const tableHeaders =
    variants.length > 0
      ? (() => {
          const keys = [
            ...new Set(variants.flatMap((v) => Object.keys(v).toLowerCase())),
          ].filter((k) => k !== "id");

          const normalKeys = keys.filter((k) => !LAST_KEYS.includes(k));
          const lastKeys = LAST_KEYS.filter((k) => keys.includes(k));

          return [...normalKeys, ...lastKeys];
        })()
      : [];

  const getGridCols = (len) => {
    if (len <= 1) return "grid-cols-1";
    if (len === 2) return "sm:grid-cols-2 grid-cols-1";
    if (len === 3) return "sm:grid-cols-3 grid-cols-1";
    if (len === 4) return "sm:grid-cols-4 grid-cols-1";
    return "sm:grid-cols-3 grid-cols-1";
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("productName", form.productName);
      formData.append("regular_price", form.regular_price);
      formData.append("sale_price", form.sale_price);
      formData.append("discount", form.discount);
      formData.append("rating", form.rating);
      formData.append("isBestSeller", form.isBestSeller);
      formData.append("isHot", form.isHot);
      formData.append("isNew", form.isNew);
      formData.append("isTrending", form.isTrending);
      formData.append("isLimitedStock", form.isLimitedStock);
      formData.append("isExclusive", form.isExclusive);
      formData.append("isFlashSale", form.isFlashSale);
      formData.append("category", form.category);
      formData.append("subcategory", form.subcategory);
      formData.append("subcategory_item", form.subcategory_item);
      formData.append("description", form.description);
      formData.append("stock", form.stock);
      formData.append("brand", form.brand);
      formData.append("weight", form.weight);
      formData.append("extras", JSON.stringify(form.extras));

      // Multer-এর জন্য প্রতিটি ফাইল আলাদা append করুন

      // আগের image path গুলো বের করা
      const existingPaths = form.images.filter(
        (item) => typeof item === "string"
      );

      // backend এ পাঠানো
      formData.append("existingPaths", JSON.stringify(existingPaths));

      // নতুন file object গুলো পাঠানো
      form.images
        .filter((item) => item instanceof File)
        .forEach((file) => {
          formData.append("images", file);
        });

      const res = await axiosPublic.put(`/products/${product.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.updatedCount > 0) {
        Swal.fire({
          icon: "success",
          title: `${form.productName} has updated successfully`,
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">
      <div className="w-full max-w-3xl bg-white rounded shadow overflow-auto max-h-[90vh] relative ">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white">
          <h2 className="text-xl font-semibold">Edit Product </h2>
          <button
            onClick={onClose}
            className="hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </header>

        <div className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <InputField
                label="  Product Name"
                className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                defaultValue={form.productName}
                onChange={(e) =>
                  setForm((s) => ({ ...s, productName: e.target.value }))
                }
                placeholder="Product Name"
              />
            </div>

            {/* Brand */}
            <div>
              <InputField
                label=" Brand"
                className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                defaultValue={form.brand}
                onChange={(e) =>
                  setForm((s) => ({ ...s, brand: e.target.value }))
                }
                placeholder="Brand"
              />
            </div>

            {/* Prices */}
            <div>
              <InputField
                type="number"
                label="Regular Price"
                className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                defaultValue={form.regular_price || 0}
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
                placeholder="Regular Price"
              />
            </div>
            <div>
              <InputField
                type="number"
                label="Sale Price"
                className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                defaultValue={form.sale_price || 0}
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
                placeholder="Sale Price"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount */}
            <div>
              <InputField
                type="number"
                label="Discount (%)"
                className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                defaultValue={form.discount || 0}
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
                placeholder="Discount"
              />
            </div>
            {/* Rating */}
            <div>
              <InputField
                type="number"
                min="0"
                max="5"
                step={0.1}
                label="Rating (0-5)"
                className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                defaultValue={form.rating || 0}
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
                onWheel={(e) => e.target.blur()}
                placeholder="Rating"
              />
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <SelectField
                selectValue={form.category}
                selectValueChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    category: e.target.value,
                    subcategory: "",
                    subcategory_item: "",
                    extras: {},
                  }))
                }
                isWide={true}
              >
                {categories.map((cat) => (
                  <option key={cat.name}>{cat.name}</option>
                ))}
              </SelectField>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Subcategory
              </label>
              <SelectField
                selectValue={form.subcategory}
                selectValueChange={(e) =>
                  setForm((s) => ({ ...s, subcategory: e.target.value }))
                }
                isWide={true}
              >
                <option value="" disabled>
                  Select Subcategory
                </option>
                {availableSubcategories.map((sub) => (
                  <option key={sub.name}>{sub.name}</option>
                ))}
              </SelectField>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Subcategory Item
              </label>
              <SelectField
                selectValue={form.subcategory_item}
                selectValueChange={(e) =>
                  setForm((s) => ({ ...s, subcategory_item: e.target.value }))
                }
                isWide={true}
              >
                <option value="" disabled>
                  Select Subcategory Item
                </option>
                {availableSubcategoryItems.map((subItem) => (
                  <option key={subItem}>{subItem}</option>
                ))}
              </SelectField>
            </div>
          </div>
          {/* Description */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <TextEditor
              value={form.description}
              onChange={(v) => setForm((s) => ({ ...s, description: v }))}
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Badge
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {user?.role === "seller" ? (
                <>
                  {["isHot", "isNew", "isTrending", "isLimitedStock"].map(
                    (flag) => (
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
                    )
                  )}
                </>
              ) : (
                <>
                  {[
                    "isBestSeller",
                    "isHot",
                    "isNew",
                    "isTrending",
                    "isLimitedStock",
                    "isExclusive",
                    "isFlashSale",
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
          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <UploadImages video={true} handleImageUpload={handleImageChange}>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {(form.images || []).map((src, i) => {
                  if (!src) return null;

                  const isVideo =
                    (typeof src === "object" &&
                      src.type?.startsWith("video")) ||
                    (typeof src === "string" && /\.(mp4|webm|mov)$/i.test(src));

                  let mediaURL = "";
                  if (typeof src === "object") {
                    mediaURL = URL.createObjectURL(src);
                  } else if (typeof src === "string") {
                    mediaURL = src.includes("/uploads")
                      ? `${baseUrl}${src}`
                      : src;
                  }

                  return (
                    <div
                      key={i}
                      className="w-full h-24 rounded overflow-hidden relative flex justify-center items-center bg-gray-100"
                    >
                      {/* IMAGE */}
                      {!isVideo && (
                        <img
                          src={mediaURL}
                          alt={`media-${i}`}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* VIDEO */}
                      {isVideo && (
                        <>
                          <video
                            ref={(el) => (videoRefs.current[i] = el)}
                            src={mediaURL}
                            className="w-full h-full object-cover"
                            onEnded={() =>
                              setPausedVideos((p) => ({ ...p, [i]: true }))
                            }
                          />

                          <button
                            onClick={() => togglePlayPause(i)}
                            className="absolute bottom-2 left-2 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-md transition duration-200 ease-in-out "
                          >
                            {pausedVideos[i] ? (
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

          {/* Variants */}

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              variablesType?.length > 0
                ? "max-h-max opacity-100 my-4"
                : "max-h-0 opacity-0"
            }`}
          >
            <div>
              <h4 className="font-medium">Product Variants</h4>
              <div className="px-5 py-5 bg-[#F9FAFB] rounded-2xl border-gray-300 border space-y-4">
                <div
                  className={`grid ${getGridCols(
                    variablesType.length
                  )} gap-4 mt-2`}
                >
                  {variablesType.map((v, i) => (
                    <div key={i}>
                      <InputField
                        label={v.replace("_", " ")}
                        className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                        defaultValue={attributes[v] || ""}
                        onChange={(e) =>
                          handleAttributeChange(v, e.target.value)
                        }
                        placeholder={v.replace("_", " ")}
                      />
                    </div>
                  ))}
                  <div>
                    <InputField
                      label="Regular Price"
                      className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                      defaultValue={
                        attributes.regular_price || form.regular_price || null
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        handleAttributeChange("regular_price", parseInt(val));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault(); // keyboard up/down disable
                        }
                      }}
                      onWheel={(e) => e.target.blur()}
                      placeholder="Regular Price"
                    />
                  </div>
                  <div>
                    <InputField
                      label="Sale Price"
                      className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                      defaultValue={
                        attributes.sale_price || form.sale_price || null
                      }
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
                      placeholder="Sale Price"
                    />
                  </div>
                  <div>
                    <InputField
                      label="Stock"
                      className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                      defaultValue={attributes.stock || null}
                      onChange={(e) =>
                        handleAttributeChange("stock", parseInt(e.target.value))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault(); // keyboard up/down disable
                        }
                      }}
                      onWheel={(e) => e.target.blur()}
                      placeholder="Stock"
                    />
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

              {/* 🟢 UPDATED: total stock এখন form.stock থেকে */}
              <h3 className="mt-3 font-semibold">Total Stock: {form.stock}</h3>

              {variants.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-box shadow-sm my-4">
                  <table className="table text-center w-full">
                    <thead className="text-black">
                      <tr>
                        {tableHeaders.map((h, idx) => (
                          <th key={idx} className="capitalize">
                            {h.replace("_", " ")}
                          </th>
                        ))}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {variants.map((variant, index) => (
                        <tr key={variant.id}>
                          {tableHeaders
                            .filter((key) => key !== "id")
                            .map((key) => (
                              <td key={key}>
                                <input
                                  type={
                                    [
                                      "stock",
                                      "regular_price",
                                      "sale_price",
                                    ].includes(key)
                                      ? "number"
                                      : "text"
                                  }
                                  defaultValue={variant[key] || 0}
                                  className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#FF0055] focus:ring-1 focus:ring-[#FF0055] focus:outline-none shadow min-w-[90px]"
                                  onChange={(e) => {
                                    const value = [
                                      "stock",
                                      "regular_price",
                                      "sale_price",
                                    ].includes(key)
                                      ? parseInt(e.target.value) || 0
                                      : e.target.value;
                                    const updatedVariants = [...variants];
                                    updatedVariants[index][key] = value;
                                    // 🟢 UPDATED: stock পরিবর্তন হলে total পুনরায় হিসাব
                                    const totalStock = updatedVariants.reduce(
                                      (sum, v) => sum + (v.stock || 0),
                                      0
                                    );
                                    setVariants(updatedVariants);
                                    setForm((prev) => ({
                                      ...prev,
                                      stock: totalStock,
                                      extras: {
                                        ...prev.extras,
                                        variants: updatedVariants,
                                      },
                                    }));
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "ArrowUp" ||
                                      e.key === "ArrowDown"
                                    ) {
                                      e.preventDefault(); // keyboard up/down disable
                                    }
                                  }}
                                  onWheel={(e) => e.target.blur()}
                                />
                              </td>
                            ))}
                          <td>
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => removeVariant(variant.id)}
                                className=" bg-red-100 hover:bg-[#e92323] text-red-600 rounded  px-3 py-2  hover:text-white cursor-pointer"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))} */}
                      {variants.map((variant) => (
                        <tr key={variant.id}>
                          {tableHeaders
                            .filter((key) => key !== "id")
                            .map((key) => (
                              <td key={key}>
                                <input
                                  type={
                                    [
                                      "stock",
                                      "regular_price",
                                      "sale_price",
                                    ].includes(key)
                                      ? "number"
                                      : "text"
                                  }
                                  value={variant[key] || 0}
                                  className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#FF0055] focus:ring-1 focus:ring-[#FF0055] focus:outline-none shadow min-w-[90px]"
                                  onChange={(e) => {
                                    const value = [
                                      "stock",
                                      "regular_price",
                                      "sale_price",
                                    ].includes(key)
                                      ? parseInt(e.target.value) || 0
                                      : e.target.value;

                                    const updatedVariants = variants.map((v) =>
                                      v.id === variant.id
                                        ? { ...v, [key]: value }
                                        : v
                                    );

                                    const totalStock = updatedVariants.reduce(
                                      (sum, v) => sum + (v.stock || 0),
                                      0
                                    );

                                    setVariants(updatedVariants);
                                    setForm((prev) => ({
                                      ...prev,
                                      stock: totalStock,
                                      extras: {
                                        ...prev.extras,
                                        variants: updatedVariants,
                                      },
                                    }));
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "ArrowUp" ||
                                      e.key === "ArrowDown"
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                  onWheel={(e) => e.target.blur()}
                                />
                              </td>
                            ))}

                          <td>
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => removeVariant(variant.id)}
                                className="bg-red-100 hover:bg-[#e92323] text-red-600 rounded px-3 py-2 hover:text-white cursor-pointer"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-[#00C853] text-white rounded cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-[#f72c2c] text-white rounded cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
