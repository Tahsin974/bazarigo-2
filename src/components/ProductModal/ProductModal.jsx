import { useEffect, useState } from "react";
import { X } from "lucide-react";
import SelectField from "../ui/SelectField";
import { getExtrasByCategory } from "../../Utils/Helpers/Helpers";
import UploadImages from "../ui/UploadImages";

export default function ProductModal({ product = {}, onClose, onSave, user }) {
  const daysToConsiderNew = 30; // define how many days a product is considered new
  const createdAtDate = product.createdAt
    ? new Date(product.createdAt)
    : new Date();

  const isNewCalculated =
    product.isNew ||
    (new Date() - createdAtDate) / (1000 * 60 * 60 * 24) <= daysToConsiderNew;

  const [form, setForm] = useState(() => ({
    id: product.id || null,
    name: product.name || "",
    oldPrice: product.oldPrice || 0,
    price: product.price || 0,
    discount: product.discount || 0,
    rating: product.rating || 0,
    createdAt: product.createdAt || new Date().toISOString(),
    isBestSeller: product.isBestSeller || false,
    isHot: product.isHot || false,
    isNew: isNewCalculated,
    isTrending: product.isTrending || false,
    isLimitedStock: product.isLimitedStock || false,
    isExclusive: product.isExclusive || false,
    isFlashSale: product.isFlashSale || false,
    category: product.category || "Fashion",
    subcategory: product.subcategory || "",
    description: product.description || "",
    stock: product.stock || 0,
    images: product.images || [],
    extras: product.extras || {},
  }));

  console.log(form);

  useEffect(() => {
    setForm({
      id: product.id || null,
      name: product.name || "",
      oldPrice: product.oldPrice || 0,
      price: product.price || 0,
      discount: product.discount || 0,
      rating: product.rating || 0,
      isBestSeller: product.isBestSeller || false,
      isHot: product.isHot || false,
      isNew: isNewCalculated,
      isTrending: product.isTrending || false,
      isLimitedStock: product.isLimitedStock || false,
      isExclusive: product.isExclusive || false,
      isFlashSale: product.isFlashSale || false,
      category: product.category || "Fashion",
      subcategory: product.subcategory || "",
      description: product.description || "",
      stock: product.stock || 0,
      images: product.images || [],
      extras: product.extras || {},
      createdAt: product.createdAt || new Date().toISOString(),
    });
  }, [product]);

  const onImageChange = (e) => {
    const files = Array.from(e.target.files || []);
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

  const categoryExtras = getExtrasByCategory(form.category, form.subcategory);

  const updateExtra = (key, value) =>
    setForm((s) => ({
      ...s,
      extras: { ...(s.extras || {}), [key]: value },
    }));

  const handleSave = () => {
    if (!form.name) return alert("Product name required");
    if (!form.price) return alert("Price required");
    if (!form.category) return alert("Category required");
    if (!form.subcategory) return alert("Subcategory required");
    onSave({ ...form });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl bg-white rounded shadow overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold">
            {form.id ? "Edit Product" : "New Product"}
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                className="  w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
              />
            </div>

            {/* Old Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Old Price (৳)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="  w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                value={form.oldPrice}
                onChange={(e) =>
                  setForm((s) => ({ ...s, oldPrice: e.target.value }))
                }
              />
            </div>
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (৳)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="  w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                value={form.price}
                onChange={(e) =>
                  setForm((s) => ({ ...s, price: e.target.value }))
                }
              />
            </div>
            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                className="  w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                defaultValue={form.discount || 0}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    discount: Number(e.target.value),
                  }))
                }
              />
            </div>
            {/* Rating */}
            {(!user?.role || !user.role === "seller") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  className="  w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                  defaultValue={form.rating || 0}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value < 0 || value > 5) {
                      alert("Please enter a value between 0 and 5");
                      e.target.value = 0;
                      setForm((s) => ({ ...s, rating: 0 }));
                    } else {
                      setForm((s) => ({ ...s, rating: value }));
                    }
                  }}
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
                    subcategory: "", // reset subcategory
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
              >
                <option value="" disabled>
                  Select Subcategory
                </option>
                {availableSubcategories.map((sub) => (
                  <option key={sub}>{sub}</option>
                ))}
              </SelectField>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                min="0"
                className="  w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                defaultValue={form.stock}
                onChange={(e) =>
                  setForm((s) => ({ ...s, stock: Number(e.target.value) }))
                }
              />
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

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="  w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                value={form.description}
                onChange={(e) =>
                  setForm((s) => ({ ...s, description: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Category specific extras */}
          <div>
            <h4 className="font-medium">Category specific details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {categoryExtras.map((ex) => (
                <div key={ex.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {ex.label}
                  </label>
                  {ex.type === "array" ? (
                    <input
                      type="text"
                      value={(form.extras[ex.key] || []).join(", ")}
                      placeholder="Comma separated"
                      onChange={(e) =>
                        updateExtra(
                          ex.key,
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        )
                      }
                      className="  w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form.extras[ex.key] || ""}
                      onChange={(e) => updateExtra(ex.key, e.target.value)}
                      className="  w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                    />
                  )}
                  {/* <input
                    className="  w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                    value={(form.extras && form.extras[ex.key]) || ""}
                    onChange={(e) => updateExtra(ex.key, e.target.value)}
                  /> */}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          {/* <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Upload size={18} />
              <span className="text-sm">Upload Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onImageChange}
              />
            </label>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {(form.images || []).map((src, i) => (
                <div
                  key={i}
                  className="w-full h-24 rounded overflow-hidden relative"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div> */}
          {/* Images */}
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

          {/* Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1 rounded text-white bg-[#f72c2c] hover:bg-[#e92323]"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded bg-[#00C853] hover:bg-[#00B34A] text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
