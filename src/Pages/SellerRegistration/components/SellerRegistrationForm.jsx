import AccountDetails from "./AccountDetails";
import BusinessDetails from "./BusinessDetails";
import PaymentDetails from "./PaymentDetails";
import PersonalInformation from "./PersonalInformation";

export default function SellerRegistrationForm({
  handleSubmit,
  PRIMARY_COLOR,
  formData,
  handleChange,
  errors,
  passwordStrength,
  mobileBankOptions,
  isSubmitting,
  submissionMessage,
}) {
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Account Details --- */}
        <AccountDetails
          PRIMARY_COLOR={PRIMARY_COLOR}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          passwordStrength={passwordStrength}
        />

        {/* --- Personal Information --- */}
        <PersonalInformation
          PRIMARY_COLOR={PRIMARY_COLOR}
          formData={formData}
          handleChange={handleChange}
        />
        {/* --- Store, Business Details & Documents --- */}
        <BusinessDetails
          PRIMARY_COLOR={PRIMARY_COLOR}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />

        {/* --- Payment Details --- */}
        <PaymentDetails
          PRIMARY_COLOR={PRIMARY_COLOR}
          formData={formData}
          handleChange={handleChange}
          mobileBankOptions={mobileBankOptions}
          errors={errors}
        />

        {/* --- Terms and Conditions --- */}
        <div className="pt-4">
          <div className="flex items-start">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="checkbox checkbox-secondary checkbox-xs rounded-sm"
            />
            <label
              htmlFor="acceptTerms"
              className="ml-2 block text-sm text-gray-900 cursor-pointer select-none"
            >
              I have carefully read and accept all the{" "}
              <a
                href="/seller-terms-conditions#"
                className="font-medium hover:underline"
                style={{ color: PRIMARY_COLOR }}
              >
                Terms and Conditions
              </a>
              .
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="mt-1 text-xs text-red-500 ml-6">
              {errors.acceptTerms}
            </p>
          )}
        </div>

        {/* --- Submit Button and Message --- */}
        <div className="pt-6">
          {!formData.acceptTerms ? (
            <button
              type="submit"
              className="w-full bg-gray-300 text-gray-500 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold  cursor-none "
              disabled="disabled"
            >
              Complete Registration
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white transition duration-300 ease-in-out transform hover:scale-[1.01] ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[" + PRIMARY_COLOR + "] hover:bg-[#E0004D]"
              }`}
              style={{
                backgroundColor: isSubmitting ? "#A0AEC0" : PRIMARY_COLOR,
              }}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </>
              ) : (
                "Complete Registration"
              )}
            </button>
          )}
        </div>

        {/* --- Status Message --- */}
        {submissionMessage && (
          <div
            className={`mt-4 p-4 rounded-xl text-center font-medium ${
              submissionMessage.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {submissionMessage.text}
          </div>
        )}
      </form>
    </div>
  );
}
