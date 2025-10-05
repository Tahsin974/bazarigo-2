import { CreditCard, PlusCircle, ShoppingBag, Star } from "lucide-react";

export default function Payments({
  paymentMethods,
  activeTab,
  setPrimaryPayment,
  removePayment,
  addPayment,
  newPayment,
  setNewPayment,
}) {
  return (
    <div>
      {activeTab === "payments" && (
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-md">
                    {pm.type === "card" ? (
                      <CreditCard size={16} />
                    ) : (
                      <ShoppingBag size={16} />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{pm.label}</div>
                    <div className="text-xs text-gray-500">{pm.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pm.primary && <Star className="text-yellow-400" size={16} />}
                  <button
                    onClick={() => setPrimaryPayment(pm.id)}
                    className="text-xs px-2 py-1 rounded-md border"
                  >
                    Set Primary
                  </button>
                  <button
                    onClick={() => removePayment(pm.id)}
                    className="text-xs px-2 py-1 rounded-md border text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={addPayment}
            className="mt-6 space-y-3 border-t pt-4 max-w-2xl"
          >
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setNewPayment((prev) => ({ ...prev, method: "card" }))
                }
                className={`px-3 py-2 rounded-md ${
                  newPayment.method === "card"
                    ? "bg-[#FF0055] text-white"
                    : "bg-gray-100"
                }`}
              >
                Card
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewPayment((prev) => ({ ...prev, method: "wallet" }))
                }
                className={`px-3 py-2 rounded-md ${
                  newPayment.method === "wallet"
                    ? "bg-[#FF0055] text-white"
                    : "bg-gray-100"
                }`}
              >
                Wallet
              </button>
            </div>

            {newPayment.method === "card" ? (
              <div className="space-y-2">
                <input
                  value={newPayment.cardNumber}
                  onChange={(e) =>
                    setNewPayment((prev) => ({
                      ...prev,
                      cardNumber: e.target.value,
                    }))
                  }
                  placeholder="Card Number"
                  className="w-full border px-3 py-2 rounded-md"
                />
                <input
                  value={newPayment.brand}
                  onChange={(e) =>
                    setNewPayment((prev) => ({
                      ...prev,
                      brand: e.target.value,
                    }))
                  }
                  placeholder="Brand (Visa/Mastercard)"
                  className="w-full border px-3 py-2 rounded-md"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newPayment.makePrimary}
                    className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                    onChange={(e) =>
                      setNewPayment((prev) => ({
                        ...prev,
                        makePrimary: e.target.checked,
                      }))
                    }
                  />{" "}
                  Make Primary
                </label>
              </div>
            ) : (
              <div className="space-y-2">
                <select
                  value={newPayment.walletProvider}
                  onChange={(e) =>
                    setNewPayment((prev) => ({
                      ...prev,
                      walletProvider: e.target.value,
                    }))
                  }
                  className="w-full border px-3 py-2 rounded-md"
                >
                  <option value="">Select Provider</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                </select>
                <input
                  value={newPayment.walletPhone}
                  onChange={(e) =>
                    setNewPayment((prev) => ({
                      ...prev,
                      walletPhone: e.target.value,
                    }))
                  }
                  placeholder="Phone Number"
                  className="w-full border px-3 py-2 rounded-md"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newPayment.makePrimary}
                    onChange={(e) =>
                      setNewPayment((prev) => ({
                        ...prev,
                        makePrimary: e.target.checked,
                      }))
                    }
                  />{" "}
                  Make Primary
                </label>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF0055] text-white rounded-md flex items-center gap-2"
              >
                <PlusCircle size={16} /> Add Payment
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewPayment({
                    method: "card",
                    cardNumber: "",
                    brand: "",
                    walletProvider: "",
                    walletPhone: "",
                    makePrimary: false,
                  })
                }
                className="px-4 py-2 rounded-md border"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
