import { InputField } from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";

export default function PaymentDetails({
  PRIMARY_COLOR,
  formData,
  handleChange,
  mobileBankOptions,
  errors,
}) {
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
              selectValue={formData.mobileBankName}
              selectValueChange={handleChange}
              isWide={true}
            >
              <option value="">Select</option>
              {mobileBankOptions.map((opt) => (
                <option key={opt.value}>{opt.label}</option>
              ))}
            </SelectField>
          </div>

          <InputField
            label="Mobile Banking Account Number"
            name="mobileBankAccountNumber"
            type="tel"
            value={formData.mobileBankAccountNumber}
            onChange={handleChange}
            placeholder="11-digit mobile number"
            required={false}
            error={errors.mobileBankAccountNumber}
          />
        </div>

        {/* --- Traditional Bank --- */}
        <h3 className="text-lg font-medium text-gray-600 mt-4 mb-2">
          Traditional Bank Account
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Bank Name"
            name="bankName"
            type="text"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="e.g., Sonali Bank, Dutch-Bangla Bank"
            required={false}
          />
          <InputField
            label="Bank Account Number"
            name="accountNumber"
            type="text"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Enter Correct Account Number"
            required={false}
            error={errors.accountNumber}
          />
        </div>
      </div>
    </div>
  );
}
