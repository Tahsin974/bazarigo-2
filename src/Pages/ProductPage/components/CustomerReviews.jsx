import { useRef, useState } from "react";
import { InputField } from "../../../components/ui/InputField";
import { Plus, Star, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Rating from "react-rating";
import moment from "moment/moment";
import useAuth from "../../../Utils/Hooks/useAuth";
import { RatingStars } from "../../../components/ui/RatingStars";
import { useNavigate } from "react-router";

// CustomerReviews.jsx content will be placed here
export default function CustomerReviews({
  reviews = [],
  productId,
  refetch,
  sellerId,
}) {
  const navigate = useNavigate();
  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "few seconds",
      ss: "%d seconds",
      m: "1 minute",
      mm: "%d minutes",
      h: "1 hour",
      hh: "%d hours",
      d: "1 day",
      dd: "%d days",
      M: "1 month",
      MM: "%d months",
      y: "1 year",
      yy: "%d years",
    },
  });
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const [displayCount, setDisplayCount] = useState(5);
  const baseUrl = import.meta.env.VITE_BASEURL;
  const [selectedImages, setSelectedImages] = useState({});

  // Click handler
  const handleClick = (reviewIndex, img) => {
    setSelectedImages((prev) => ({
      ...prev,
      [reviewIndex]: prev[reviewIndex] === img ? null : img,
    }));
  };

  const { user } = useAuth();

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      name:
        user?.role === "admin" || user?.role === "super admin"
          ? ""
          : user?.name,
      comment: "",
      rating: 0,
      images: [],
    },
  });

  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const mutation = useMutation({
    mutationFn: (newReview) =>
      axiosPublic.put(`/products/${productId}/reviews`, newReview, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Review submitted successfully",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
      setImages([]);
      refetch();
      queryClient.invalidateQueries(["reviews"]);
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

  const onSubmit = (data) => {
    if (user && user.email) {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("comment", data.comment);
      formData.append("rating", data.rating);
      formData.append("date", new Date().toString());

      images.forEach((img) => {
        formData.append("images", img); // Multer expects the field name
      });

      mutation.mutate(formData);
    } else {
      Swal.fire({
        title: "You Are Not Logged In",
        text: "Please Login For Add Product To The Wishlist",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00C853",
        cancelButtonColor: "#f72c2c",
        confirmButtonText: "Yes, Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/sign-up", { state: { pathName: location.pathname } });
        }
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 5); // প্রতি বার ৫টি review আরও দেখাবে
  };

  return (
    <section className="container mx-auto xl:px-6 lg:px-6  px-4 md:py-10 py-6 border-t border-gray-300">
      <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
      {user?.role === "seller" ? (
        user?.id !== sellerId && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-8 xl:p-6 lg:p-6 p-6 bg-gray-50 rounded-lg space-y-4 shadow-md"
          >
            {user?.role === "admin" ||
              (user?.role === "super admin" && (
                <InputField
                  type="text"
                  label="Your Name"
                  placeholder="Your Name"
                  {...register("name")}
                  className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055] transition-all duration-300 focus:shadow-lg"
                />
              ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <div className="w-full p-2 flex items-center rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-[#FF0055] focus-within:shadow-lg transition duration-300 h-20">
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 ml-1 rounded-full text-gray-500 bg-gray-100 hover:bg-gray-200 active:bg-gray-200 transition duration-150"
                  aria-label="Add or New"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Plus className="w-5 h-5" />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  multiple
                  className="hidden"
                />

                <input
                  type="text"
                  placeholder="Write your review..."
                  {...register("comment")}
                  className="search-input flex-1 px-4 text-gray-800 bg-transparent border-none focus:ring-0 focus:outline-none h-full"
                />
              </div>

              {images.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-auto h-20 rounded overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${i}`}
                        className="w-full h-full object-fill rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 text-gray-500 rounded-full flex items-center justify-center transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Your Rating:</span>
              <Controller
                control={control}
                name="rating"
                render={({ field }) => (
                  <RatingStars rating={field.value} onRate={field.onChange} />
                )}
              />
            </div>

            <button
              type="submit"
              className="bg-[#00C853] hover:bg-[#00B34A] text-white px-6 py-3 rounded-lg shadow "
            >
              Submit Review
            </button>
          </form>
        )
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-8 xl:p-6 lg:p-6 p-6 bg-gray-50 rounded-lg space-y-4 shadow-md"
        >
          {user?.role === "admin" ||
            (user?.role === "super admin" && (
              <InputField
                type="text"
                label="Your Name"
                placeholder="Your Name"
                {...register("name")}
                className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055] transition-all duration-300 focus:shadow-lg"
              />
            ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment
            </label>
            <div className="w-full p-2 flex items-center rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-[#FF0055] focus-within:shadow-lg transition duration-300 h-20">
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 ml-1 rounded-full text-gray-500 bg-gray-100 hover:bg-gray-200 active:bg-gray-200 transition duration-150"
                aria-label="Add or New"
                onClick={() => fileInputRef.current.click()}
              >
                <Plus className="w-5 h-5" />
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                className="hidden"
              />

              <input
                type="text"
                placeholder="Write your review..."
                {...register("comment")}
                className="search-input flex-1 px-4 text-gray-800 bg-transparent border-none focus:ring-0 focus:outline-none h-full"
              />
            </div>

            {images.length > 0 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-auto h-20 rounded overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${i}`}
                      className="w-full h-full object-fill rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 text-gray-500 rounded-full flex items-center justify-center transition"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Your Rating:</span>
            <Controller
              control={control}
              name="rating"
              render={({ field }) => (
                <RatingStars rating={field.value} onRate={field.onChange} />
              )}
            />
          </div>

          <button
            type="submit"
            className="bg-[#00C853] hover:bg-[#00B34A] text-white px-6 py-3 rounded-lg shadow "
          >
            Submit Review
          </button>
        </form>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.slice(0, displayCount).map((review, i) => (
            <div key={i} className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col-reverse">
                  <span className="font-semibold text-lg">{review.name}</span>
                  <Rating
                    emptySymbol={<Star size={18} className=" text-gray-300" />}
                    fullSymbol={
                      <Star
                        size={18}
                        className="text-[#FFD700] fill-[#FFD700]"
                      />
                    }
                    initialRating={review.rating}
                    readonly
                  />
                </div>

                {review.date && (
                  <span className="text-sm text-gray-500">
                    {moment(review.date).fromNow()}
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-sm mb-1">{review.comment}</p>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {review.images.map((img, j) => (
                    <div
                      key={j}
                      className="w-24 h-24 rounded overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => handleClick(i, `${baseUrl}${img}`)}
                    >
                      <img
                        src={`${baseUrl}${img}`}
                        alt={`Review ${i} image ${j}`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
              {/* Bigger Image Below */}
              {selectedImages[i] && (
                <div className="mt-2 flex justify-start items-center gap-4 transition-all duration-300">
                  <img
                    src={selectedImages[i]}
                    alt="Selected review"
                    className="w-64 h-64 object-contain rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-center">
            {displayCount < reviews.length && (
              <button
                onClick={handleLoadMore}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white rounded "
              >
                Load More
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      )}
    </section>
  );
}
