import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const InputField = ({
  className = "",
  errors,
  errorsMessage,
  label,
  type,
  required,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full mb-4 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          className={className}
          {...props}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {errors && <p className="mt-1 text-xs text-red-500">{errorsMessage}</p>}
    </div>
  );
};
