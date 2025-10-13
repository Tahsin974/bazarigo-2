export const InputField = ({
  PRIMARY_COLOR,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = true,
  name,
  error,
  children,
}) => (
  <div className="w-full mb-4 relative">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative rounded-lg shadow-sm">
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={type !== "file" ? value : undefined} // File inputs should not be controlled by value
        onChange={onChange}
        placeholder={placeholder}
        className={`focus:ring-[${PRIMARY_COLOR}] focus:border-[${PRIMARY_COLOR}] block w-full border border-gray-300 rounded-lg px-3 py-2  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white ${
          error ? "border-red-500 border-2" : "border"
        }`}
      />
      {children} {/* For password strength meter */}
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);
