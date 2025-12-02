import { Mail, MapPin, Phone, User } from "lucide-react";

export default function CustomerDetailsSection({
  PRIMARY_COLOR,
  name,
  phone,
  email,
  address,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h3
        className="text-xl font-bold text-gray-800 mb-4 flex items-center"
        style={{ color: PRIMARY_COLOR }}
      >
        <User size={20} className="mr-2" /> Customer Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information Card */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <h4 className="text-sm font-bold text-gray-700 border-b pb-2 mb-2">
            Contact Information
          </h4>
          <div className="flex items-center text-sm">
            <User size={16} className="mr-2 text-gray-500" />
            <span className="font-semibold text-gray-800">{name}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone size={16} className="mr-2 text-gray-500" />
            <span className="text-gray-700">{phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail size={16} className="mr-2 text-gray-500" />
            <span className="text-gray-700 truncate">{email}</span>
          </div>
        </div>

        {/* Address Card */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <h4 className="text-sm font-bold text-gray-700 border-b pb-2 mb-2">
            Address
          </h4>
          <div className="flex items-start text-sm">
            <MapPin
              size={16}
              className="mr-2 mt-1 text-gray-500 flex-shrink-0"
            />
            <span className="text-gray-700 leading-relaxed">{address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
