import { useForm } from "react-hook-form";
import AccountDetails from "./AccountDetails";
import BusinessDetails from "./BusinessDetails";
import PaymentDetails from "./PaymentDetails";
import PersonalInformation from "./PersonalInformation";
import Swal from "sweetalert2";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SellerRegistrationForm({ PRIMARY_COLOR }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [nidFrontImg, setNidFrontImg] = useState(null);
  const [nidBackImg, setNidBackImg] = useState(null);
  const [mainProductCategory, setMainProductCategory] = useState("");
  const [mobileBankName, setMobileBankName] = useState("");
  const [isAcceptTerms, setIsAcceptTerms] = useState(false);
  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        nidFrontImg,
        nidBackImg,
        product_category: mainProductCategory,
        mobile_bank_name: mobileBankName,
        created_at: new Date().toISOString(),
        updated_at: null,
      };
      console.log(payload);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `${error.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* --- Account Details --- */}
        <AccountDetails
          PRIMARY_COLOR={PRIMARY_COLOR}
          register={register}
          errors={errors}
        />

        {/* --- Personal Information --- */}
        <PersonalInformation
          PRIMARY_COLOR={PRIMARY_COLOR}
          register={register}
          errors={errors}
        />
        {/* --- Store, Business Details & Documents --- */}
        <BusinessDetails
          PRIMARY_COLOR={PRIMARY_COLOR}
          register={register}
          errors={errors}
          setNidFrontImg={setNidFrontImg}
          nidFrontImg={nidFrontImg}
          nidBackImg={nidBackImg}
          setNidBackImg={setNidBackImg}
          setMainProductCategory={setMainProductCategory}
          mainProductCategory={mainProductCategory}
        />

        {/* --- Payment Details --- */}
        <PaymentDetails
          PRIMARY_COLOR={PRIMARY_COLOR}
          register={register}
          errors={errors}
          mobileBankName={mobileBankName}
          setMobileBankName={setMobileBankName}
        />

        {/* --- Terms and Conditions --- */}
        <div className="pt-4">
          <div className="flex items-start">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              className="checkbox checkbox-secondary checkbox-xs rounded-sm"
              checked={isAcceptTerms}
              onChange={() => setIsAcceptTerms(!isAcceptTerms)}
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
        </div>

        {/* --- Submit Button and Message --- */}
        <div className="pt-6">
          {!(isValid && isAcceptTerms) ? (
            <Button
              disabled
              type="submit"
              className="w-full bg-gray-300 text-gray-500 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold  "
            >
              Complete Registration
            </Button>
          ) : (
            <Button
              type="submit"
              className={`w-full bg-[${PRIMARY_COLOR}] text-white flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold  cursor-pointer`}
            >
              Complete Registration
            </Button>
          )}
        </div>

        {/* --- Status Message --- */}
      </form>
    </div>
  );
}
