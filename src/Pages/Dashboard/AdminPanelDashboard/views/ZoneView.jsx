import { useMemo, useState } from "react";
import { PlusCircle, SquarePen, Trash2 } from "lucide-react";
import AddBtn from "../../../../components/ui/AddBtn";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import Pagination from "../../../../components/ui/Pagination";

import SearchField from "../../../../components/ui/SearchField";
import Swal from "sweetalert2";
import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import useAxiosPublic from "../../../../Utils/Hooks/useAxiosPublic";
import { useRenderPageNumbers } from "../../../../Utils/Helpers/useRenderPageNumbers";
import ZoneEditModal from "../../../../components/Modals/ZoneEditModal/ZoneEditModal";

export default function ZoneView({
  setPostalZoneSearch,
  postalZoneSearch,
  postalZonePage,
  setPostalZonePage,
  postalZonePageSize,
  coverageAreas,
  refetch,
  selected,
  allSelected,
  toggleSelectAll,
  toggleSelect,
}) {
  const axiosPublic = useAxiosPublic();
  const [openZoneModal, setOpenZoneModal] = useState(false);
  const [activeZone, setActiveZone] = useState(null);
  const [selectArea, setSelectArea] = useState("0");

  const handleEdit = (zone) => {
    setOpenZoneModal(true);
    setActiveZone(zone);
  };
  const handleAdd = () => {
    setOpenZoneModal(true);
    setActiveZone(null);
  };
  const HandleDeleteArea = async (id) => {
    try {
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
          const res = await axiosPublic.delete(`/postal-zones/${id}`);
          if (res.data.deletedCount > 0) {
            Swal.fire({
              icon: "success",
              title: "Postal Zone Deleted Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Opps! Try Again",
              showConfirmButton: false,
              timer: 1500,
            });
          }
          refetch();
        } else {
          return;
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `${error.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const handleBulkDelete = async () => {
    if (selected.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No zones selected",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure you want to delete selected zones?",
        showCancelButton: true,
        confirmButtonColor: "#00C853",
        cancelButtonColor: "#f72c2c",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const res = await axiosPublic.delete("/postal-zones/bulk-delete", {
          data: { ids: selected },
        });

        if (res.data.deletedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Selected zones deleted successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops! Try again",
            showConfirmButton: false,
            timer: 1500,
          });
        }

        refetch();
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const filteredPostalZones = useMemo(() => {
    let data = [...coverageAreas];
    if (postalZoneSearch) {
      const q = postalZoneSearch.toLowerCase();
      data = data.filter(
        (p) =>
          (p.division || "").toLowerCase().includes(q) ||
          (p.district || "").toLowerCase().includes(q) ||
          (p.thana || "").toLowerCase().includes(q)
      );
    }

    return data;
  }, [coverageAreas, postalZoneSearch]);

  const paginatedPostalZones = filteredPostalZones.slice(
    (postalZonePage - 1) * postalZonePageSize,
    postalZonePage * postalZonePageSize
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPostalZones.length / postalZonePageSize)
  );
  const renderPageNumbers = useRenderPageNumbers(
    postalZonePage,
    totalPages,
    setPostalZonePage
  );

  console.log(selected);

  return (
    <>
      <div className="space-y-10">
        <div className="flex flex-wrap lg:items-center lg:justify-between gap-4 mb-3">
          {/* Left: SelectAll + Title + small screen Add/Delete buttons */}
          <h1 className="text-lg">
            Zones {coverageAreas?.length ? <>({coverageAreas.length})</> : ""}
          </h1>
          {/* Middle: Search + Sort */}

          <div className="w-full order-1 xl:w-auto lg:w-auto md:w-auto  ">
            <SearchField
              placeholder="Search zones..."
              searchValue={postalZoneSearch}
              searchValueChange={(e) => {
                setPostalZoneSearch(e.target.value);
                setPostalZonePage(1);
              }}
            />
          </div>

          {/* Right: Buttons on large screens */}
          <div className="flex gap-2 order-2 ">
            <AddBtn btnHandler={handleAdd}>
              <PlusCircle /> Add Coverage Area
            </AddBtn>
            <DeleteAllBtn selected={selected} bulkDelete={handleBulkDelete} />
          </div>
        </div>
        {!coverageAreas.length ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            No Areas found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-box shadow-sm">
              <table className="table  text-center">
                <thead>
                  <tr className="text-black">
                    <th>
                      <SelectAllCheckbox
                        selected={selected}
                        allSelected={allSelected}
                        toggleSelectAll={toggleSelectAll}
                        isShowCounter={false}
                      />
                    </th>
                    <th>Division</th>
                    <th>District</th>
                    <th>Upazila/Thana</th>
                    <th>Place</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Post Code</th>
                    <th>Area Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPostalZones.map((postalZone) => (
                    <tr key={postalZone.id} className="border-t">
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                          checked={selected.includes(postalZone.id)}
                          onChange={() => toggleSelect(postalZone.id)}
                        />
                      </td>
                      <td>{postalZone.division}</td>
                      <td>{postalZone.district}</td>
                      <td>{postalZone.thana}</td>
                      <td>{postalZone.place}</td>
                      <td>{postalZone.latitude}</td>
                      <td>{postalZone.longitude}</td>
                      <td>{postalZone.postal_code}</td>
                      <td>
                        {postalZone.is_remote ? (
                          <span className="text-red-500">Hard-to-Reach</span>
                        ) : (
                          <span className="text-green-500">Normal</span>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(postalZone)}
                            className="px-3 py-2 bg-orange-100 text-[#E6612A] hover:bg-orange-400 hover:text-white rounded cursor-pointer"
                          >
                            <SquarePen size={20} />
                          </button>

                          <button
                            onClick={() => HandleDeleteArea(postalZone.id)}
                            className="bg-red-100 hover:bg-red-600 text-red-600 rounded px-3 py-2 hover:text-white"
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
            <div className=" flex items-center justify-center">
              <Pagination
                currentPage={postalZonePage}
                totalPages={totalPages}
                setCurrentPage={setPostalZonePage}
                renderPageNumbers={renderPageNumbers}
              />
            </div>
          </>
        )}
      </div>
      {openZoneModal && (
        <ZoneEditModal
          onClose={() => setOpenZoneModal(false)}
          refetch={refetch}
          zone={activeZone}
          selectArea={selectArea}
          setSelectArea={setSelectArea}
        />
      )}
    </>
  );
}
