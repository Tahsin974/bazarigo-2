import { InputField } from "../ui/InputField";
import SelectField from "../ui/SelectField";

export default function PaymentDetails({
  PRIMARY_COLOR,
  register,
  errors,
  mobileBankName,
  setMobileBankName,
}) {
  const mobileBankOptions = [
    { value: "bkash", label: "Bkash" },
    { value: "nagad", label: "Nagad" },
    { value: "rocket", label: "Rocket" },
  ];
  return (
    <div>
      <div className="pt-4">
        <h2
          className=" text-lg font-semibold text-gray-700 mb-4 border-l-4 pl-3"
          style={{ borderLeftColor: PRIMARY_COLOR }}
        >
          Payment Details (At least one method is required)
        </h2>

        {/* --- Mobile Banking --- */}
        <h3 className="text-lg font-medium text-gray-600 mt-4 mb-2">
          Mobile Banking (e.g., Bkash, Nagad)
        </h3>
        <div className="grid grid-cols-1  gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile Bank Name
            </label>
            <SelectField
              isWide={true}
              selectValue={mobileBankName}
              selectValueChange={(e) => setMobileBankName(e.target.value)}
            >
              <option value="" disabled>
                Select
              </option>
              {mobileBankOptions.map((opt) => (
                <option key={opt.value}>{opt.label}</option>
              ))}
            </SelectField>
          </div>

          <InputField
            {...register("mobileBankAccountNumber")}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            errors={errors.mobileBankAccountNumber}
            errorsMessage={errors.mobileBankAccountNumber?.message}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault(); // keyboard up/down disable
              }
            }}
            onWheel={(e) => e.target.blur()}
            label="Mobile Banking Account Number"
            type="tel"
            placeholder="11-digit mobile number"
          />
        </div>

        {/* --- Traditional Bank --- */}
        <h3 className="text-lg font-medium text-gray-600 mt-4 mb-2">
          Traditional Bank Account
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            {...register("bankName")}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            label={"Bank Name"}
            errors={errors.bankName}
            errorsMessage={errors.bankName?.message}
            type="text"
            placeholder="e.g., Sonali Bank, Dutch-Bangla Bank"
          />
          <InputField
            {...register("branchName")}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            errors={errors.branchName}
            errorsMessage={errors.branchName?.message}
            label="Branch Name"
            type="text"
            placeholder="e.g., Motijheel Branch"
          />
          <InputField
            {...register("accountNumber")}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            errors={errors.accountNumber}
            errorsMessage={errors.accountNumber?.message}
            label="Bank Account Number"
            type="text"
            placeholder="e.g., 1234567890"
          />

          <InputField
            {...register("accountHolderName")}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            errors={errors.accountHolderName}
            errorsMessage={errors.accountHolderName?.message}
            label="Bank Account Holder Name"
            type="text"
            placeholder="e.g., Rahim Ghosh"
          />
        </div>
        <InputField
          {...register("routingNumber")}
          className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
          errors={errors.routingNumber}
          errorsMessage={errors.routingNumber?.message}
          label="Bank Routing Number / IFSC"
          type="text"
          placeholder="e.g., 021000021 or DBBLBDDH"
        />
      </div>
    </div>
  );
}
