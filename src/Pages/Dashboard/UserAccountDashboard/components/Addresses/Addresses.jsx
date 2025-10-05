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
      {activeTab === "addresses" && (
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4 max-w-2xl">
          <h3 className="text-lg font-semibold">Saved Addresses</h3>
          <form onSubmit={addAddress} className="flex gap-3">
            <select
              value={newAddress.type}
              onChange={(e) =>
                setNewAddress((prev) => ({ ...prev, type: e.target.value }))
              }
              className="border px-3 py-2 rounded-md"
            >
              <option>Home</option>
              <option>Office</option>
              <option>Other</option>
            </select>
            <input
              value={newAddress.details}
              onChange={(e) =>
                setNewAddress((prev) => ({ ...prev, details: e.target.value }))
              }
              placeholder="Address details"
              className="flex-1 border px-3 py-2 rounded-md"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF0055] text-white rounded-md"
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
                    className="px-2 py-1 rounded-md border text-sm text-red-600"
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
