import { motion } from "framer-motion";
import { X } from "lucide-react";
import SelectField from "../../ui/SelectField";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { InputField } from "../../ui/InputField";

export default function PaymentModal({ seller, onClose, refetch }) {
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit, reset } = useForm();
  const [provider, setProvider] = useState("");
  const [method, setMethod] = useState("");
  const [date, setDate] = useState(null);

  const onSubmit = async (data) => {
    try {
      const paymentInfo = {
        seller_id: seller.id,
        seller_name: seller.full_name,
        seller_store_name: seller.store_name,
        amount: data.amount,
        payment_method: method,
        payment_date: new Date(date).toISOString(),

        // Mobile Banking fields
        mobile_bank_name: method === "Mobile Banking" ? provider || null : null,
        transaction_id: data.transaction_id || null,
        mobile_bank_account_number:
          method === "Mobile Banking" ? data.number || null : null,

        // Bank Account fields
        bank_name: method === "Bank Account" ? data.bank_name || null : null,
        bank_account_holder_name:
          method === "Bank Account"
            ? data.bank_account_holder_name || null
            : null,
        bank_account_number:
          method === "Bank Account" ? data.bank_account_number || null : null,
      };

      const res = await axiosPublic.post("/seller-payments", paymentInfo);

      if (res.data.payment) {
        Swal.fire({
          icon: "success",
          title: "Payment Saved",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          position: "top",
        });

        reset();
        onClose();
        refetch();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `${error.message}`,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        position: "top",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 ">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl bg-white rounded shadow overflow-auto max-h-[90vh] relative "
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white">
          <h2 className="text-xl font-semibold">Payment </h2>
          <button
            onClick={onClose}
            className="hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </header>
        <main className="m-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 my-5">
            <div className="grid grid-cols-1 ">
              <div className="flex flex-col mb-4">
                <label className="text-sm mb-1">Payment Date</label>
                <DatePicker
                  selected={date}
                  onChange={setDate}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={"Select Payment Date"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
                />
              </div>
              <InputField
                label="Amount"
                placeholder="Amount"
                {...register("amount", {
                  required: "Amount is required",
                })}
                required
                className=" w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]"
              />

              <div className="flex flex-col mb-4">
                <label className="text-sm mb-1">Payment Method</label>
                <SelectField
                  selectValue={method}
                  selectValueChange={(e) => setMethod(e.target.value)}
                  isWide={true}
                >
                  <option value="" disabled>
                    Select Payment Method
                  </option>
                  <option value="Mobile Banking">Mobile Banking</option>
                  <option value="Bank Account">Bank Account</option>
                </SelectField>
              </div>
              <div
                className={`transition-all duration-500 ease-in-out   ${
                  method
                    ? "max-h-min opacity-100 "
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <InputField
                  label="Transaction Id"
                  placeholder="Transaction Id"
                  {...register("transaction_id")}
                  className=" w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#FF0055]"
                />
              </div>
              <div
                className={`transition-all duration-500 ease-in-out  space-y-5  ${
                  method === "Mobile Banking"
                    ? "max-h-max opacity-100 "
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <div className="flex flex-col mb-4">
                  <label className="text-sm mb-1">Mobile Bank Name</label>
                  <SelectField
                    selectValue={provider || ""}
                    selectValueChange={(e) => setProvider(e.target.value)}
                    isWide={true}
                  >
                    <option value="" disabled>
                      Select Provider
                    </option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                  </SelectField>
                </div>
                <InputField
                  label="Account Number
"
                  placeholder="Account Number
"
                  {...register("number")}
                  type="tel"
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault(); // keyboard up/down disable
                    }
                  }}
                  onWheel={(e) => e.target.blur()}
                  className="w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]"
                />
              </div>
              <div
                className={`transition-all duration-500 ease-in-out    ${
                  method === "Bank Account"
                    ? "max-h-min opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <InputField
                  label="Bank Name
"
                  placeholder="Bank Name
"
                  {...register("bank_name")}
                  className=" w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]"
                />
                <InputField
                  label="Bank Account Holder Name
"
                  placeholder="Bank Account Holder Name
"
                  {...register("bank_account_holder_name")}
                  className=" w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]"
                />
                <InputField
                  label="Bank Account Number"
                  placeholder="Bank Account Number"
                  {...register("bank_account_number")}
                  className=" w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer transition-all hover:scale-105 duration-500"
              >
                Submit
              </button>
            </div>
          </form>
        </main>
      </motion.div>
    </div>
  );
}
