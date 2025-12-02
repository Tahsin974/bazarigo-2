import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../Utils/Hooks/useAuth";
import useAxiosPublic from "../../Utils/Hooks/useAxiosPublic";
import { User } from "lucide-react";
import { InputField } from "../../components/ui/InputField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function VerifyOtp() {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email;
  const pathName = location?.state?.pathName;

  const { refreshUser } = useAuth();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0); // 5 মিনিট
  const [resending, setResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);
  const fetchOtp = async () => {
    try {
      const res = await axiosPublic.get(`/otp?email=${email}`);
      const expiresAt = new Date(res.data.expires_at).getTime(); // milliseconds
      const now = Date.now(); // milliseconds
      const secondsLeft = Math.floor((expiresAt - now) / 1000);
      setTimeLeft(secondsLeft > 0 ? secondsLeft : 0);
    } catch (err) {
      console.error(err);
    }
  };
  // Fetch OTP expiration
  useEffect(() => {
    fetchOtp();
  }, [email]);

  const handleVerifyOtp = async () => {
    try {
      const res = await axiosPublic.post("/verify-otp", { email, otp });
      if (res.data?.login) {
        await refreshUser();
        navigate(pathName || "/", { replace: true });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "OTP verification failed",
        toast: true,
        showConfirmButton: false,
        position: "top",
        timer: 1500,
      });
      setOtp("");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleResendOtp = async () => {
    try {
      setResending(true);

      await axiosPublic.post("/resend-otp", { email });

      fetchOtp(); // update timer with new OTP expiration
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Failed to resend OTP",
        toast: true,
        showConfirmButton: false,
        position: "top",
        timer: 1500,
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-2xl overflow-hidden">
          <CardContent className="p-8 bg-white">
            <div className="flex justify-center mb-6">
              <div className="relative w-max">
                <div className="w-24 h-24 rounded-full bg-[#FFE5E5] text-[#FF0055] flex items-center justify-center overflow-hidden">
                  <User size={32} />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Verify OTP
            </h2>
            <p className="text-center text-gray-500 mb-4">
              Enter the OTP sent to your email to complete login.
            </p>
            <p className="text-center text-red-500 font-medium mb-6">
              {timeLeft > 0
                ? `OTP expires in ${formatTime(timeLeft)}`
                : "OTP expired"}
            </p>
            <div className="space-y-4">
              <InputField
                required
                type="text"
                value={otp}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055] text-center tracking-widest text-lg"
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                label="OTP"
              />
              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={timeLeft <= 0}
                className={`w-full font-semibold py-3 rounded-lg shadow-lg flex justify-center cursor-pointer transition-colors ${
                  timeLeft > 0
                    ? "bg-[#FF0055] hover:bg-[#e6004d] text-white"
                    : "bg-gray-400 cursor-not-allowed text-gray-200"
                }`}
              >
                Verify OTP
              </Button>
              <div className="flex justify-center">
                <Button
                  onClick={handleResendOtp}
                  disabled={timeLeft > 0 || resending}
                  className="text-gray-700 disabled:text-gray-400"
                >
                  {resending ? "Resending..." : "Resend OTP"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}

// import { useState } from "react";
// import { useNavigate } from "react-router";
// import Swal from "sweetalert2";
// import useAuth from "../../Utils/Hooks/useAuth";
// import useAxiosPublic from "../../Utils/Hooks/useAxiosPublic";
// import { useLocation } from "react-router";
// import { User } from "lucide-react";
// import { InputField } from "../../components/ui/InputField";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { motion } from "framer-motion";

// export default function VerifyOtp() {
//   const axiosPublic = useAxiosPublic();

//   const navigate = useNavigate();
//   const { refreshUser } = useAuth();
//   const [otp, setOtp] = useState("");
//   const location = useLocation();
//   const handleVerifyOtp = async () => {
//     try {
//       const email = location?.state && location.state.email;
//       const res = await axiosPublic.post("/verify-otp", { email, otp });
//       if (res.data?.login) {
//         await refreshUser();
//         if (res.data.role === "customer") navigate("/dashboard");
//         else if (res.data.role === "seller") navigate("/dashboard/seller");
//         else navigate("/dashboard/admin");
//       }
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: err.response?.data?.message || "OTP verification failed",
//         toast: true,
//         showConfirmButton: false,
//         position: "top",
//         timer: 1500,
//       });
//     }
//   };
//   return (
//     <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] p-6">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.45 }}
//         className="w-full max-w-3xl"
//       >
//         <Card className="rounded-2xl shadow-2xl overflow-hidden">
//           <CardContent className="p-8 bg-white">
//             <div>
//               <div className="flex justify-center mb-6">
//                 <div className="relative w-max">
//                   {/* মূল User আইকন */}
//                   <div className=" w-24 h-24 rounded-full bg-[#FFE5E5] text-[#FF0055] flex items-center justify-center overflow-hidden">
//                     <User size={32} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
//               Verify OTP
//             </h2>

//             <p className="text-center text-gray-500 mb-6">
//               Enter the OTP sent to your email to complete login.
//             </p>
//             <div className="space-y-4">
//               <div>
//                 <InputField
//                   required
//                   type="text"
//                   value={otp}
//                   className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
//                   onChange={(e) => setOtp(e.target.value)}
//                   placeholder="Enter OTP"
//                   label="OTP"
//                 />
//               </div>

//               <Button
//                 type="button"
//                 onClick={handleVerifyOtp}
//                 className="w-full bg-[#FF0055] text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-[#e6004d] transition-colors flex justify-center cursor-pointer"
//               >
//                 Verify OTP
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </section>
//   );
// }
