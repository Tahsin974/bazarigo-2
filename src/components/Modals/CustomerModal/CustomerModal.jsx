import { motion } from "framer-motion";
import {
  Cake,
  Mail,
  MapPin,
  Mars,
  Phone,
  ShoppingBag,
  User,
  Venus,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdPayment } from "react-icons/md";

export default function CustomerModal({ customer, onClose }) {
  const baseUrl = import.meta.env.VITE_BASEURL;
  const {
    name,
    user_name,
    email,
    img,
    phone,
    address,
    district,
    thana,
    postal_code,
    date_of_birth,
    gender,
    payment_methods,
  } = customer;
  console.log(customer);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl bg-white rounded shadow overflow-auto max-h-[90vh] relative"
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white">
          <h2 className="text-xl font-semibold">Customer Details</h2>
          <button
            onClick={onClose}
            className="hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </header>
        {/* Content */}
        <main className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {img && img.includes("/uploads") ? (
              <figure>
                <img
                  className="w-24 h-24 rounded-full"
                  src={`${baseUrl}${img}`}
                  alt={name}
                />
              </figure>
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#FFE5E5] flex items-center justify-center text-[#FF0055] text-3xl font-bold">
                <User size={32} />
              </div>
            )}

            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-semibold text-gray-800">{name}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm">
              <User className="text-[#FF0055]" size={20} />
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium text-gray-800">{user_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm">
              <Mail className="text-[#FF0055]" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm">
              <Phone className="text-[#FF0055]" size={20} />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">
                  {phone ? phone : "Not Provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm">
              <MapPin className="text-[#FF0055]" size={20} />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-800">
                  {address || thana || district || postal_code
                    ? `${address || ""}${address && thana ? ", " : ""}${
                        thana || ""
                      }${(address || thana) && district ? ", " : ""}${
                        district || ""
                      }${postal_code ? " - " + postal_code : ""}`
                    : "Not Provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm">
              <Cake className="text-[#FF0055]" size={20} />
              <div>
                <p className="text-sm text-gray-500">Birthday</p>
                <p className="font-medium text-gray-800">
                  {date_of_birth
                    ? new Date(date_of_birth).toLocaleDateString("en-GB")
                    : "Not Provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm">
              {gender ? (
                gender === "Male" ? (
                  <Mars className="text-[#FF0055]" size={20} />
                ) : (
                  <Venus className="text-[#FF0055]" size={20} />
                )
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-300" /> // unknown gender icon
              )}
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium text-gray-800">
                  {" "}
                  {gender ? gender : "Not Specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-inner">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Wallet className="text-[#FF0055]" size={18} /> Payment Methods
            </h4>

            {!payment_methods.length ? (
              <p className="text-gray-500 text-sm">
                No payment methods added yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {payment_methods?.map((pay, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm"
                  >
                    <MdPayment className="text-[#FF0055]" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 capitalize">
                        {pay.provider}
                      </p>
                      <p className="font-medium text-gray-800">{pay.account}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ShoppingBag className="text-[#FF0055]" size={18} /> Recent Orders
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex justify-between border-b pb-2">
                <span>Wireless Headphones</span>
                <span className="text-[#FF0055] font-semibold">$120</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span>Smart Watch</span>
                <span className="text-[#FF0055] font-semibold">$199</span>
              </li>
              <li className="flex justify-between">
                <span>Leather Wallet</span>
                <span className="text-[#FF0055] font-semibold">$40</span>
              </li>
            </ul>
          </div>
        </main>
        {/* Footer */}
        <footer className="px-6 py-4 border-t border-gray-200 flex justify-end bg-gray-50">
          <Button
            onClick={onClose}
            className="bg-[#FF0055] text-white px-6 py-2 rounded-full hover:bg-[#e6004e] transition-colors"
          >
            Close
          </Button>
        </footer>
      </motion.div>
    </div>
  );
}
