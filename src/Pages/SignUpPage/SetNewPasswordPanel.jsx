import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Lock, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { InputField } from "../../components/ui/InputField";
import { useNavigate, useSearchParams } from "react-router";
import useAxiosPublic from "../../Utils/Hooks/useAxiosPublic";

export default function SetNewPasswordPanel({ onNavigate = () => {} }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const { password } = data;

    setLoading(true);
    try {
      const res = await axiosPublic.post(`/reset-password/${token}`, {
        password: password,
      });
      if (res.data.updatedCount > 0) {
        navigate("/sign-up");
      }
      reset();
      setSuccess(true);
    } finally {
      setLoading(false);
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
              <div className="p-4 rounded-full bg-[#FFE5E5] text-[#FF0055]">
                <Lock size={32} />
              </div>
            </div>
            {!success ? (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                  Set New Password
                </h2>
                <p className="text-center text-gray-500 mb-6">
                  Enter your new password below to reset your account.
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <InputField
                      required
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                        pattern: {
                          value:
                            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{8,}$/,
                          message:
                            "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character",
                        },
                      })}
                      label="Password"
                      placeholder="Password"
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                      errors={errors.password}
                      errorsMessage={errors.password?.message}
                    />
                  </div>

                  <div>
                    <InputField
                      required
                      type="password"
                      {...register("confirm_Password", {
                        required: "Confirm Password is required",
                        validate: (value, allValues) =>
                          value === allValues.password ||
                          "Passwords do not match",
                      })}
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                      errors={errors.confirm_Password}
                      errorsMessage={errors.confirm_Password?.message}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !isValid}
                    className="w-full bg-[#00C853] hover:bg-[#00B34A] text-white font-semibold py-3 rounded-lg shadow-lg  transition-colors flex justify-center disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    {loading ? "Processing..." : "Reset Password"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-green-100 text-green-600">
                    <CheckCircle size={40} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Password Reset Successful
                </h2>
                <p className="text-gray-500 mb-6">
                  Your password has been updated. You can now log in with your
                  new credentials.
                </p>
                <Button
                  type="button"
                  disabled={loading || !isValid}
                  onClick={() => onNavigate("login")}
                  className="w-full bg-[#FF0055] text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-[#e6004d] transition-colors disabled:bg-gray-300 disabled:text-gray-500 "
                >
                  Back to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
