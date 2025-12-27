import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../../Utils/Hooks/useAuth";
import Reply from "./Reply";
import { InputField } from "../../../components/ui/InputField";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useNavigate } from "react-router";

export default function AskQuestion({
  productId,
  refetch,
  questions,
  productName,
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
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name:
        user?.role === "admin" || user?.role === "super admin"
          ? ""
          : user?.name
          ? user.name
          : user?.full_name,
      question: "",
    },
  });
  const axiosPublic = useAxiosPublic();

  const mutation = useMutation({
    mutationFn: (newReview) =>
      axiosPublic.put(`/products/add-question/${productId}`, newReview),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Question submitted successfully",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();

      refetch();
      queryClient.invalidateQueries(["questions"]);
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

  const answerMutation = useMutation({
    mutationFn: ({ q_id, answer, replyDate }) =>
      axiosPublic.put(`/products/reply-question/${productId}`, {
        q_id,
        answer,
        replyDate,
      }),

    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Answer submitted successfully",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });

      refetch();
      queryClient.invalidateQueries(["questions"]);
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.response?.data?.message || "Failed to submit answer",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const submitHandler = async (data) => {
    if (!user) {
      Swal.fire({
        title: "You Are Not Logged In",
        text: "Please Login For Ask Question About This Product",
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

    const newQuestion = {
      id: Date.now(),
      name: data.name,
      customerId: user.id,
      customerRole: user.role,
      productName: productName,
      question: data.question,
      date: new Date().toLocaleString("en-CA", {
        timeZone: "Asia/Dhaka",
        hour12: false,
      }),
      answer: "",
      replyDate: null,
      answeredByAdmin: false,
      answeredBySeller: false,
    };

    mutation.mutate(newQuestion);
  };

  const handleAnswer = (id, answer, replyDate) => {
    answerMutation.mutate({ q_id: id, answer, replyDate });
  };

  return (
    <div className="container mx-auto xl:px-6 lg:px-6  px-4 md:py-10 py-6 border-t border-gray-300">
      <h3 className="text-xl font-bold mb-6">Ask a Question</h3>

      {/* Question Form */}
      {user?.role === "seller" ? (
        user?.id !== sellerId && (
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col gap-4 mb-8"
          >
            {user?.role === "admin" ||
              (user?.role === "super admin" && (
                <InputField
                  type="text"
                  placeholder="Your Name"
                  {...register("name")}
                  className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055] transition-all duration-300 focus:shadow-lg"
                />
              ))}
            <textarea
              placeholder="Ask your question..."
              {...register("question")}
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm resize-none h-28"
            />
            <div className="flex">
              <button
                type="submit"
                className="bg-[#00C853] hover:bg-[#00B34A] text-white px-6 py-3 rounded-lg shadow "
              >
                Submit Question
              </button>
            </div>
          </form>
        )
      ) : (
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col gap-4 mb-8"
        >
          {user?.role === "admin" ||
            (user?.role === "super admin" && (
              <InputField
                type="text"
                placeholder="Your Name"
                {...register("name")}
                className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055] transition-all duration-300 focus:shadow-lg"
              />
            ))}
          <textarea
            placeholder="Ask your question..."
            {...register("question")}
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm resize-none h-28"
          />
          <div className="flex">
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="bg-[#00C853] hover:bg-[#00B34A] text-white px-6 py-3 rounded-lg shadow disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
            >
              {mutation.isLoading ? "Submitting..." : "Submit Question"}
            </button>
          </div>
        </form>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.length === 0 && (
          <p className="text-gray-500 text-center py-6">
            No questions yet. Be the first to ask!
          </p>
        )}

        {questions
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((q) => (
            <div
              key={q.id}
              className="p-5 border border-gray-200 rounded-xl bg-white shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-lg text-gray-800">
                  {q.name}
                </span>

                <p className="text-sm text-gray-400">
                  {moment(q.date).fromNow()}
                </p>
              </div>

              <p className="text-gray-700 mb-3 ">{q.question}</p>

              {/* Answer */}
              {q.answeredByAdmin || q.answeredBySeller ? (
                <div className="bg-green-50 p-4 rounded-2xl border border-green-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded-full capitalize">
                      {q.answeredBySeller ? "Seller" : "Admin"} Response
                    </span>
                    <span className="text-gray-600 text-sm">
                      {moment(q.replyDate).fromNow()}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed ml-3">
                    {q.answer}
                  </p>
                </div>
              ) : (
                (user?.role === "admin" ||
                  user?.role === "super admin" ||
                  user?.id === sellerId) && (
                  <Reply questionId={q.id} onAnswer={handleAnswer} />
                )
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
