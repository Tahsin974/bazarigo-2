import { FileUploadField } from "../../../components/ui/FileUploadField";
import { InputField } from "../../../components/ui/InputField";

export default function BusinessDetails({
  PRIMARY_COLOR,
  formData,
  handleChange,
  errors,
}) {
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
            label="Store Name"
            name="storeName"
            type="text"
            value={formData.storeName}
            onChange={handleChange}
            placeholder="Your Store Name"
            error={errors.storeName}
          />
          <InputField
            label="Main Product Category"
            name="productCategory"
            type="text"
            value={formData.productCategory}
            onChange={handleChange}
            placeholder="e.g., Fashion, Electronics"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <InputField
            label="NID Number"
            name="nidNumber"
            type="number"
            value={formData.NIDNumber}
            onChange={handleChange}
            placeholder="NID Number"
          />

          <InputField
            label="Trade License Number"
            name="tradeLicenseNumber"
            type="text"
            value={formData.tradeLicenseNumber}
            onChange={handleChange}
            placeholder="Enter Trade License Number (Optional)"
            required={false}
          />
        </div>

        <div className="mt-4">
          <InputField
            label="Business Address (Detailed)"
            name="businessAddress"
            type="text"
            value={formData.businessAddress}
            onChange={handleChange}
            placeholder="Detailed address including Street, Area, City, Post Code"
          />
        </div>

        {/* --- NID File Upload --- */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            National ID (NID) Upload
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUploadField
              label="NID - Front Side"
              name="nidFrontFile"
              fileObject={formData.nidFrontFile}
              onChange={handleChange}
              error={errors.nidFrontFile}
              PRIMARY_COLOR={PRIMARY_COLOR}
            />
            <FileUploadField
              label="NID - Back Side"
              name="nidBackFile"
              fileObject={formData.nidBackFile}
              onChange={handleChange}
              error={errors.nidBackFile}
              PRIMARY_COLOR={PRIMARY_COLOR}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
