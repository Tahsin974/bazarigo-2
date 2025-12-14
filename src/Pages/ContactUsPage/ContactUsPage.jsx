import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import useAxiosPublic from "../../Utils/Hooks/useAxiosPublic";
import useAuth from "../../Utils/Hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function ContactUsPage() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name ? user.name : user?.full_name || "",
      email: user?.email || "",
      message: "",
    },
  });

  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      if (user && user.email) {
        const res = await axiosPublic.post("/api/contact", data);
        Swal.fire({
          icon: "success",
          title: res.data.message,
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 1500,
        });

        reset(); // ফর্ম রিসেট
      } else {
        Swal.fire({
          title: "You Are Not Logged In",
          text: "Please Login For Send Message",
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
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.error || "Something went wrong",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="min-h-screen  space-y-10">
      <header className="relative w-full py-20 flex items-center justify-center bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] overflow-hidden ">
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="sm:text-4xl text-2xl md:text-6xl font-extrabold text-white drop-shadow-md"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 sm:text-lg md:text-xl text-white drop-shadow-md"
          >
            Send us your questions or feedback, and our team will respond
            promptly to ensure you get the support you need.
          </motion.p>
        </div>
      </header>
      <main className="bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10  container  mx-auto">
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Contact Customer Support
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                  type="text"
                  placeholder="Your Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                  type="email"
                  placeholder="Your Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                  placeholder="Your Message"
                  rows={5}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] w-full px-3 py-2 inline-flex items-center gap-2   text-white  border-none  rounded shadow sm:text-base text-[14px] btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Info + Map */}
          <div className="space-y-6">
            <div className="bg-white p-6 space-y-2  rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Our Information</h2>
              <p>
                <strong>Email:</strong> bazarigo.official@gmail.com
              </p>
              <p>
                <strong>Phone:</strong> +880 1797-454-118
              </p>
              <p>
                <strong>Address:</strong> Plot #04, Road #02, Mirpur-1, Dhaka,
                Bangladesh
              </p>
            </div>

            <div className="rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.845625437685!2d90.3913!3d23.7509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b894cf0c6b6d%3A0xf1b8b1e3fdf3d9d7!2sDhaka!5e0!3m2!1sen!2sbd!4v1234567890"
                width="100%"
                height="250"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
