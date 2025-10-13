import { InputField } from "../../../components/ui/InputField";

export default function PersonalInformation({
  PRIMARY_COLOR,
  formData,
  handleChange,
}) {
  return (
    <div>
      <div className="border-b pb-4 pt-4">
        <h2
          className=" text-lg font-semibold text-gray-700 mb-4 border-l-4 pl-3"
          style={{ borderLeftColor: PRIMARY_COLOR }}
        >
          Personal and Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Full Name"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your Full Name"
          />
          <InputField
            label="Mobile Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="11-digit Phone Number"
          />
        </div>
      </div>
    </div>
  );
}
