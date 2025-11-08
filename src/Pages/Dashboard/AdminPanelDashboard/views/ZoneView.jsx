import ZoneEditModal from "../../../../components/ZoneEditModal/ZoneEditModal";
import { useQuery } from "@tanstack/react-query";

import SelectField from "../../../../components/ui/SelectField";
import axios from "axios";
import { useMemo, useState } from "react";
import { PlusCircle, SquarePen } from "lucide-react";
import AddBtn from "../../../../components/ui/AddBtn";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import Pagination from "../../../../components/ui/Pagination";
import { useRenderPageNumbers } from "../../../../Utils/Hooks/useRenderPageNumbers";
import SearchField from "../../../../components/ui/SearchField";

export default function ZoneView({
  setPostalZoneSearch,
  postalZoneSearch,
  postalZonePage,
  setPostalZonePage,
  postalZonePageSize,
}) {
  const [openZoneModal, setOpenZoneModal] = useState(false);
  const [activeZone, setActiveZone] = useState(null);
  const [selectArea, setSelectArea] = useState(0);

  const {
    data: postalZones = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["postalZones"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/postal-zones");

      return res.data.postal_zones;
    },
  });

  const handleEdit = (zone) => {
    setOpenZoneModal(true);
    setActiveZone(zone);
  };

  const filteredPostalZones = useMemo(() => {
    let data = [...postalZones];
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
  }, [postalZones, postalZoneSearch]);

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

  return (
    <>
      <div className="space-y-10">
        <div className="flex flex-wrap lg:items-center lg:justify-between gap-4 mb-3">
          {/* Left: SelectAll + Title + small screen Add/Delete buttons */}

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
            <AddBtn btnHandler={() => setOpenZoneModal(true)}>
              <PlusCircle /> Add Coverage Area
            </AddBtn>
            {/* <DeleteAllBtn /> */}
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded-box shadow-sm">
          <table className="table  text-center">
            <thead>
              <tr className="text-black">
                <th>Division</th>
                <th>District</th>
                <th>Thana</th>

                <th>Latitude</th>
                <th>Longitude</th>
                <th>PostCode</th>
                <th>Is Remote</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPostalZones.map((postalZone) => (
                <tr key={postalZone.id} className="border-t">
                  <td>{postalZone.division}</td>
                  <td>{postalZone.district}</td>
                  <td>{postalZone.thana}</td>

                  <td>{postalZone.latitude}</td>
                  <td>{postalZone.longitude}</td>
                  <td>{postalZone.postal_code}</td>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                      defaultChecked={postalZone.is_remote}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(postalZone)}
                      className="px-3 py-2 bg-orange-100 text-[#E6612A] hover:bg-orange-400 hover:text-white rounded cursor-pointer"
                    >
                      <SquarePen size={20} />
                    </button>
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
