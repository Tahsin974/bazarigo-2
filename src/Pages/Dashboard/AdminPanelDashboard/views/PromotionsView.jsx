import AddBtn from "../../../../components/ui/AddBtn";
import Pagination from "../../../../components/ui/Pagination";
import SearchField from "../../../../components/ui/SearchField";
import { useRenderPageNumbers } from "../../../../Utils/Helpers/useRenderPageNumbers";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import FormattedDate from "../../../../Utils/Helpers/FormattedDate";
import useAxiosPublic from "../../../../Utils/Hooks/useAxiosPublic";
import useAuth from "../../../../Utils/Hooks/useAuth";

function PromotionsView({
  onAdd,
  promotions,
  refetch,
  promoPage,
  setPromoPage,
  promoSearch,
  setPromoSearch,
  promoPageSize = 10,
  filteredPromotions,
}) {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const toggleActive = async (p) => {
    try {
      const res = await axiosPublic.patch(`/promotions/${p.id}`, {
        is_active: !p.is_active,
      });
      if (res.data.updatedCount > 0) {
        Swal.fire({
          icon: "success",
          title: `Promotion Is ${!p.is_active ? "Active" : "Inactive"} Now`,
          showConfirmButton: false,
          toast: true,
          position: "top",
          timer: 1500,
        });
        refetch();
      } else {
        Swal.fire({
          icon: "error",
          title: `Try Again!`,
          showConfirmButton: false,
          toast: true,
          position: "top",
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `${error.message}`,
        showConfirmButton: false,
        toast: true,
        position: "top",
        timer: 1500,
      });
    }
  };

  const removePromo = async (id) => {
    try {
      const res = await axiosPublic.delete(`/promotions/${id}`);
      if (res.data.deletedCount > 0) {
        Swal.fire({
          icon: "success",
          title: `Promomotion Delete Successfully`,
          showConfirmButton: false,
          toast: true,
          position: "top",
          timer: 1500,
        });
        refetch();
      } else {
        Swal.fire({
          icon: "error",
          title: `Try Again!`,
          showConfirmButton: false,
          toast: true,
          position: "top",
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `${error.message}`,
        showConfirmButton: false,
        toast: true,
        position: "top",
        timer: 1500,
      });
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPromotions.length / promoPageSize)
  );

  const renderPageNumbers = useRenderPageNumbers(
    promoPage,
    totalPages,
    setPromoPage
  );
  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-3">
        {/* Left (Title + Button on small screens) */}
        <div className="flex items-center justify-between w-full md:w-auto order-1 md:order-1">
          <h3 className="font-semibold sm:text-md text-[15px]">
            Promotions ({promotions.length})
          </h3>
          {/* Hide this button on md+, show only on sm */}
          {user.role !== "moderator" && (
            <div className="ml-2 lg:hidden">
              <AddBtn btnHandler={onAdd}>New Promotion</AddBtn>
            </div>
          )}
        </div>

        {/* Middle (Search field, center on large screens) */}
        <div className="order-2 md:order-2 w-full md:flex-1 md:flex md:justify-center">
          <SearchField
            placeholder="Search customers..."
            searchValue={promoSearch}
            searchValueChange={(e) => {
              setPromoSearch(e.target.value);
              setPromoPage(1);
            }}
          />
        </div>

        {/* Right (Button on md+ only) */}
        {user.role !== "moderator" && (
          <div className="hidden lg:block order-3">
            <AddBtn btnHandler={onAdd}>New Promotion</AddBtn>
          </div>
        )}
      </div>

      {!promotions.length ? (
        <div className="col-span-full text-center text-gray-500 py-8">
          No products found
        </div>
      ) : (
        <>
          <div className="bg-white rounded shadow-sm p-3">
            {promotions.map((p) => (
              <div
                key={p.id}
                className="flex flex-col xl:flex-row lg:flex-row md:flex-row items-center justify-between border-b py-2 gap-4"
              >
                <div>
                  <div>
                    <span className="font-medium"> {p.code}</span>{" "}
                    <span className="text-xs text-gray-500">{p.discount}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {FormattedDate(p.start_date) || "-"} →{" "}
                    {FormattedDate(p.end_date) || "-"}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`px-2 py-1 rounded ${
                      !p.is_active
                        ? "bg-[#00C853] hover:bg-[#00B34A] text-white"
                        : "text-white bg-[#f72c2c] hover:bg-[#e92323]"
                    }`}
                  >
                    {!p.is_active ? "Active" : "Inactive"}
                  </button>
                  {user.role !== "moderator" && (
                    <button
                      onClick={() => removePromo(p.id)}
                      className=" bg-red-100 hover:bg-red-600 text-red-600 rounded  px-3 py-2  hover:text-white "
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={promoPage}
            totalPages={totalPages}
            setCurrentPage={setPromoPage}
            renderPageNumbers={renderPageNumbers}
          />
        </>
      )}
    </div>
  );
}

export default PromotionsView;
