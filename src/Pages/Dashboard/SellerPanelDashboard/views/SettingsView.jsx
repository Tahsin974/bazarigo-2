import { motion } from "framer-motion";

export default function SettingsView({
  active,
  bankSettings,
  setBankSettings,
  bdSettings,
  setBdSettings,
  profile,
  setProfile,
  notifications,
  setNotifications,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  twoFA,
  setTwoFA,
  loginAlert,
  setLoginAlert,
  savePaymentSettings,
  saveProfileSettings,
  saveNotificationSettings,
  saveSecurity,
}) {
  return (
    <div>
      {active === "Settings" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column: Payment settings + BD methods + Profile */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4">Bank Payment Methods</h3>
                <label className="block text-sm">Bank Name</label>
                <input
                  value={bankSettings.bankName}
                  onChange={(e) =>
                    setBankSettings((prev) => ({
                      ...prev,
                      bankName: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <label className="block text-sm">Account Number</label>
                <input
                  value={bankSettings.accountNumber}
                  onChange={(e) =>
                    setBankSettings((prev) => ({
                      ...prev,
                      accountNumber: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <label className="block text-sm">Routing Number / SWIFT</label>
                <input
                  value={bankSettings.routingNumber}
                  onChange={(e) =>
                    setBankSettings((prev) => ({
                      ...prev,
                      routingNumber: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={savePaymentSettings}
                    className="bg-[#FF0055] text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4">
                  Bangladeshi Payment Methods
                </h3>
                <label className="block text-sm">bKash Number</label>
                <input
                  value={bdSettings.bkash}
                  onChange={(e) =>
                    setBdSettings((prev) => ({
                      ...prev,
                      bkash: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2 mb-2"
                  placeholder="01XXXXXXXXX"
                />
                <label className="block text-sm">Nagad Number</label>
                <input
                  value={bdSettings.nagad}
                  onChange={(e) =>
                    setBdSettings((prev) => ({
                      ...prev,
                      nagad: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2 mb-2"
                  placeholder="01XXXXXXXXX"
                />
                <label className="block text-sm">Rocket Number</label>
                <input
                  value={bdSettings.rocket}
                  onChange={(e) =>
                    setBdSettings((prev) => ({
                      ...prev,
                      rocket: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2 mb-2"
                  placeholder="01XXXXXXXXX"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={savePaymentSettings}
                    className="bg-[#FF0055] text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4">Profile Settings</h3>
                <label className="block text-sm">Shop Name</label>
                <input
                  value={profile.shopName}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      shopName: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <label className="block text-sm">Email</label>
                <input
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <label className="block text-sm">Phone</label>
                <input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={saveProfileSettings}
                    className="bg-[#FF0055] text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Right column: Notifications + Security + Misc */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4">Notification Settings</h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifications.orderAlerts}
                    onChange={(e) =>
                      setNotifications((prev) => ({
                        ...prev,
                        orderAlerts: e.target.checked,
                      }))
                    }
                  />{" "}
                  Order Alerts
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifications.paymentAlerts}
                    onChange={(e) =>
                      setNotifications((prev) => ({
                        ...prev,
                        paymentAlerts: e.target.checked,
                      }))
                    }
                  />{" "}
                  Payment Alerts
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifications.weeklyReports}
                    onChange={(e) =>
                      setNotifications((prev) => ({
                        ...prev,
                        weeklyReports: e.target.checked,
                      }))
                    }
                  />{" "}
                  Weekly Reports
                </label>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={saveNotificationSettings}
                    className="bg-[#FF0055] text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4">Security</h3>
                <label className="block text-sm">Old Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <label className="block text-sm">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <label className="block text-sm">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <label className="block text-sm">
                  Two-Factor Authentication
                </label>
                <select
                  value={twoFA}
                  onChange={(e) => setTwoFA(e.target.value)}
                  className="w-full border rounded px-3 py-2 mb-2"
                >
                  <option>Disabled</option>
                  <option>Email</option>
                  <option>SMS</option>
                  <option>Authenticator App</option>
                </select>
                <label className="block text-sm">Login Alerts</label>
                <select
                  value={loginAlert}
                  onChange={(e) => setLoginAlert(e.target.value)}
                  className="w-full border rounded px-3 py-2 mb-2"
                >
                  <option>Disabled</option>
                  <option>Email</option>
                  <option>SMS</option>
                </select>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={saveSecurity}
                    className="bg-[#FF0055] text-white px-4 py-2 rounded"
                  >
                    Update Security
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4">Misc</h3>
                <div className="text-sm text-gray-600">
                  Dark Mode and Multi-language toggles can be added here.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
