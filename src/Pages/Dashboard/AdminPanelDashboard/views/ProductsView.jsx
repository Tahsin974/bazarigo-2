import React from "react";
import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";

function ProductsView({
  products,
  selected,
  toggleSelect,
  openNewProductModal,
  openEditProductModal,
  setProducts,
  allSelected,
  toggleSelectAll,
  bulkDelete,
}) {
  console.log(allSelected);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SelectAllCheckbox
            selected={selected}
            allSelected={allSelected}
            toggleSelectAll={toggleSelectAll}
          />
          <div className="font-medium">Products ({products.length})</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={openNewProductModal}
            className="px-3 py-2 rounded bg-[#00C853] hover:bg-[#00B34A] text-white"
          >
            New Product
          </button>
          <DeleteAllBtn selected={selected} bulkDelete={bulkDelete} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded shadow-sm p-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  {p.images && p.images[0] ? (
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.category}</div>
                  <div className="font-bold text-[#FF0055]">${p.price}</div>
                  <div className="text-xs text-gray-500">Stock: {p.stock}</div>
                </div>
              </div>
              <input
                type="checkbox"
                className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                checked={selected.includes(p.id)}
                onChange={() => toggleSelect(p.id)}
              />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => openEditProductModal(p)}
                className="flex-1 px-3 py-2 rounded border bg-[#4F46E5] hover:bg-[#4338CA]  text-white"
              >
                Edit
              </button>
              <button
                onClick={() =>
                  setProducts((s) => s.filter((x) => x.id !== p.id))
                }
                className="px-3 py-2 rounded bg-[#DC2626] hover:bg-[#B91C1C]  text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsView;
