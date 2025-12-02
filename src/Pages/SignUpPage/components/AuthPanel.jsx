import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { User, Eye, EyeOff, Camera } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import DatePicker from "react-datepicker";
import SelectField from "../../../components/ui/SelectField";
import { useNavigate } from "react-router";

import { InputField } from "../../../components/ui/InputField";
import { useLocation } from "react-router";

export default function AuthPanel({ type = "signup", onNavigate = () => {} }) {
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate();
  const location = useLocation();

  const baseUrl = import.meta.env.VITE_BASEURL;
  const [image, setImage] = useState(null);
  const [gender, setGender] = useState("");
  const [date, setDate] = useState(null);

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
    setLoading(true); // ✅ start loading
    try {
      if (isSignUp) {
        const payload = {
          name: data.first_Name + " " + data.last_Name,
          user_name: data.user_Name,
          email: data.email,
          phone: data.phone,
          img: image,
          password: data.password,
          date_of_birth: date,
          gender: gender,
          address: data.address,
          district: data.district,
          thana: data.thana,
          postal_code: data.postal_code,
          created_at: new Date().toLocaleString("en-CA", {
            timeZone: "Asia/Dhaka",
            hour12: false,
          }),
          updated_at: null,
        };
        const res = await axiosPublic.post("/register", payload);

        if (res.data.createdCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Sign Up Successfull",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
          reset();
          setImage(null);
          setDate(null);

          return onNavigate("login");
        }
      } else {
        // Login Step 1
        const payload = {
          email: data.email,
          password: data.password,
        };
        const res = await axiosPublic.post("/login", payload);

        if (res.data?.otp_required) {
          Swal.fire({
            icon: "info",
            title: "OTP sent to your email!",
            toast: true,
            position: "top",
            timer: 1500,
            showConfirmButton: false,
          });
          navigate("/verify-otp", {
            replace: true,
            state: {
              email: data.email,
              from: "login",
              pathName: location?.state?.pathName,
            },
          }); // show OTP input
          return;
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `${error.response?.data?.message}`,
        showConfirmButton: false,
        toast: true,
        position: "top",
        timer: 1500,
      });
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-3xl"
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
              <p className="text-center text-gray-500 mb-6">
                {isSignUp
                  ? "Join our community and enjoy exclusive deals."
                  : "Log in to access your account and continue shopping."}
              </p>
            </p>
            <form
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {isSignUp && (
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1">
                    <InputField
                      required
                      {...register("first_Name", {
                        required: "First name is required",
                        pattern: {
                          value: /^[A-Za-z]{2,20}$/,
                          message: "First name must be 2–20 letters only",
                        },
                      })}
                      label="First Name"
                      placeholder="First Name"
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                      errors={errors.first_Name}
                      errorsMessage={errors.first_Name?.message}
                    />
                  </div>

                  <div className="flex-1">
                    <InputField
                      required
                      {...register("last_Name", {
                        required: "Last name is required",
                        pattern: {
                          value: /^[A-Za-z]{2,20}$/,
                          message: "Last name must be 2–20 letters only",
                        },
                      })}
                      label="Last Name"
                      placeholder="Last Name"
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                      errors={errors.last_Name}
                      errorsMessage={errors.last_Name?.message}
                    />
                  </div>
                </div>
              )}

              <div>
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
              </div>

              {isSignUp && (
                <div className="flex-1">
                  <InputField
                    required
                    type="number"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^(?:\+?88)?01[3-9]\d{8}$/, // Bangladesh phone format
                        message: "Enter a valid Bangladeshi phone number",
                      },
                    })}
                    label="Phone Number"
                    placeholder="11-digit Phone Number"
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault(); // keyboard up/down disable
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                    errors={errors.phone}
                    errorsMessage={errors.phone?.message}
                  />
                </div>
              )}

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

              {isSignUp && (
                <>
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
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-1">
                      Date Of Birth
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <DatePicker
                      selected={date}
                      onChange={setDate}
                      dateFormat="dd/MM/yyyy"
                      yearDropdownItemNumber={40}
                      scrollableYearDropdown
                      showYearDropdown
                      showMonthDropdown
                      placeholderText={"Select Birth Date"}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Gender
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <SelectField
                      selectValue={gender}
                      selectValueChange={(e) => setGender(e.target.value)}
                      isWide={true}
                      required
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </SelectField>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="w-full">
                      <InputField
                        required
                        {...register("address", {
                          required: "Address is required",
                          pattern: {
                            value: /^[A-Za-z0-9\s,.'-]{5,100}$/,
                            message: "Enter a valid address (5–100 characters)",
                          },
                        })}
                        label="Address"
                        placeholder="Enter your address (e.g., House 12, Road 5, Banani)"
                        className={`w-full px-4 py-3 rounded-lg border  border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                        errors={errors.address}
                        errorsMessage={errors.address?.message}
                      />
                    </div>

                    <div className="flex-1">
                      <InputField
                        required
                        {...register("district", {
                          required: "District is required",
                          pattern: {
                            value: /^[A-Za-z\s]{2,50}$/,
                            message: "Enter a valid district name",
                          },
                        })}
                        label="District"
                        placeholder="Enter district name (e.g., Dhaka)"
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                        errors={errors.district}
                        errorsMessage={errors.district?.message}
                      />
                    </div>
                    <div className="flex-1">
                      <InputField
                        required
                        {...register("thana", {
                          required: "Thana is required",
                          pattern: {
                            value: /^[A-Za-z\s]{2,50}$/,
                            message: "Enter a valid thana name",
                          },
                        })}
                        label="Thana"
                        placeholder="Enter thana or upazila (e.g., Mirpur)"
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                        errors={errors.thana}
                        errorsMessage={errors.thana?.message}
                      />
                    </div>
                    <div className="flex-1">
                      <InputField
                        required
                        type="number"
                        {...register("postal_code", {
                          required: "Postal code is required",
                          pattern: {
                            value: /^\d{4,5}$/,
                            message: "Postal code must be 4–5 digits",
                          },
                        })}
                        label="Postal Code"
                        placeholder="Enter postal code (e.g., 1216)"
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
                        errors={errors.postal_code}
                        errorsMessage={errors.postal_code?.message}
                      />
                    </div>
                  </div>
                </>
              )}
              {!isSignUp && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => onNavigate("reset")}
                    className="text-sm text-[#FF0055] hover:underline disabled:opacity-50"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !isValid}
                className="w-full bg-[#FF0055] text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-[#e6004d] disabled:bg-gray-300 disabled:text-gray-500 transition-colors flex justify-center cursor-pointer gap-2"
              >
                {loading && (
                  <span className="loading loading-spinner loading-xs"></span>
                )}
                {isSignUp ? "Sign Up" : "Login"}
              </Button>
            </form>
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-3 text-gray-400 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <div className="space-y-3">
              <a
                href={`${baseUrl}/auth/google?state=${
                  location?.state?.pathName || "/"
                }`}
                role="button"
                className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition disabled:opacity-50"
              >
                <FcGoogle size={20} />
                <span className="text-gray-700 font-medium">
                  Continue with Google
                </span>
              </a>

              {/* <a
                role="button"
                onClick={() => console.log("Facebook login")}
                className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition disabled:opacity-50"
              >
                <FaFacebook size={20} className="text-[#1877F2]" />
                <span className="text-gray-700 font-medium">
                  Continue with Facebook
                </span>
              </a> */}
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
