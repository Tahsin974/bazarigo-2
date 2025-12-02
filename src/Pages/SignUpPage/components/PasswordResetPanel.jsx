import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function PasswordResetPanel({ onNavigate = () => {} }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value) => {
    if (!value) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Enter a valid email.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 900));
      setSubmitted(true);
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
            {!submitted ? (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                  Reset Password
                </h2>
                <p className="text-center text-gray-500 mb-6">
                  Enter your email address and we’ll send you a link to reset
                  your password.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="Email Address"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        error ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                    />
                    {error && (
                      <p className="mt-1 text-xs text-red-500">{error}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    onClick={() => onNavigate("new-password")}
                    className="w-full bg-[#FF0055] text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-[#e6004d] transition-colors flex justify-center"
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
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-500 mb-6">
                  If an account with <strong>{email}</strong> exists, a password
                  reset link has been sent.
                </p>
                <Button
                  type="button"
                  onClick={() => onNavigate("login")}
                  className="w-full bg-[#FF0055] text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-[#e6004d] transition-colors"
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
