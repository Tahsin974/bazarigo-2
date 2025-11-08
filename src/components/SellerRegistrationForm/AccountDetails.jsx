import { InputField } from "../ui/InputField";

export default function AccountDetails({ PRIMARY_COLOR, register, errors }) {
  return (
    <div>
      {/* --- Account Details --- */}
      <div className="border-b pb-4">
        <h2
          className=" text-lg font-semibold text-gray-700 mb-4 border-l-4 pl-3"
          style={{ borderLeftColor: PRIMARY_COLOR }}
        >
          Account Details
        </h2>
        <div className="">
          <InputField
            {...register("email", { require: true })}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            label={"Email"}
            type="email"
            required
            errors={errors.email}
            errorsMessage={errors.email?.message}
            placeholder="Enter Your Email"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <InputField
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
                message:
                  "Must be at least 8 chars, include one uppercase, one number, and one special character",
              },
            })}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            label={"Password"}
            type="password"
            required
            errors={errors.password}
            errorsMessage={errors.password?.message}
            placeholder="Enter a Strong Password"
          ></InputField>
          <InputField
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value, allValues) =>
                value === allValues.password || "Passwords do not match",
            })}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}]`}
            label={"Confirm Password"}
            type="password"
            required
            errors={errors.confirmPassword}
            errorsMessage={errors.confirmPassword?.message}
            placeholder="Re-enter Password"
          />
        </div>
      </div>
    </div>
  );
}
