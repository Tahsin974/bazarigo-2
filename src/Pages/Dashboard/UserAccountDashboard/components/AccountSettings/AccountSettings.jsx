import SelectField from "../../../../../components/ui/SelectField";

export default function AccountSettings({
  activeTab,
  settings,
  setSettings,
  saveSettings,
}) {
  return (
    <div>
      {/* Settings */}
      {activeTab === "Settings" && (
        <form
          onSubmit={saveSettings}
          className="bg-white p-6 rounded-2xl shadow-md space-y-4 max-w-md"
        >
          <h3 className="text-lg font-semibold">Settings</h3>
          <label className="flex flex-col gap-1">
            <span>Language</span>
            <div>
              <SelectField
                selectValue={settings.language}
                selectValueChange={(e) =>
                  setSettings((prev) => ({ ...prev, language: e.target.value }))
                }
                isWide={true}
              >
                <option>English</option>
                <option>বাংলা</option>
              </SelectField>
            </div>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-secondary checkbox-xs rounded-sm"
              checked={settings.notifications}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: e.target.checked,
                }))
              }
            />{" "}
            Enable Notifications
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-secondary checkbox-xs rounded-sm"
              checked={settings.twoFactor}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  twoFactor: e.target.checked,
                }))
              }
            />{" "}
            Enable Two-Factor Authentication
          </label>
          <label className="block">
            Old Password
            <input
              type="password"
              value={settings.oldPassword}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  oldPassword: e.target.value,
                }))
              }
              placeholder="Old password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white mt-1"
            />
          </label>
          <label className="block">
            New Password
            <input
              type="password"
              value={settings.password}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="New password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white mt-1"
            />
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-[#FF0055] text-white rounded-md"
          >
            Save Settings
          </button>
        </form>
      )}
    </div>
  );
}
