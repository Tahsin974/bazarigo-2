import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { User, Eye, EyeOff, Camera } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export default function AuthPanel({ type = "signup", onNavigate = () => {} }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const isSignUp = type === "signup";

  const onSubmit = async (data) => {
    try {
      if (isSignUp) {
        const payload = {
          name: data.first_Name + " " + data.last_Name,
          user_name: data.user_Name,
          email: data.email,
          phone: data.phone,
          img: image,
          password: data.password,
          address: data.address,
          district: data.district,
          thana: data.thana,
          postal_code: data.postal_code,
          created_at: new Date().toISOString(),
          updated_at: null,
        };
        const res = await axios.post("http://localhost:3000/users", payload);
        if (res.data.createdCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Customer Create Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          reset();
          setImage(null);
        } else {
          Swal.fire({
            icon: "error",
            title: "Opps! Try Again",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        const payload = {
          email: data.email,
          password: data.password,
        };
        console.log("login payload:", payload);
        await new Promise((res) => setTimeout(res, 900));
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `${error.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
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
            <div>
              {!isSignUp ? (
                <div className="flex justify-center mb-6">
                  <div className="relative w-max">
                    {/* মূল User আইকন */}
                    <div className=" w-24 h-24 rounded-full bg-[#FFE5E5] text-[#FF0055] flex items-center justify-center overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt="product"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User size={32} />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center mb-6">
                  <div className="relative w-max">
                    {/* মূল User আইকন */}
                    <div className=" w-24 h-24 rounded-full bg-[#FFE5E5] text-[#FF0055] flex items-center justify-center overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt="product"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User size={32} />
                      )}
                    </div>

                    {/* ছোট পেন আইকন */}
                    <div
                      onClick={() => {
                        document.getElementById("image-upload").click();
                      }}
                      className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-300 cursor-pointer"
                    >
                      <Camera size={12} className="text-[#FF0055]" />
                    </div>
                  </div>
                </div>
              )}
              <input
                id="image-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              {isSignUp ? "Create Your Account" : "Welcome Back"}
            </h2>
            <p className="text-center text-gray-500 mb-6">
              {isSignUp
                ? "Join our community and enjoy exclusive deals."
                : "Log in to access your account and continue shopping."}
            </p>
            <form
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {isSignUp && (
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1">
                    <input
                      {...register("first_Name", {
                        required: "First name is required",
                        pattern: {
                          value: /^[A-Za-z]{2,20}$/,
                          message: "First name must be 2–20 letters only",
                        },
                      })}
                      placeholder="First Name"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.first_Name ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                    />
                    {errors.first_Name && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.first_Name.message}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      {...register("last_Name", {
                        required: "Last name is required",
                        pattern: {
                          value: /^[A-Za-z]{2,20}$/,
                          message: "Last name must be 2–20 letters only",
                        },
                      })}
                      placeholder="Last Name"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.last_Name ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                    />
                    {errors.last_Name && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.last_Name.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <input
                      {...register("user_Name", {
                        required: "Username is required",
                        pattern: {
                          value: /^[a-zA-Z0-9_]{3,20}$/,
                          message:
                            "Username must be 3–20 characters (letters, numbers, or underscores)",
                        },
                      })}
                      placeholder="Username"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.user_Name ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                    />
                    {errors.user_Name && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.user_Name.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  placeholder="Email Address"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              {isSignUp && (
                <div className="flex-1">
                  <input
                    type="number"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^(?:\+?88)?01[3-9]\d{8}$/, // Bangladesh phone format
                        message: "Enter a valid Bangladeshi phone number",
                      },
                    })}
                    placeholder="Phone Number"
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault(); // keyboard up/down disable
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
                        message:
                          "Must be at least 8 chars, include one uppercase, one number, and one special character",
                      },
                    })}
                    placeholder="Password"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {isSignUp && (
                <>
                  <div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirm_Password", {
                          required: "Confirm Password is required",
                          validate: (value, allValues) =>
                            value === allValues.password ||
                            "Passwords do not match",
                        })}
                        placeholder="Confirm Password"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.confirm_Password
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((s) => !s)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.confirm_Password && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.confirm_Password.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="w-full">
                      <input
                        {...register("address", {
                          required: "Address is required",
                          pattern: {
                            value: /^[A-Za-z0-9\s,.'-]{5,100}$/,
                            message: "Enter a valid address (5–100 characters)",
                          },
                        })}
                        placeholder="Address"
                        className={`w-full px-4 py-3 rounded-lg border  ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                      />
                      {errors.address && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <input
                        {...register("district", {
                          required: "District is required",
                          pattern: {
                            value: /^[A-Za-z\s]{2,50}$/,
                            message: "Enter a valid district name",
                          },
                        })}
                        placeholder="District"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.district ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                      />
                      {errors.district && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.district.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        {...register("thana", {
                          required: "Thana is required",
                          pattern: {
                            value: /^[A-Za-z\s]{2,50}$/,
                            message: "Enter a valid thana name",
                          },
                        })}
                        placeholder="Thana"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.thana ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                      />
                      {errors.thana && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.thana.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        {...register("postal_code", {
                          required: "Postal code is required",
                          pattern: {
                            value: /^\d{4,5}$/,
                            message: "Postal code must be 4–5 digits",
                          },
                        })}
                        placeholder="Postal Code"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.postal_code
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                      />
                      {errors.postal_code && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.postal_code.message}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {isSignUp ? (
                !isValid ? (
                  <Button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-semibold py-3 rounded-lg shadow-none hover:bg-gray-300 transition-colors flex justify-center"
                  >
                    Sign Up
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-[#FF0055] text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-[#e6004d] transition-colors flex justify-center cursor-pointer"
                  >
                    Sign Up
                  </Button>
                )
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-[#FF0055] text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-[#e6004d] transition-colors flex justify-center cursor-pointer"
                >
                  Login
                </Button>
              )}
            </form>
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-3 text-gray-400 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => console.log("Google login")}
                className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition disabled:opacity-50"
              >
                <FcGoogle size={20} />
                <span className="text-gray-700 font-medium">
                  Continue with Google
                </span>
              </button>
              <button
                type="button"
                onClick={() => console.log("Facebook login")}
                className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition disabled:opacity-50"
              >
                <FaFacebook size={20} className="text-[#1877F2]" />
                <span className="text-gray-700 font-medium">
                  Continue with Facebook
                </span>
              </button>
            </div>
            <p className="mt-6 text-sm text-center text-gray-500">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => onNavigate("login")}
                    className="text-[#FF0055] font-medium hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    Log In
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => onNavigate("signup")}
                    className="text-[#FF0055] font-medium hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
