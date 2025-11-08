import { InputField } from "../ui/InputField";

export default function PersonalInformation({
  PRIMARY_COLOR,
  register,
  errors,
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
            {...register("full_Name", { require: true })}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            label={"Full Name"}
            type="text"
            required
            errors={errors.full_Name}
            errorsMessage={errors.full_Name?.message}
            placeholder="Your Full Name"
          />
          <InputField
            {...register("phone_number", { require: true })}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault(); // keyboard up/down disable
              }
            }}
            onWheel={(e) => e.target.blur()}
            label={"Mobile Number"}
            type="tel"
            required
            errors={errors.phone_number}
            errorsMessage={errors.phone_number?.message}
            placeholder="11-digit Phone Number"
          />
        </div>
      </div>
    </div>
  );
}
