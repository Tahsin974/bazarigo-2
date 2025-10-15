import SelectField from "../../../../../components/ui/SelectField";

export default function Addresses({
  addresses,
  activeTab,
  addAddress,
  newAddress,
  setNewAddress,
  removeAddress,
  setPrimaryAddress,
}) {
  return (
    <div>
      {activeTab === "Addresses" && (
        <div className="bg-white sm:p-6 p-3 rounded-2xl shadow-md space-y-4 max-w-2xl">
          <h3 className="text-lg font-semibold">Saved Addresses</h3>
          <form onSubmit={addAddress} className="flex flex-wrap gap-3">
            <SelectField
              selectValue={newAddress.type}
              selectValueChange={(e) =>
                setNewAddress((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <option>Home</option>
              <option>Office</option>
              <option>Other</option>
            </SelectField>

            <input
              value={newAddress.details}
              onChange={(e) =>
                setNewAddress((prev) => ({ ...prev, details: e.target.value }))
              }
              placeholder="Address details"
              className="md:w-96 w-full border border-gray-300 rounded-lg px-3 py-2  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white "
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#00C853] hover:bg-[#00B34A] text-white rounded-md"
            >
              Add
            </button>
          </form>

          <div className="space-y-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="border rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {addr.type}{" "}
                    {addr.primary && (
                      <span className="text-xs text-green-600">(Primary)</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{addr.details}</div>
                </div>
                <div className="flex gap-2">
                  {!addr.primary && (
                    <button
                      onClick={() => setPrimaryAddress(addr.id)}
                      className="px-2 py-1 rounded-md border text-sm"
                    >
                      Set Primary
                    </button>
                  )}
                  <button
                    onClick={() => removeAddress(addr.id)}
                    className="px-2 py-1 rounded-md border text-sm text-[#f72c2c] hover:text-[#e92323]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
