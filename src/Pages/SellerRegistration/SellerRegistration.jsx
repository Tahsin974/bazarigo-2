import { motion } from "framer-motion";
import { User } from "lucide-react";
import SellerRegistrationForm from "../../components/SellerRegistrationForm/SellerRegistrationForm";
import useSellers from "../../Utils/Hooks/useSellers";

export const SellerRegistrationPage = () => {
  const PRIMARY_COLOR = "#FF0055";
  const { refetch } = useSellers();
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden md:flex">
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
            PRIMARY_COLOR={PRIMARY_COLOR}
            refetch={refetch}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SellerRegistrationPage;
