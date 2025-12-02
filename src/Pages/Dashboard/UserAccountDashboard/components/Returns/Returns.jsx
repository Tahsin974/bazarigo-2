import { Trash2 } from "lucide-react";
import ReturnForm from "./ReturnForm";
import useAxiosPublic from "../../../../../Utils/Hooks/useAxiosPublic";
import Swal from "sweetalert2";

export default function Returns({ returnRequests, activeTab, refetch }) {
  const baseUrl = import.meta.env.VITE_BASEURL;
  const axiosPublic = useAxiosPublic();
  console.log(returnRequests);
  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "text-blue-600 bg-blue-100 border-blue-300";
      case "Completed":
        return "text-green-600 bg-green-100 border-green-300";
      case "pending":
      default:
        return "text-yellow-700 bg-yellow-100 border-yellow-300";
    }
  };
  const handleDelete = async (id) => {
    try {
      await axiosPublic.delete(`/return-requests/${id}`);
      refetch(); // list refresh
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Something went wrong",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div>
      {activeTab === "Returns" && (
        <>
          <div className=" space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
              {/* Return Request Form Heading */}
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Return Request Submission Form
              </h3>
              <ReturnForm refetch={refetch} />
            </div>

            {/* Return Requests Section */}
            <section className="space-y-4 bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Return Requests
              </h3>

              {returnRequests.length === 0 ? (
                <div className="text-sm text-gray-500 italic">
                  No return requests yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {returnRequests.map((req) => (
                    <div
                      key={req.id}
                      className="border border-gray-200 bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h1 className="font-semibold text-gray-800 text-lg">
                            Order ID: {req.order_id}
                          </h1>
                          <div className=" text-gray-800 mt-1">
                            Product Name: {req.product_name}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Reason: {req.reason || " No reason provided"}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition duration-150"
                          aria-label="Delete request"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex justify-start items-center pt-2 border-t border-gray-200 mt-3">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${getStatusClass(
                            req.status
                          )}`}
                        >
                          Status: {req.status}
                        </span>
                      </div>

                      {req.images && req.images.length > 0 && (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 flex-wrap">
                          {req.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={`${baseUrl}${img}`}
                              alt={`upload-${idx}`}
                              className="w-20 h-20 object-cover rounded-lg shadow-sm"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
