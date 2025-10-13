import React from "react";
import { InputField } from "../../../components/ui/InputField";

export default function AccountDetails({
  PRIMARY_COLOR,
  formData,
  handleChange,
  errors,
  passwordStrength,
}) {
  // Password strength styles
  const getStrengthColor = (score) => {
    switch (score) {
      case 1:
        return "bg-red-500"; // Weak
      case 2:
        return "bg-yellow-500"; // Moderate
      case 3:
        return "bg-blue-500"; // Strong
      case 4:
        return "bg-green-500"; // Very Strong
      default:
        return "bg-gray-300";
    }
  };

  const getStrengthText = (score) => {
    switch (score) {
      case 1:
        return "Weak";
      case 2:
        return "Moderate";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "Enter Password";
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email Address"
            error={errors.email}
            PRIMARY_COLOR={PRIMARY_COLOR}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter a Strong Password"
            error={errors.password}
            PRIMARY_COLOR={PRIMARY_COLOR}
          >
            {/* Password Strength Meter */}
            {formData.password && (
              <div className="absolute top-full left-0 mt-1 w-full flex items-center">
                <div className="w-3/4 h-2 rounded-full overflow-hidden mr-2">
                  <div
                    className={`h-full transition-all duration-300`}
                    style={{
                      width: `${passwordStrength * 25}%`,
                      backgroundColor:
                        getStrengthColor(passwordStrength).split("-")[1],
                    }}
                  ></div>
                </div>
                <span
                  className={`text-xs font-semibold ${getStrengthColor(
                    passwordStrength
                  ).replace("bg", "text")}`}
                >
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
            )}
          </InputField>
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter Password"
            error={errors.confirmPassword}
          />
        </div>
      </div>
    </div>
  );
}
