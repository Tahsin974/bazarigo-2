import { FileUploadField } from "../ui/FileUploadField";
import { InputField } from "../ui/InputField";
import SelectField from "../ui/SelectField";

export default function BusinessDetails({
  PRIMARY_COLOR,
  register,
  errors,
  setNidFrontImg,
  nidFrontImg,
  nidBackImg,
  setNidBackImg,
  setMainProductCategory,
  mainProductCategory,
}) {
  const categoryOptions = [
    { value: "All Categories", label: "All Categories" },
    { value: "Electronics", label: "Electronics" },
    { value: "Fashion", label: "Fashion" },
    { value: "Groceries", label: "Groceries" },
    { value: "Health & Beauty", label: "Health & Beauty" },
    { value: "Home & Living", label: "Home & Living" },
    { value: "Sports", label: "Sports" },
  ];
  return (
    <div>
      <div className="border-b pb-4 pt-4">
        <h2
          className=" text-lg font-semibold text-gray-700 mb-4 border-l-4 pl-3"
          style={{ borderLeftColor: PRIMARY_COLOR }}
        >
          Store, Business Details & Documents
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            {...register("storeName", { require: true })}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            label={"Store Name"}
            type="text"
            required
            errors={errors.storeName}
            errorsMessage={errors.storeName?.message}
            placeholder="Your Store Name"
          />
          <div>
            <label className="block text-sm font-medium mb-1">
              Main Product Category
              <span className="text-red-500 ml-1">*</span>
            </label>
            <SelectField
              selectValue={mainProductCategory}
              selectValueChange={(e) => setMainProductCategory(e.target.value)}
              isWide={true}
              required
            >
              <option value="" disabled>
                Select
              </option>
              {categoryOptions.map((cat) => (
                <option key={cat.value}>{cat.label}</option>
              ))}
            </SelectField>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <InputField
            {...register("nidNumber", { require: true })}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            label={"NID Number"}
            required
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault(); // keyboard up/down disable
              }
            }}
            onWheel={(e) => e.target.blur()}
            errors={errors.nidNumber}
            errorsMessage={errors.nidNumber?.message}
            type="number"
            placeholder="NID Number"
          />

          <InputField
            {...register("tradeLicenseNumber", { require: true })}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            label={"Trade License Number"}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault(); // keyboard up/down disable
              }
            }}
            onWheel={(e) => e.target.blur()}
            errors={errors.tradeLicenseNumber}
            errorsMessage={errors.tradeLicenseNumber?.message}
            type="text"
            placeholder="Enter Trade License Number (Optional)"
          />
        </div>

        <div className="mt-4">
          <InputField
            {...register("businessAddress", { require: true })}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            label={"Business Address"}
            required
            errors={errors.businessAddress}
            errorsMessage={errors.businessAddress?.message}
            type="text"
            placeholder="Enter your business address (e.g., Shop 12, Road 5, Banani)"
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="flex-1">
            <InputField
              {...register("district", { require: true })}
              className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
              label={"District"}
              required
              errors={errors.district}
              errorsMessage={errors.district?.message}
              type="text"
              placeholder="Enter district name (e.g., Dhaka)"
            />
          </div>
          <div className="flex-1">
            <InputField
              {...register("thana", { require: true })}
              className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
              label={"Thana/Upazila"}
              required
              errors={errors.thana}
              errorsMessage={errors.thana?.message}
              type="text"
              placeholder="Enter thana or upazila (e.g., Mirpur)"
            />
          </div>
          <div className="flex-1">
            <InputField
              {...register("postal_code", { require: true })}
              className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
              label={"Postal Code"}
              required
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault(); // keyboard up/down disable
                }
              }}
              errors={errors.postal_code}
              errorsMessage={errors.postal_code?.message}
              type="number"
              placeholder="Enter postal code (e.g., 1216)"
            />
          </div>
        </div>

        {/* --- NID File Upload --- */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            National ID (NID) Upload
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FileUploadField
              label="NID - Front Side"
              image={nidFrontImg}
              setImage={setNidFrontImg}
              PRIMARY_COLOR={PRIMARY_COLOR}
            />
            <FileUploadField
              label="NID - Back Side"
              image={nidBackImg}
              setImage={setNidBackImg}
              PRIMARY_COLOR={PRIMARY_COLOR}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
