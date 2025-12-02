import { useState } from "react";
import SelectField from "../../ui/SelectField";
import TextEditor from "../../ui/TextEditor";
import UploadImages from "../../ui/UploadImages";
import { Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "../../ui/InputField";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";

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

  const removeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    // 🟢 UPDATED: variant বাদ দিলে total stock পুনরায় হিসাব
    const totalStock = updated.reduce((sum, v) => sum + (v.stock || 0), 0);
    setVariants(updated);
    setForm((prev) => ({
      ...prev,
      stock: totalStock,
      extras: { ...prev.extras, variants: updated },
    }));
  };

  const handleImageChange = (e) => {
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
            const reader = new FileReader();
            reader.onload = () => res(reader.result);
            reader.readAsDataURL(f);
          })
      )
    ).then((imgs) =>
      setForm((prev) => ({ ...prev, images: [...imgs, ...prev.images] }))
    );
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

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

  const variablesType =
    subcategoryVariants[form.category]?.[form.subcategory] || [];

  const tableHeaders =
    variants.length > 0
      ? [...new Set(variants.flatMap((v) => Object.keys(v)))]
      : [];

  const getGridCols = (len) => {
    if (len <= 1) return "grid-cols-1";
    if (len === 2) return "grid-cols-2";
    if (len === 3) return "grid-cols-3";
    if (len === 4) return "grid-cols-4";
    return "grid-cols-3";
  };

  const handleSave = async () => {
    try {
      const payload = { ...form };
      // FormData নয়, base64 string গুলো JSON এ থাকবে
      const res = await axiosPublic.put(`/products/${product.id}`, payload);
      if (res.data.updatedCount > 0) {
        Swal.fire({
          icon: "success",
          title: `${payload.productName} has updated successfully`,
          showConfirmButton: false,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl bg-white rounded shadow overflow-auto max-h-[90vh] relative">
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
              <label className="block text-sm font-medium mb-2">Category</label>
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
                {Object.keys(subcategoryOptions).map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </SelectField>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
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
                {(subcategoryOptions[form.category] || []).map((sub) => (
                  <option key={sub}>{sub}</option>
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
            <UploadImages handleImageUpload={handleImageChange}>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {(form.images || []).map((src, i) => (
                  <div
                    key={i}
                    className="w-full h-24 rounded overflow-hidden relative"
                  >
                    <img
                      src={src.includes("/uploads") ? `${baseUrl}${src}` : src}
                      alt={`product-${i}`}
                      className="w-full h-full object-cover"
                    />
                    {/* ❌ X Button */}
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6  text-gray-500 rounded-full flex items-center justify-center text-sm  transition cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
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
                        label={v}
                        className="  w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                        defaultValue={attributes[v] || ""}
                        onChange={(e) =>
                          handleAttributeChange(v, e.target.value)
                        }
                        placeholder={v}
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
                        {tableHeaders.map((h) => (
                          <th key={h} className="capitalize">
                            {h.replace("_", " ")}
                          </th>
                        ))}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant, index) => (
                        <tr key={index}>
                          {tableHeaders.map((key) => (
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
                                className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#FF0055] focus:ring-1 focus:ring-[#FF0055] focus:outline-none shadow"
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
                            <button
                              onClick={() => removeVariant(index)}
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
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-500 text-white rounded cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
