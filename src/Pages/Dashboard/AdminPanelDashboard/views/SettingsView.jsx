import React from "react";
import AddBtn from "../../../../components/ui/AddBtn";
import SelectField from "../../../../components/ui/SelectField";

function SettingsView() {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">General Settings</h3>
      <div className="space-y-3 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Store Name</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
            defaultValue="Your Store"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Currency</label>
          <SelectField
            selectValue={"USD"}
            selectValueChange={() => {}}
            isWide={true}
          >
            <option>USD</option>
            <option>BDT</option>
            <option>EUR</option>
          </SelectField>
        </div>
        <div>
          <label className="block text-sm font-medium">Theme</label>
          <SelectField
            selectValue={"Light"}
            selectValueChange={() => {}}
            isWide={true}
          >
            <option>Light</option>
            <option>Dark</option>
            <option>System Default</option>
          </SelectField>
        </div>
      </div>
      <h3 className="font-semibold text-lg">User Management</h3>
      <div className="bg-white p-4 rounded shadow space-y-3">
        <div className="flex items-center justify-between">
          <span>Admin Users</span>
          <AddBtn btnHandler={() => alert("Add User Clicked")}>Add User</AddBtn>
        </div>
        <ul className="text-sm text-gray-700 list-disc pl-5">
          <li>admin@example.com</li>
          <li>manager@example.com</li>
        </ul>
      </div>
      {/* Notification Settings */}
      {/* <h3 className="font-semibold text-lg">Notification Settings</h3>
      <div className="bg-white p-4 rounded shadow space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-secondary checkbox-xs rounded-sm"
            defaultChecked
          />{" "}
          Email Notifications
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-secondary checkbox-xs rounded-sm"
          />{" "}
          SMS Notifications
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-secondary checkbox-xs rounded-sm"
            defaultChecked
          />{" "}
          Order Updates
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-secondary checkbox-xs rounded-sm"
          />{" "}
          Marketing Promotions
        </label>
      </div> */}

      {/* Payment Gateway */}
      {/* <h3 className="font-semibold text-lg">Payment Gateway</h3>
      <div className="bg-white p-4 rounded shadow space-y-3">
        <div>
          <label className="block text-sm font-medium">Gateway Provider</label>
          <SelectField
            selectValue={"Stripe"}
            selectValueChange={() => {}}
            isWide={true}
          >
            <option>Stripe</option>
            <option>PayPal</option>
            <option>SSLCommerz</option>
          </SelectField>
        </div>
        <div>
          <label className="block text-sm font-medium">API Key</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
            placeholder="Enter API Key"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Secret Key</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
            placeholder="Enter Secret Key"
          />
        </div>
      </div> */}
      <h3 className="font-semibold text-lg">Security</h3>
      <div className="bg-white p-4 rounded shadow space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-secondary checkbox-xs rounded-sm"
            defaultChecked
          />{" "}
          Two-Factor Authentication
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-secondary checkbox-xs rounded-sm"
          />{" "}
          Allow IP Whitelisting
        </label>
        <div>
          <label className="block text-sm font-medium">Password Policy</label>
          <SelectField
            selectValue={"Standard"}
            selectValueChange={() => {}}
            isWide={true}
          >
            <option>Standard</option>
            <option>Strong (8+ chars, special symbols)</option>
          </SelectField>
        </div>
      </div>
    </div>
  );
}

export default SettingsView;
