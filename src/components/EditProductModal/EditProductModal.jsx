import { useState } from "react";
import SelectField from "../ui/SelectField";
import TextEditor from "../ui/TextEditor";
import UploadImages from "../ui/UploadImages";
import { Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

export default function EditProductModal({ product = {}, onClose }) {
  const [form, setForm] = useState({
    productName: product.product_name || "",
    brand: product.brand || "",
    "regular price": product.regular_price || 0,
    "sale price": product.sale_price || 0,
    discount: product.discount || 0,
    rating: product.rating || 0,
    category: product.category || "",
    subcategory: product.subcategory || "",
    description: product.description || "",
    stock: product.stock || 0,
    images: product.images || [],
    extras: product.extras || {},
    isBestSeller: product.isBestSeller || false,
    isHot: product.isHot || false,
    isNew: product.isNew || false,
    isTrending: product.isTrending || false,
    isLimitedStock: product.isLimitedStock || false,
    isExclusive: product.isExclusive || false,
    isFlashSale: product.isFlashSale || false,
    createdAt: product.createdat,
    updatedAt: new Date().toISOString(),
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
        (key) => !["regular price", "sale price", "stock"].includes(key)
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
      "regular price":
        parseInt(attributes["regular price"]) ||
        parseInt(form["regular price"]) ||
        0,
      "sale price":
        parseInt(attributes["sale price"]) || parseInt(form["sale price"]) || 0,

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
    Electronics: ["Mobile Phones", "Laptops & Computers", "Audio & Headphones"],
    Fashion: ["Men’s Clothing", "Women’s Clothing", "Footwear", "Accessories"],
    Groceries: ["Fruits", "Vegetables", "Dairy"],
    "Health & Beauty": ["Skincare", "Haircare", "Makeup"],
    "Home & Living": ["Furniture", "Decor", "Kitchen"],
    Sports: ["Outdoor", "Gym", "Cycling"],
  };

  const subcategoryVariants = {
    Fashion: {
      "Men’s Clothing": ["Size", "Color", "Material"],
      "Women’s Clothing": ["Size", "Color", "Material"],
      Footwear: ["Size", "Color", "Material"],
      Accessories: ["Type", "Color", "Material"],
    },
    Electronics: {
      "Mobile Phones": ["Color", "Storage", "RAM"],
      "Laptops & Computers": ["Processor", "RAM", "Storage"],
      "Audio & Headphones": ["Color", "Connectivity"],
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
      const res = await axios.put(
        `http://localhost:3000/products/${product.id}`,
        payload
      );
      if (res.data.updatedCount > 0) {
        Swal.fire({
          icon: "success",
          title: `${payload.productName} has updated successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
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
              <label className="block text-sm font-medium mb-2">
                Product Name
              </label>
              <input
                value={form.productName}
                onChange={(e) =>
                  setForm((s) => ({ ...s, productName: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                placeholder="Product Name"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input
                value={form.brand}
                onChange={(e) =>
                  setForm((s) => ({ ...s, brand: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                placeholder="Brand"
              />
            </div>

            {/* Prices */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Regular Price
              </label>
              <input
                type="number"
                value={form["regular price"]}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    ["regular price"]: parseInt(e.target.value) || 0,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault(); // keyboard up/down disable
                  }
                }}
                onWheel={(e) => e.target.blur()}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Sale Price
              </label>
              <input
                type="number"
                value={form["sale price"]}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    ["sale price"]: parseInt(e.target.value) || 0,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault(); // keyboard up/down disable
                  }
                }}
                onWheel={(e) => e.target.blur()}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
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
                      src={
                        src.includes("/uploads")
                          ? `http://localhost:3000${src}`
                          : src
                      }
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
                      <h6>{v}</h6>
                      <input
                        type="text"
                        value={attributes[v] || ""}
                        onChange={(e) =>
                          handleAttributeChange(v, e.target.value)
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                  ))}
                  <div>
                    <h6>Regular Price</h6>
                    <div className="flex gap-2  ">
                      <input
                        type="text"
                        placeholder={`Regular Price`}
                        className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#FF0055] focus:ring-1 focus:ring-[#FF0055] focus:outline-none shadow"
                        defaultValue={
                          attributes["regular price"] ||
                          form["regular price"] ||
                          ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          handleAttributeChange("regular price", parseInt(val));
                        }}
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
                    <h6>Sale Price</h6>
                    <div className="flex gap-2  ">
                      <input
                        type="text"
                        placeholder={`Sale Price`}
                        className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#FF0055] focus:ring-1 focus:ring-[#FF0055] focus:outline-none shadow"
                        defaultValue={
                          attributes["sale price"] || form["sale price"] || ""
                        }
                        onChange={(e) =>
                          handleAttributeChange(
                            "sale price",
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
                  <div className="">
                    <h6>Stock</h6>
                    <div className="flex gap-2  ">
                      <input
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

              {/* 🟢 UPDATED: total stock এখন form.stock থেকে */}
              <h3 className="mt-3 font-semibold">Total Stock: {form.stock}</h3>

              {variants.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-box shadow-sm my-4">
                  <table className="table text-center w-full">
                    <thead className="text-black">
                      <tr>
                        {tableHeaders.map((h) => (
                          <th key={h} className="capitalize">
                            {h}
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
                                    "regular price",
                                    "sale price",
                                  ].includes(key)
                                    ? "number"
                                    : "text"
                                }
                                defaultValue={variant[key] || ""}
                                className="border rounded px-1 py-1 w-full"
                                onChange={(e) => {
                                  const value = [
                                    "stock",
                                    "regular price",
                                    "sale price",
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
