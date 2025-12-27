import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { InputField } from "../../components/ui/InputField";
import { useForm } from "react-hook-form";

export default function PasswordResetPanel({ onNavigate = () => {} }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      //
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
                <Mail size={32} />
              </div>
            </div>

            <>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                Reset Password
              </h2>
              <p className="text-center text-gray-500 mb-6">
                Enter your email address and we’ll send you a link to reset your
                password.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                  required
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  label="Email Address"
                  placeholder="Email Address"
                  className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                  errors={errors.email}
                  errorsMessage={errors.email?.message}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  onClick={() => onNavigate("new-password")}
                  className="w-full bg-[#00C853] hover:bg-[#00B34A] text-white font-semibold py-3 rounded-lg shadow-lg  transition-colors flex justify-center"
                >
                  {loading ? "Processing..." : "Send Reset Link"}
                </Button>
              </form>
              <p className="mt-6 text-sm text-center text-gray-500">
                Remembered your password?{" "}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onNavigate("login")}
                  className="text-[#FF0055] font-medium hover:underline disabled:opacity-50"
                >
                  Back to Login
                </button>
              </p>
            </>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
