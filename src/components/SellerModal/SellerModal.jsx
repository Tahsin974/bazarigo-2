import { motion } from "framer-motion";
import { X, Star, MapPin, Package, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Rating from "react-rating";
import { HashLink } from "react-router-hash-link";
import front from "../../assets/Deep NID Front.png";
import back from "../../assets/Deep NID Back.png";
export default function SellerModal({ onClose, seller }) {
  console.log(seller);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-3xl bg-white rounded shadow overflow-auto max-h-[90vh] relative"
      >
        {/* Close Button */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white">
          <h2 className="text-xl font-semibold">Seller Info </h2>
          <button
            onClick={onClose}
            className="hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </header>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 border-b">
          <img
            src={seller.logo || "https://placehold.co/100x100?text=Seller"}
            alt={`${seller.full_name} Logo`}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#FF0055] shadow-md"
          />

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              {seller.store_name}
            </h2>

            <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
              <Rating
                emptySymbol={<Star size={20} className=" text-gray-300" />}
                fullSymbol={
                  <Star size={20} className="text-[#FFD700] fill-[#FFD700]" />
                }
                initialRating={5}
                readonly
              />
              <span className="text-sm text-gray-500 ml-1">(5+ reviews)</span>
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="py-6 md:px-6 px-4 space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <User className="text-[#FF0055]" />
            <span className="font-bold md:text-base text-sm">
              {seller.full_name || "No Name provided"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="text-[#FF0055]" />
            <span className="font-bold md:text-base text-sm">
              {seller.business_address || "Location not available"}
              {seller.thana}, {seller.district}- {seller.postal_code}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="text-[#FF0055]" />
            <span className="font-bold md:text-base text-sm">
              {seller.email || "No contact email provided"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Phone className="text-[#FF0055]" />
            <span className="font-bold md:text-base text-sm">
              {seller.phone_number}
            </span>
          </div>
          <div className="overflow-x-auto bg-white rounded-box shadow-sm ">
            <table className="table  text-center">
              {/* head */}
              <thead className="text-black">
                <tr>
                  <th>NID Number</th>
                  <th>Trade License</th>
                  <th>Product Category</th>
                  <th>Bank</th>
                  <th>Mobile Bank</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td>
                    <span className="font-semibold  text-gray-600">
                      {seller.nid_number || "-"}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold  text-gray-600">
                      {seller.trade_license_number || "-"}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold  text-gray-600">
                      {seller.product_category || "-"}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold  text-gray-600">
                      {seller.bank_name || "-"} ({seller.account_number || "-"})
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold  text-gray-600">
                      {" "}
                      {seller.mobile_bank_name || "-"} (
                      {seller.mobile_bank_account_number || "-"})
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold  text-gray-600">
                      {seller.created_at || "-"}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold  text-gray-600">
                      {" "}
                      {seller.updated_at || "-"}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold  text-gray-600">
                      {seller.role || "-"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-6 grid md:grid-cols-2  gap-6 justify-center items-center">
            <div className="flex flex-col justify-center gap-2 ">
              <span className="font-semibold  text-gray-600 text-center">
                NID Front:
              </span>
              <img src={front} alt="" />
            </div>
            <div className="flex flex-col justify-center gap-2 ">
              <span className="font-semibold  text-gray-600 text-center">
                NID Back:
              </span>
              <img src={back} alt="" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-end gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-3 py-1 rounded text-white bg-[#f72c2c] hover:bg-[#e92323]"
          >
            Close
          </Button>
          <HashLink to={`/seller-page/${seller.store_name}/store#`}>
            <Button className="px-3 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded  cursor-pointer">
              Visit Store
            </Button>
          </HashLink>
        </div>
      </motion.div>
    </div>
  );
}
