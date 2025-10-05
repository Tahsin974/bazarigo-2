import ReturnForm from "./ReturnForm";

export default function Returns({
  returnRequests,
  activeTab,
  prefillOrderId,
  addReturnRequest,
  deleteReturnRequest,
  updateReturnStatus,
}) {
  return (
    <div>
      {activeTab === "returns" && (
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <h3 className="text-lg font-semibold">Return Requests</h3>
          <ReturnForm
            prefillOrderId={prefillOrderId}
            onSubmit={(orderId, reason, images) =>
              addReturnRequest(orderId, reason, images)
            }
          />

          <div className="space-y-2">
            {returnRequests.length === 0 && (
              <div className="text-sm text-gray-500">
                No return requests yet.
              </div>
            )}
            {returnRequests.map((req) => (
              <div key={req.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Order: {req.orderId}</div>
                    <div className="text-sm text-gray-500">
                      Reason: {req.reason}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteReturnRequest(req.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                    <select
                      value={req.status}
                      onChange={(e) =>
                        updateReturnStatus(req.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="mt-2">
                  <span
                    className={`text-xs ${
                      req.status === "Pending"
                        ? "text-yellow-600"
                        : req.status === "Approved"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    Status: {req.status}
                  </span>
                </div>

                {req.images && req.images.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {req.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`upload-${idx}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
