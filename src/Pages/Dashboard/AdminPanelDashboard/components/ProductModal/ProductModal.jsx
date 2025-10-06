import { useEffect, useState } from "react";
import { getExtrasByCategory } from "../../helpers/helpers";
import { Upload } from "lucide-react";

export default function ProductModal({ product = {}, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    id: product.id || null,
    name: product.name || "",
    price: product.price || "",
    category: product.category || "Fashion",
    description: product.description || "",
    stock: product.stock || 0,
    images: product.images || [],
    extras: product.extras || {},
  }));

  useEffect(
    () =>
      setForm({
        id: product.id || null,
        name: product.name || "",
        price: product.price || "",
        category: product.category || "Fashion",
        description: product.description || "",
        stock: product.stock || 0,
        images: product.images || [],
        extras: product.extras || {},
      }),
    [product]
  );

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

  const categoryExtras = getExtrasByCategory(form.category);

  const updateExtra = (key, value) =>
    setForm((s) => ({ ...s, extras: { ...(s.extras || {}), [key]: value } }));

  const handleSave = () => {
    if (!form.name) return alert("Product name required");
    if (!form.price) return alert("Price required");
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
            <div>
              <label className="block text-sm">Name</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="mt-1 w-full rounded border px-3 py-2"
                value={form.price}
                onChange={(e) =>
                  setForm((s) => ({ ...s, price: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm">Category</label>
              <select
                className="mt-1 w-full rounded border px-3 py-2"
                value={form.category}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    category: e.target.value,
                    extras: {},
                  }))
                }
              >
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Groceries</option>
                <option>Health & Beauty</option>
                <option>Home & Living</option>
                <option>Sports</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Stock</label>
              <input
                type="number"
                min="0"
                className="mt-1 w-full rounded border px-3 py-2"
                value={form.stock}
                onChange={(e) =>
                  setForm((s) => ({ ...s, stock: Number(e.target.value) }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm">Description</label>
              <textarea
                className="mt-1 w-full rounded border px-3 py-2"
                value={form.description}
                onChange={(e) =>
                  setForm((s) => ({ ...s, description: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium">Category specific details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {categoryExtras.map((ex) => (
                <div key={ex.key}>
                  <label className="block text-sm">{ex.label}</label>
                  <input
                    className="mt-1 w-full rounded border px-3 py-2"
                    value={(form.extras && form.extras[ex.key]) || ""}
                    onChange={(e) => updateExtra(ex.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
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
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-3 py-1 rounded border">
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded bg-[#FF0055] text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
