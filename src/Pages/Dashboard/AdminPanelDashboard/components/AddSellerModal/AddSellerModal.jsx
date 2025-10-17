import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import SellerRegistrationForm from "../../../../SellerRegistration/components/SellerRegistrationForm";

export default function AddSellerModal({ onClose }) {
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
  const mobileBankOptions = [
    { value: "bkash", label: "Bkash" },
    { value: "nagad", label: "Nagad" },
    { value: "rocket", label: "Rocket" },
    { value: "upay", label: "Upay" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-3xl shadow-2xl w-[95%] max-w-6xl h-[90vh] overflow-y-auto"
      >
        {/* --- Close Button --- */}

        {/* --- Header --- */}
        <div className="sticky top-0 bg-white border-b xl:px-6 lg:px-6  px-4 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            🛍️ Add New Seller
          </h2>
          <span className="text-sm text-gray-500">
            Managed by <strong>Admin</strong>
          </span>
          <button
            onClick={onClose}
            className=" text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={28} />
          </button>
        </div>
        <div className="p-6">
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
        </div>
      </motion.div>
    </div>
  );
}
