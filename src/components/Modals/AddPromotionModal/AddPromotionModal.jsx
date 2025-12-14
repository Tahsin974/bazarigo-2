import { X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import { Button } from "@/components/ui/button";

import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { InputField } from "../../ui/InputField";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";

function AddPromotionModal({ onClose, refetch }) {
  const axiosPublic = useAxiosPublic();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        start_date: startDate,
        end_date: endDate,
      };

      const res = await axiosPublic.post("/promotions", payload);
      if (res.data.createdCount > 0) {
        Swal.fire({
          icon: "success",
          title: `Promomotion Create Successfully`,
          showConfirmButton: false,
          toast: true,
          position: "top",
          timer: 1500,
        });
        reset();
        setStartDate(null);
        setEndDate(null);
        onClose();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl bg-white rounded shadow overflow-auto max-h-[90vh] relative"
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white">
          <h2 className="text-xl font-semibold">Add Promotion </h2>
          <button
            onClick={onClose}
            className="hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </header>

        <main className=" my-7 mx-5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-3"
          >
            <div>
              <InputField
                {...register("code", { require: true })}
                className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                label={"Promo Code"}
                type="text"
                required
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault(); // keyboard up/down disable
                  }
                }}
                onWheel={(e) => e.target.blur()}
                errors={errors.code}
                errorsMessage={errors.code?.message}
                placeholder="Promo Code"
              />
            </div>
            <div>
              <InputField
                {...register("discount", { require: true })}
                className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                label={"Discount"}
                type="number"
                required
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault(); // keyboard up/down disable
                  }
                }}
                onWheel={(e) => e.target.blur()}
                errors={errors.discount}
                errorsMessage={errors.discount?.message}
                placeholder="Discount"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-2">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                dateFormat="dd/MM/yyyy"
                placeholderText={"Select Start Date"}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-2">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                dateFormat="dd/MM/yyyy"
                placeholderText={"Select End Date"}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white mt-1"
              />
            </div>
            <div>
              <Button
                type="submit"
                className={`w-full bg-[#00C853] hover:bg-[#00B34A] text-white flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold  cursor-pointer`}
              >
                Submit
              </Button>
            </div>
          </form>
        </main>
      </motion.div>
    </div>
  );
}

export default AddPromotionModal;
