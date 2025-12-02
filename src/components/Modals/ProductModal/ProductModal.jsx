import { useCallback, useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import SelectField from "../../ui/SelectField";
import { motion } from "framer-motion";
import UploadImages from "../../ui/UploadImages";

import Swal from "sweetalert2";
import TextEditor from "../../ui/TextEditor";
import { InputField } from "../../ui/InputField";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import useAuth from "../../../Utils/Hooks/useAuth";

export default function ProductModal({ onClose, refetch }) {
  const axiosPublic = useAxiosPublic();
  const [attributes, setAttributes] = useState({});
  const [variants, setVariants] = useState([]);
  const { user } = useAuth();

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

    // নতুন variant তৈরি, price এবং stock সবসময় শেষে
    const { regular_price: rp, sale_price: sp, stock, ...rest } = allAttributes;

    const newVariant = {
      ...rest,
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

  const handleRemoveVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  const onImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 1 * 1024 * 1024; // 1MB
    const validFiles = [];
    let hasInvalid = false;

    files.forEach((file) => {
      if (file.size > maxSize) {
        hasInvalid = true;
      } else {
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
    Promise.all(
      files.map(
        (f) =>
          new Promise((res) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.readAsDataURL(f);
          })
      )
    ).then((imgs) =>
      setForm((s) => ({ ...s, images: [...imgs, ...(s.images || [])] }))
    );
  };
  // Function to remove image by index
  const removeImage = (index) => {
    setForm((s) => ({
      ...s,
      images: s.images.filter((_, i) => i !== index),
    }));
  };

  // 🔽 Define subcategories for each category
  const subcategoryOptions = {
    Electronics: [
      "Mobile Phones",
      "Laptops & Computers",
      "Audio & Headphones",
      "Cameras & Photography",
      "Wearables",
      "TV & Home Theater",
      "Gaming Consoles",
      "Accessories",
    ],
    Fashion: [
      "Men’s Clothing",
      "Women’s Clothing",
      "Kid’s Clothing",
      "Footwear",
      "Bags & Backpacks",
      "Accessories",
      "Watches",
      "Ethnic & Traditional Wear",
    ],
    Groceries: [
      "Fresh Fruits & Vegetables",
      "Dairy & Eggs",
      "Meat & Seafood",
      "Packaged & Snacks",
      "Beverages",
      "Cooking Essentials",
      "Frozen Foods",
      "Accessories",
    ],
    "Health & Beauty": [
      "Skincare",
      "Haircare",
      "Makeup & Cosmetics",
      "Vitamins & Supplements",
      "Fragrances",
      "Accessories",
    ],
    "Home & Living": [
      "Furniture",
      "Home Decor",
      "Kitchen & Dining",
      "Bedding & Bath",
      "Lighting",
      "Storage & Organization",
      "Cleaning Supplies",
      "Accessories",
    ],
    Sports: [
      "Outdoor Sports",
      "Gym & Fitness Equipment",
      "Cycling & Scooters",
      "Water Sports",
      "Sportswear & Footwear",
      "Accessories",
    ],
  };

  // Get subcategories based on selected category
  const availableSubcategories = subcategoryOptions[form.category] || [];

  const subcategoryVariants = {
    Electronics: {
      "Mobile Phones": ["Color", "Storage", "RAM"],
      "Laptops & Computers": ["Processor", "RAM", "Storage"],
      "Audio & Headphones": ["Color", "Connectivity"],
      "Cameras & Photography": ["Megapixels", "Lens Type"],
      Wearables: ["Color"],
      "TV & Home Theater": ["Screen Size", "Resolution"],
      "Gaming Consoles": ["Storage", "Color"],
      Accessories: ["Type", "Color"],
    },
    Fashion: {
      "Men’s Clothing": ["Size", "Color", "Material"],
      "Women’s Clothing": ["Size", "Color", "Material"],
      "Kid’s Clothing": ["Size", "Color", "Material"],
      Footwear: ["Size", "Color", "Material"],
      "Bags & Backpacks": ["Color", "Material"],
      Accessories: ["Type", "Color", "Material"],
      Watches: ["Strap Material", "Color"],
      "Ethnic & Traditional Wear": ["Size", "Color", "Material"],
    },
    Groceries: {
      "Fresh Fruits & Vegetables": ["Weight", "Organic/Regular"],
      "Dairy & Eggs": ["Pack Size"],
      "Meat & Seafood": ["Weight", "Fresh/Frozen"],
      "Packaged & Snacks": ["Pack Size", "Flavor"],
      Beverages: ["Volume", "Flavor"],
      "Cooking Essentials": ["Weight/Volume"],
      "Frozen Foods": ["Weight"],
      Accessories: ["Type"],
    },
    "Health & Beauty": {
      Skincare: ["Size", "Type"],
      Haircare: ["Size", "Type"],
      "Makeup & Cosmetics": ["Shade", "Size"],
      "Vitamins & Supplements": ["Quantity"],
      Fragrances: ["Size"],
      Accessories: ["Type"],
    },
    "Home & Living": {
      Furniture: ["Material", "Color", "Size/Dimensions"],
      "Home Decor": ["Material", "Color", "Type"],
      "Kitchen & Dining": ["Material", "Color", "Size"],
      "Bedding & Bath": ["Size", "Material", "Color"],
      Lighting: ["Type", "Size", "Color"],
      "Storage & Organization": ["Size", "Material", "Color"],
      "Cleaning Supplies": ["Type", "Quantity"],
      Accessories: ["Type"],
    },
    Sports: {
      "Outdoor Sports": ["Type", "Size"],
      "Gym & Fitness Equipment": ["Type", "Weight"],
      "Cycling & Scooters": ["Type", "Color"],
      "Water Sports": ["Type", "Size"],
      "Sportswear & Footwear": ["Size", "Color"],
      Accessories: ["Type"],
    },
  };

  const getVariantsFor = (category, subcategory) => {
    return subcategoryVariants[category]?.[subcategory] || [];
  };
  const variablesType = getVariantsFor(form.category, form.subcategory);

  // const handleSave = async () => {
  //   onSave({ ...form });
  // };

  const handleCreate = async () => {
    try {
      const payload = { ...form };
      // FormData নয়, base64 string গুলো JSON এ থাকবে
      const res = await axiosPublic.post("/products", payload);
      if (res.data.createdCount > 0) {
        Swal.fire({
          icon: "success",
          title: `${payload.productName} has added successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
        onClose();
      }
    } catch (err) {
      console.log(err);
      console.error(err.response?.data || err.message);
    }
  };

  const getGridCols = (len) => {
    if (len <= 1) return "grid-cols-1";
    if (len === 2) return "grid-cols-2";
    if (len === 3) return "grid-cols-3";
    if (len === 4) return "grid-cols-4";
    if (len === 5) return "grid-cols-5";
    return "grid-cols-3"; // fallback
  };

  const tableHeaders =
    variants.length > 0
      ? [...new Set(variants.flatMap((v) => Object.keys(v)))]
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
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white">
          <h2 className="text-xl font-semibold">New Product </h2>
          <a href="/instruction#" className=" text-white  underline ">
            <h1>Instruction</h1>
          </a>
        </header>
        <div className="p-4 space-y-4">
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
            {(!user?.role || !user.role === "seller") && (
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                {Object.keys(subcategoryOptions).map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </SelectField>
            </div>

            {/* Dynamic Subcategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <option key={sub}>{sub}</option>
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
            <UploadImages handleImageUpload={onImageChange}>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {(form.images || []).map((src, i) => (
                  <div
                    key={i}
                    className="w-full h-24 rounded overflow-hidden relative"
                  >
                    <img
                      src={src}
                      alt={`product-${i}`}
                      className="w-full h-full object-cover"
                    />
                    {/* ❌ X Button */}
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6  text-gray-500 rounded-full flex items-center justify-center text-sm  transition"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
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

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              variablesType?.length > 0
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
                          label={type}
                          className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                          placeholder={`${type}`}
                          value={attributes[type.toLowerCase()] || ""}
                          onChange={(e) =>
                            handleAttributeChange(
                              type.toLowerCase(),
                              e.target.value
                            )
                          }
                        />
                        {/* <input
                          type="text"
                          placeholder={`${type}`}
                          className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#FF0055] focus:ring-1 focus:ring-[#FF0055] focus:outline-none shadow"
                          value={attributes[type] || ""}
                          onChange={(e) =>
                            handleAttributeChange(type, e.target.value)
                          }
                        /> */}
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
                        defaultValue={
                          attributes.regular_price || form.regular_price || null
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          handleAttributeChange("regular_price", parseInt(val));
                        }}
                      />
                      {/* <input
                        type="number"
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault(); // keyboard up/down disable
                          }
                        }}
                        onWheel={(e) => e.target.blur()}
                        placeholder={`Regular Price`}
                        className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#FF0055] focus:ring-1 focus:ring-[#FF0055] focus:outline-none shadow"
                        required
                        defaultValue={
                          attributes.regular_price || form.regular_price || ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          handleAttributeChange("regular_price", parseInt(val));
                        }}
                      /> */}
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-2  ">
                      <InputField
                        label="Sale Price"
                        type="number"
                        placeholder={`Sale Price`}
                        className=" w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                        defaultValue={
                          attributes.sale_price || form.sale_price || null
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
                      {/* <input
                        type="number"
                        placeholder={`Sale Price`}
                        className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#FF0055] focus:ring-1 focus:ring-[#FF0055] focus:outline-none shadow"
                        defaultValue={
                          attributes.sale_price || form.sale_price || ""
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
                      /> */}
                    </div>
                  </div>
                  <div className="">
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
                      {/* <input
                        type="number"
                        placeholder={`Stock`}
                        className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#FF0055] focus:ring-1 focus:ring-[#FF0055] focus:outline-none shadow"
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
                      /> */}
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
                          <th key={key} className="capitalize">
                            {key.replace("_", " ")}
                          </th>
                        ))}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant, index) => (
                        <tr key={index}>
                          {tableHeaders.map((key) => (
                            <td key={key}>{variant[key]}</td>
                          ))}
                          <td>
                            <button
                              onClick={() => handleRemoveVariant(index)}
                              className=" bg-red-100 hover:bg-red-600 text-red-600 rounded  px-3 py-2  hover:text-white cursor-pointer"
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
              onClick={onClose}
              className="px-3 py-1 rounded text-white bg-[#f72c2c] hover:bg-[#e92323] cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleCreate}
              className="px-3 py-1 rounded bg-[#00C853] hover:bg-[#00B34A] text-white cursor-pointer"
            >
              Create
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
