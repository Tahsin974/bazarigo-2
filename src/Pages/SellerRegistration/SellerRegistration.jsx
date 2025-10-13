import { useState } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import SellerRegistrationForm from "./components/SellerRegistrationForm";

export const SellerRegistrationPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    NIDNumber: "",
    storeName: "",
    productCategory: "",
    businessType: "",
    businessAddress: "",
    taxId: "",
    // Newly Added
    tradeLicenseNumber: "",
    nidFrontFile: null,
    nidBackFile: null,
    bankName: "",
    accountNumber: "",
    mobileBankName: "",
    mobileBankAccountNumber: "",
    //
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const PRIMARY_COLOR = "#FF0055";
  const getPasswordStrength = (password) => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9\s]/.test(password)) score++;
    return Math.min(score, 4); // Max score is 4
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // File input handling
    const newValue =
      type === "file"
        ? e.target.files[0] || null
        : type === "checkbox"
        ? checked
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setSubmissionMessage(null);
  };

  const validate = () => {
    let newErrors = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (passwordStrength < 3) {
      newErrors.password =
        "Password is not strong enough. Use uppercase, lowercase letters, numbers, and special characters.";
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms =
        "You must accept the terms and conditions to register.";
    }
    // Basic check for required fields
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.storeName) newErrors.storeName = "Store Name is required.";
    if (!formData.businessType)
      newErrors.businessType = "Please select the Business Type.";
    if (!formData.accountNumber && !formData.mobileBankAccountNumber)
      newErrors.accountNumber =
        "At least one payment detail (Bank or Mobile) is required.";

    // File validation (Checking if a file object exists)
    if (!formData.nidFrontFile)
      newErrors.nidFrontFile =
        "Upload of National ID (NID) Front image is required.";
    if (!formData.nidBackFile)
      newErrors.nidBackFile =
        "Upload of National ID (NID) Back image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setSubmissionMessage({
        type: "error",
        text: "There are some errors in the form. Please correct them.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionMessage(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionMessage({
        type: "success",
        text: "Your registration was successful! File upload is complete. We will verify your information soon.",
      });
      // setFormData({ ...initial state for form reset });
    }, 2500);
  };

  // Password strength styles
  // const getStrengthColor = (score) => {
  //   switch (score) {
  //     case 1:
  //       return "bg-red-500"; // Weak
  //     case 2:
  //       return "bg-yellow-500"; // Moderate
  //     case 3:
  //       return "bg-blue-500"; // Strong
  //     case 4:
  //       return "bg-green-500"; // Very Strong
  //     default:
  //       return "bg-gray-300";
  //   }
  // };

  // const getStrengthText = (score) => {
  //   switch (score) {
  //     case 1:
  //       return "Weak";
  //     case 2:
  //       return "Moderate";
  //     case 3:
  //       return "Strong";
  //     case 4:
  //       return "Very Strong";
  //     default:
  //       return "Enter Password";
  //   }
  // };

  const mobileBankOptions = [
    { value: "bkash", label: "Bkash" },
    { value: "nagad", label: "Nagad" },
    { value: "rocket", label: "Rocket" },
    { value: "upay", label: "Upay" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden md:flex">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full  p-6 sm:p-10"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-[#FFE5E5] text-[#FF0055]">
              <User size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Create Seller Account
          </h2>
          <p className="text-gray-500 mb-8">
            Please fill out the form below to launch your store.
          </p>

          <SellerRegistrationForm
            handleSubmit={handleSubmit}
            PRIMARY_COLOR={PRIMARY_COLOR}
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            passwordStrength={passwordStrength}
            mobileBankOptions={mobileBankOptions}
            isSubmitting={isSubmitting}
            submissionMessage={submissionMessage}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SellerRegistrationPage;
