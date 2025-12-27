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
  paginatedPromotions,
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
      <div className="flex flex-wrap lg:items-center lg:justify-between gap-4 mb-3">
        <div className=" w-full ">
          <SearchField
            placeholder="Search promotions..."
            searchValue={promoSearch}
            searchValueChange={(e) => {
              setPromoSearch(e.target.value);
              setPromoPage(1);
            }}
          />
        </div>
        <div className="flex md:flex-row flex-col  items-center justify-between w-full   gap-4">
          <div className="flex  gap-4 justify-start w-full sm:order-1 order-2 ">
            <h3 className="font-medium sm:text-base text-[14px]">
              Promotions ({promotions.length.toLocaleString("en-IN")})
            </h3>
          </div>
          {/* Small screen buttons */}
          {user.role !== "moderator" && (
            <div className="ml-2  flex gap-2 justify-end w-full md:order-2 order-1  ">
              <AddBtn btnHandler={onAdd}>New Promotion</AddBtn>
            </div>
          )}
        </div>
      </div>

      {!paginatedPromotions.length ? (
        <div>
          <div className="mt-3 flex flex-col items-center justify-center py-20 text-gray-400 bg-white">
            <span className="font-semibold"> No promotions found</span>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded shadow-sm p-3">
            {paginatedPromotions.map((p) => (
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
                      className=" bg-red-100 hover:bg-[#e92323] text-red-600 rounded  px-3 py-2  hover:text-white "
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={promoPage}
              totalPages={totalPages}
              setCurrentPage={setPromoPage}
              renderPageNumbers={renderPageNumbers}
            />
          )}
        </>
      )}
    </div>
  );
}

export default PromotionsView;
