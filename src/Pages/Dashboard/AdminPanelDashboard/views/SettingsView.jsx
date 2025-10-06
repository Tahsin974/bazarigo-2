import React from "react";

function SettingsView() {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">General Settings</h3>
      <div className="space-y-3 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Store Name</label>
          <input
            className="border w-full rounded px-3 py-2"
            defaultValue="Your Store"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Currency</label>
          <select className="border w-full rounded px-3 py-2">
            <option>USD</option>
            <option>BDT</option>
            <option>EUR</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Theme</label>
          <select className="border w-full rounded px-3 py-2">
            <option>Light</option>
            <option>Dark</option>
            <option>System Default</option>
          </select>
        </div>
      </div>
      <h3 className="font-semibold text-lg">User Management</h3>
      <div className="bg-white p-4 rounded shadow space-y-3">
        <div className="flex items-center justify-between">
          <span>Admin Users</span>
          <button className="px-3 py-1 bg-[#FF0055] text-white rounded">
            Add User
          </button>
        </div>
        <ul className="text-sm text-gray-700 list-disc pl-5">
          <li>admin@example.com</li>
          <li>manager@example.com</li>
        </ul>
      </div>
      <h3 className="font-semibold text-lg">Notification Settings</h3>
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
      </div>
      <h3 className="font-semibold text-lg">Payment Gateway</h3>
      <div className="bg-white p-4 rounded shadow space-y-3">
        <div>
          <label className="block text-sm font-medium">Gateway Provider</label>
          <select className="border w-full rounded px-3 py-2">
            <option>Stripe</option>
            <option>PayPal</option>
            <option>SSLCommerz</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">API Key</label>
          <input
            className="border w-full rounded px-3 py-2"
            placeholder="Enter API Key"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Secret Key</label>
          <input
            className="border w-full rounded px-3 py-2"
            placeholder="Enter Secret Key"
          />
        </div>
      </div>
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
          <select className="border w-full rounded px-3 py-2">
            <option>Standard</option>
            <option>Strong (8+ chars, special symbols)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SettingsView;
