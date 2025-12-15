import { Power, PowerOff, SquarePen, Trash2, ZapIcon } from "lucide-react";
import AddBtn from "../../../../components/ui/AddBtn";
import Pagination from "../../../../components/ui/Pagination";
import SearchField from "../../../../components/ui/SearchField";
import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import SelectField from "../../../../components/ui/SelectField";

import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import useAxiosPublic from "../../../../Utils/Hooks/useAxiosPublic";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { useRenderPageNumbers } from "../../../../Utils/Helpers/useRenderPageNumbers";
import useAuth from "../../../../Utils/Hooks/useAuth";

export default function FlashSaleView({
  products,
  selected,
  setSelected,
  toggleSelect,
  allSelected,
  toggleSelectAll,
  productPage,
  setProductPage,
  productPageSize = 10,
  filteredProducts,
  paginatedProducts,
  productSearch,
  setProductSearch,
  productSort,
  setProductSort,
  flashSaleProducts,
  manualDiscount,
  setManualDiscount,
  refetchProducts,
  flashSaleProductPage,
  setFlashSaleProductPage,
  openDiscountModal,
  refetch,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}) {
  const axiosPublic = useAxiosPublic();
  const formData = new FormData();
  const baseUrl = import.meta.env.VITE_BASEURL;
  const { user } = useAuth();
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productPageSize)
  );
  const [autoFlashSaleOn, setAutoFlashSaleOn] = useState(true);

  const toggleAutoFlashSale = async () => {
    try {
      const res = await axiosPublic.put("/flash-sale/toggle-auto", {
        enable: !autoFlashSaleOn,
      });
      console.log(res.data.enable);
      setAutoFlashSaleOn(res.data.enable);
    } catch (err) {
      console.error("Failed to toggle auto flash sale:", err);
    }
  };
  const getImages = (images) => {
    return images.filter((img) => {
      const lower = img.toLowerCase();
      return !(
        lower.endsWith(".mp4") ||
        lower.endsWith(".webm") ||
        lower.endsWith(".mov")
      );
    });
  };

  useEffect(() => {
    const fetchAutoFlashSale = async () => {
      try {
        const res = await axiosPublic.get("/flash-sale/toggle-auto");
        if (res.data.length === 0) {
          // যদি row না থাকে, POST API দিয়ে create
          const createRes = await axiosPublic.post("/flash-sale/toggle-auto", {
            enable: false, // default off
          });
          setAutoFlashSaleOn(createRes.data.setting.is_auto_enabled);
        } else {
          console.log(res.data.is_auto_enabled);
          setAutoFlashSaleOn(res.data.is_auto_enabled);
        }
      } catch (err) {
        console.error("Failed to fetch auto flash sale setting:", err);
      }
    };

    fetchAutoFlashSale();
  }, []);

  const handleApplySale = async () => {
    if (!startTime || !endTime) {
      return Swal.fire({
        icon: "error",
        title: `${!startTime ? "Start Time" : "End Time"}`,
        showConfirmButton: false,
        toast: true,
        position: "top",
        timer: 1500,
      });
    }
    const minDiscount = 10;
    const maxDiscount = 30;

    const productPayload = []; // মূল product update-এর জন্য
    const flashSalePayload = []; // flash sale update-এর জন্য

    for (const prod of products) {
      if (!selected.includes(prod.id)) continue;

      const discount =
        manualDiscount.id === prod.id && manualDiscount.discount > 0
          ? manualDiscount.discount
          : Math.floor(Math.random() * (maxDiscount - minDiscount + 1)) +
            minDiscount;

      let updatedProd = { ...prod };
      let flashSaleProd = { ...prod };
      let updatedProdVariants = [];
      let flashSaleProdVariants = [];

      if (prod.extras?.variants?.length > 0) {
        prod.extras.variants.map((variant) => {
          const minStock = variant.stock > 50 ? 40 : 2;
          const maxStock = variant.stock > 50 ? 45 : 5;
          const variantFlashStock =
            Math.floor(Math.random() * (maxStock - minStock + 1)) + minStock;

          const newVariantStock = Math.max(
            (variant.stock ?? 0) - variantFlashStock,
            0
          );

          const variantSalePrice = Math.round(
            (variant.regular_price ?? 0) -
              ((variant.regular_price ?? 0) * discount) / 100
          );
          updatedProdVariants.push({
            ...variant,
            stock: newVariantStock,
          });

          flashSaleProdVariants.push({
            ...variant,
            stock: variantFlashStock,
            sale_price: variantSalePrice,
          });
        });

        const flashSaleTotalStock = flashSaleProdVariants.reduce(
          (sum, v) => sum + (v.stock ?? 0),
          0
        );
        const totalStock = updatedProdVariants.reduce(
          (sum, v) => sum + (v.stock ?? 0),
          0
        );

        updatedProd = {
          ...updatedProd,
          extras: { ...prod.extras, variants: updatedProdVariants },
          stock: totalStock,
        };

        flashSaleProd = {
          ...flashSaleProd,
          extras: { ...prod.extras, variants: flashSaleProdVariants },
          stock: flashSaleTotalStock,
          discount,
          sale_price: Math.round(
            prod.regular_price - (prod.regular_price * discount) / 100
          ),
        };
      } else {
        const minStock = prod.stock > 50 ? 45 : 3;
        const maxStock = prod.stock > 50 ? 50 : 5;
        const flashSaleStock =
          Math.floor(Math.random() * (maxStock - minStock + 1)) + minStock;
        const newStock = prod.stock - flashSaleStock;

        flashSaleProd = {
          ...flashSaleProd,
          stock: flashSaleStock,
          sale_price: Math.round(
            prod.regular_price - (prod.regular_price * discount) / 100
          ),
          discount,
        };

        updatedProd = {
          ...updatedProd,
          stock: newStock,
        };
        flashSalePayload.push({ ...flashSaleProd });
        productPayload.push({ ...updatedProd });
      }

      // 🔹 Main product payload (flashSaleStock বাদ)
      productPayload.push({
        ...updatedProd,
      });

      // 🔹 Full flash sale product info (backend update-এর জন্য)
      flashSalePayload.push({
        ...flashSaleProd,
      });
    }

    const flashSaleRes = await axiosPublic.post("/flash-sale", {
      isActive: true,
      start_time: Math.floor(new Date(startTime).getTime() / 1000),
      end_time: Math.floor(new Date(endTime).getTime() / 1000),
      saleProducts: flashSalePayload,
    });

    if (flashSaleRes.data.createdCount > 0) {
      Swal.fire({
        icon: "success",
        title: `Products have added successfully`,
        showConfirmButton: false,
        toast: true,
        position: "top",
        timer: 1500,
      });
      setManualDiscount({});

      setStartTime(null);

      setEndTime(null);
      refetch();
    }

    for (const prod of productPayload) {
      console.log(prod.isflashsale);
      try {
        formData.append("productName", prod.product_name);
        formData.append("regular_price", prod.regular_price);
        formData.append("sale_price", prod.sale_price);
        formData.append("discount", prod.discount);
        formData.append("rating", prod.rating);
        formData.append("isBestSeller", prod.isbestseller);
        formData.append("isHot", prod.ishot);
        formData.append("isNew", prod.isnew);
        formData.append("isTrending", prod.istrending);
        formData.append("isLimitedStock", prod.islimitedstock);
        formData.append("isExclusive", prod.isexclusive);
        formData.append("isFlashSale", prod.isflashsale);
        formData.append("category", prod.category);
        formData.append("subcategory", prod.subcategory);
        formData.append("description", prod.description);
        formData.append("stock", prod.stock);
        formData.append("brand", prod?.brand);
        formData.append("extras", JSON.stringify(prod.extras));
        formData.append("existingPaths", JSON.stringify(prod.images));

        // যদি নতুন images থাকে
        prod.newImages?.forEach((file) => {
          formData.append("images", file);
        });

        await axiosPublic.put(`/products/${prod.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (error) {
        console.error(` Product ${prod.id} update failed:`, error);
      }
    }
    refetchProducts();
  };

  const flashSaleTotalPages = Math.max(
    1,
    Math.ceil((flashSaleProducts?.sale_products || [])?.length / 6)
  );

  const autoSelect = () => {
    const candidates = products.filter((p) => {
      const avgRating =
        p.rating > 0
          ? p.rating
          : p.reviews && p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0;

      return (avgRating > 4.5 || p.isnew) && p.stock > 30;
    });

    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    const limited = shuffled.slice(0, 100);

    setSelected(limited.map((p) => p.id));
  };

  const renderPageNumbers = useRenderPageNumbers(
    productPage,
    totalPages,
    setProductPage
  );

  const renderPageNumbersForFlashSale = useRenderPageNumbers(
    flashSaleProductPage,
    flashSaleTotalPages,
    setFlashSaleProductPage
  );

  const deleteFlashSale = async (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are You Sure?",
      showCancelButton: true, // confirm + cancel button
      confirmButtonColor: "#00C853",
      cancelButtonColor: "#f72c2c",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosPublic.delete(`/flash-sale/${id}`);
        refetchProducts();
        refetch();
      } else {
        return;
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      refetchProducts();
    }, 60000); // 60 সেকেন্ডে একবার

    return () => clearInterval(interval);
  }, []);

  console.log(user);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          {/* Left: Total + Selected + Small screen buttons */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto order-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <h3 className="font-medium text-[15px] sm:text-md">
                Total Products ({products.length})
              </h3>
              <h3 className="font-medium text-[15px] sm:text-md">
                Selected Products ({selected.length})
              </h3>
            </div>

            {/* Small screen buttons */}
            <div className="flex lg:hidden gap-2 mt-2 sm:mt-0">
              <AddBtn btnHandler={autoSelect}>Auto Select</AddBtn>
              <AddBtn disabled={!selected.length} btnHandler={handleApplySale}>
                Apply Sale
              </AddBtn>

              {user.role !== "moderator" && (
                <button
                  onClick={toggleAutoFlashSale}
                  className={`flex items-center justify-center px-3 py-2 rounded font-medium shadow-md transition-all duration-300 sm:text-base text-[12px]
    ${
      autoFlashSaleOn
        ? "bg-red-500 hover:bg-red-600 text-white"
        : "bg-green-500 hover:bg-green-600 text-white"
    }`}
                >
                  {autoFlashSaleOn ? (
                    <PowerOff size={18} className="mr-1 " />
                  ) : (
                    <Power size={18} className="mr-1" />
                  )}
                  {autoFlashSaleOn ? "Stop " : "Start "}
                </button>
              )}
            </div>
          </div>

          {/* Middle: Search + Sort + DatePickers */}
          <div className="flex flex-wrap items-center gap-3 order-2 w-full md:w-auto">
            <div className="w-full md:w-auto">
              <SearchField
                placeholder="Search products..."
                searchValue={productSearch}
                searchValueChange={(e) => {
                  setProductSearch(e.target.value);
                  setProductPage(1);
                }}
              />
            </div>

            <div className="w-full md:w-auto">
              <SelectField
                selectValue={productSort}
                selectValueChange={(e) => setProductSort(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
              </SelectField>
            </div>

            <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
              <DatePicker
                selected={startTime}
                onChange={setStartTime}
                showTimeSelect
                timeIntervals={1}
                dateFormat="dd/MM/yyyy HH:mm"
                placeholderText="Select Start Date & Time"
                className="w-full md:w-auto border border-gray-300 rounded-lg  px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
              />
              <DatePicker
                selected={endTime}
                onChange={setEndTime}
                showTimeSelect
                timeIntervals={1}
                dateFormat="dd/MM/yyyy HH:mm"
                placeholderText="Select End Date & Time"
                className="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
              />
            </div>
          </div>

          {/* Right: Large screen buttons */}
          <div className="hidden lg:flex gap-2 order-3">
            <AddBtn
              btnHandler={autoSelect}
              bgColor="#FF0055"
              bgColorHover="#e6004e"
            >
              Auto Select
            </AddBtn>
            <AddBtn disabled={!selected.length} btnHandler={handleApplySale}>
              Apply Sale
            </AddBtn>

            {user.role !== "moderator" && (
              <button
                onClick={toggleAutoFlashSale}
                className={`flex items-center justify-center px-3 py-2 rounded font-medium shadow-md transition-all duration-300 sm:text-base text-[12px]
    ${
      autoFlashSaleOn
        ? "bg-red-500 hover:bg-red-600 text-white"
        : "bg-green-500 hover:bg-green-600 text-white"
    }`}
              >
                {autoFlashSaleOn ? (
                  <PowerOff size={18} className="mr-1" />
                ) : (
                  <Power size={18} className="mr-1" />
                )}
                {autoFlashSaleOn ? "Stop " : "Start "}
              </button>
            )}
          </div>
        </div>
        {paginatedProducts.length === 0 ? (
          <div>
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white">
              <span className="font-semibold">products not found</span>
            </div>
          </div>
        ) : paginatedProducts.length === null ? (
          <Loading />
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-box shadow-sm ">
              <table className="table  text-center">
                {/* head */}
                <thead className="text-black">
                  <tr>
                    <th>
                      <SelectAllCheckbox
                        selected={selected}
                        allSelected={allSelected}
                        toggleSelectAll={toggleSelectAll}
                        isShowCounter={false}
                      />
                    </th>
                    <th>Name</th>
                    <th>Store Name </th>

                    <th>Category</th>
                    <th>Regular Price</th>
                    <th>Sale Price</th>
                    <th>Stock</th>
                    <th>Sale Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="">
                  {paginatedProducts.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                          checked={selected.includes(p.id)}
                          onChange={() => toggleSelect(p.id)}
                        />
                      </td>
                      <td>
                        <div className="flex items-center gap-3 text-start">
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img
                                src={`${baseUrl}${getImages(p.images)[0]}`}
                                alt={p.name}
                              />
                            </div>
                          </div>
                          <div>
                            <span className="font-semibold">
                              {p.product_name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {" "}
                        <span className="font-semibold">{p.seller_name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">{p.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">
                          ৳{p.regular_price.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">
                          ৳{p.sale_price.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold">{p.stock}</span>
                      </td>
                      <td>
                        {p.isflashsale ? (
                          <p className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-200 text-green-800">
                            Active
                          </p>
                        ) : (
                          <p className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-200 text-red-800">
                            Inactive
                          </p>
                        )}
                      </td>
                      <td>
                        <>
                          {selected.includes(p.id) ? (
                            manualDiscount.id === p.id &&
                            manualDiscount.discount > 0 ? (
                              <>
                                <p
                                  onClick={() => openDiscountModal(p)}
                                  className="inline-flex items-center px-3 py-0.5 rounded-full text-base font-medium bg-gray-100 text-gray-600"
                                >
                                  <ZapIcon className="w-3 h-3 mr-1 fill-gray-600" />{" "}
                                  {manualDiscount.discount}% off
                                </p>
                              </>
                            ) : (
                              <button
                                onClick={() => openDiscountModal(p)}
                                className="px-3 py-2 bg-orange-100 text-[#E6612A] hover:bg-orange-400 hover:text-white rounded cursor-pointer"
                              >
                                <SquarePen size={20} />
                              </button>
                            )
                          ) : (
                            <button
                              disabled={"disabled"}
                              onClick={() => openDiscountModal(p)}
                              className="px-3 py-2 bg-gray-100 text-gray-600 "
                            >
                              <SquarePen size={20} />
                            </button>
                          )}
                        </>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className=" flex items-center justify-center">
              {totalPages > 1 && (
                <Pagination
                  currentPage={productPage}
                  totalPages={totalPages}
                  setCurrentPage={setProductPage}
                  renderPageNumbers={renderPageNumbers}
                />
              )}
            </div>
          </>
        )}
      </div>
      <h1 className="text-lg">
        FlashSale Products{" "}
        {flashSaleProducts?.sale_products?.length ? (
          <>({flashSaleProducts.sale_products.length})</>
        ) : (
          ""
        )}
      </h1>

      {!flashSaleProducts?.sale_products?.length ? (
        <div>
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white">
            <span className="font-semibold">products not found</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto bg-white rounded-box shadow-sm ">
            <table className="table text-center">
              {/* Head */}
              <thead className="text-black">
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Regular Price</th>
                  <th>Sale Price</th>
                  <th>Stock</th>
                  <th>Sale Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(flashSaleProducts.sale_products || [])
                  .slice(
                    (flashSaleProductPage - 1) * 6,
                    flashSaleProductPage * 6
                  )
                  .map((p) => (
                    <tr key={p.id} className="border-t">
                      <td>
                        <div className="flex items-center gap-3 text-start">
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img
                                src={`${baseUrl}${getImages(p.images)[0]}`}
                                alt={p.product_name}
                              />
                            </div>
                          </div>
                          <div>
                            <span className="font-semibold">
                              {p.product_name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold">{p.category}</span>
                      </td>
                      <td>
                        <span className="font-semibold">
                          ৳{p.regular_price.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold">
                          ৳{p.sale_price.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold">{p.stock}</span>
                      </td>
                      <td>
                        {p.isflashsale ? (
                          <p className="inline-flex items-center px-3 py-0.5 rounded-full text-base font-medium bg-red-100 text-red-800">
                            <ZapIcon className="w-3 h-3 mr-1 fill-red-800" />{" "}
                            {p.discount}% off
                          </p>
                        ) : (
                          <p className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-red-200 text-red-800">
                            Inactive
                          </p>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => deleteFlashSale(flashSaleProducts.id)}
                          className="bg-red-100 hover:bg-red-600 text-red-600 rounded px-3 py-2 hover:text-white"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center">
            {flashSaleTotalPages > 1 && (
              <Pagination
                currentPage={flashSaleProductPage}
                totalPages={flashSaleTotalPages}
                setCurrentPage={setFlashSaleProductPage}
                renderPageNumbers={renderPageNumbersForFlashSale}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
