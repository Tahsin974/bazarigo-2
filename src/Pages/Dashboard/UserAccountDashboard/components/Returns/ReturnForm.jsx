import React, { useRef, useState } from "react";
import UploadImages from "../../../../../components/ui/UploadImages";
import { Pause, Play, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { InputField } from "../../../../../components/ui/InputField";
import useAuth from "../../../../../Utils/Hooks/useAuth";
import useAxiosPublic from "../../../../../Utils/Hooks/useAxiosPublic";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../../Utils/Hooks/useAxiosSecure";

export default function ReturnForm({ refetch }) {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/${user.email}`);
      return res.data.orders;
    },
  });

  const [images, setImages] = useState([]);
  const videoRef = useRef();
  const [isPaused, setIsPaused] = useState(true);
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const maxSizeImage = 2 * 1024 * 1024; // 1MB
    const validFiles = [];
    let hasInvalid = false;

    files.forEach((file) => {
      if (file.type.startsWith("image") && file.size > maxSizeImage) {
        hasInvalid = true;
      } else if (
        file.type.startsWith("image") ||
        file.type.startsWith("video")
      ) {
        validFiles.push(file);
      }
    });

    if (hasInvalid) {
      Swal.fire({
        icon: "error",
        title: "File too large!",
        text: "Each image must be less than 1MB.",
        confirmButtonColor: "#FF0055",
      });
    }

    if (validFiles.length === 0) return;
    setImages((prev) => [...prev, ...files]); // সরাসরি File object রাখুন
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: (formData) =>
      axiosPublic.post(`/return-requests`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Return Request submitted successfully",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
      setImages([]);
      refetch();
      queryClient.invalidateQueries(["returnRequests"]);
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.response?.data?.message || "Something went wrong",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // সাধারণ ফিল্ডগুলো append করা
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      // ফাইলগুলো append করা
      images.forEach((file) => {
        formData.append("images", file); // ব্যাকএন্ডে Multer অনুযায়ী field name
      });

      formData.append("customer_id", user.id);

      mutation.mutate(formData);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to submit return request",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <InputField
        {...register("orderId", { require: true })}
        className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
        label={"Order Id"}
        type="text"
        required
        errors={errors.orderId}
        errorsMessage={errors.orderId?.message}
        placeholder="Enter Order Id"
      />
      <InputField
        {...register("product_name", { require: true })}
        className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
        label={"Product Name"}
        type="text"
        required
        placeholder="Enter Product Name"
      />
      <InputField
        {...register("customer_name", { require: true })}
        className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
        label={"Full Name"}
        defaultValue={user.name}
        type="text"
        required
        errors={errors.customer_name}
        errorsMessage={errors.customer_name?.message}
        placeholder="Enter Full Name"
      />
      <InputField
        {...register("customer_email", { require: true })}
        className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
        label={"Email"}
        defaultValue={user.email}
        type="email"
        required
        errors={errors.customer_email}
        errorsMessage={errors.customer_email?.message}
        placeholder="Enter Email"
      />
      <InputField
        {...register("customer_phone", { require: true })}
        className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
        label={"Phone Number"}
        defaultValue={user.phone}
        type="tel"
        required
        errors={errors.customer_phone}
        errorsMessage={errors.customer_phone?.message}
        placeholder="Enter Phone Number"
      />

      <textarea
        {...register("reason", { require: true })}
        placeholder="Reason for return"
        className="w-full border px-3 py-2 rounded-md focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none"
      />

      <div>
        <UploadImages video={true} handleImageUpload={handleImageUpload}>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(images || []).map((file, i) => {
              const isVideo = file.type.startsWith("video");
              const mediaURL = URL.createObjectURL(file); // File থেকে preview

              return (
                <div
                  key={i}
                  className="w-full h-24 rounded overflow-hidden relative flex justify-center items-center bg-gray-100"
                >
                  {!isVideo && (
                    <img
                      src={mediaURL}
                      alt={`media-${i}`}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {isVideo && (
                    <>
                      <video
                        ref={videoRef}
                        src={mediaURL}
                        className="w-full h-full object-cover"
                        onEnded={() => setIsPaused(true)}
                      />

                      <button
                        onClick={() => {
                          if (videoRef.current.paused) {
                            videoRef.current.play();
                            setIsPaused(false);
                          } else {
                            videoRef.current.pause();
                            setIsPaused(true);
                          }
                        }}
                        className="absolute bottom-2 left-2 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-md transition duration-200 ease-in-out "
                      >
                        {isPaused ? <Play size={16} /> : <Pause size={16} />}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </UploadImages>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={mutation.isLoading || !orders.length}
          className="px-4 py-2 bg-[#00C853] hover:bg-[#00B34A] text-white rounded-md disabled:bg-gray-300 disabled:text-gray-500 transition-colors "
        >
          {mutation.isLoading ? "Submitting..." : "Submit Return Request"}
        </button>
      </div>
    </form>
  );
}
