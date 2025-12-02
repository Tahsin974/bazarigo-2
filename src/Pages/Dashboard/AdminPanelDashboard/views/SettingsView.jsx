import { useState } from "react";
import AddBtn from "../../../../components/ui/AddBtn";
import SelectField from "../../../../components/ui/SelectField";

import Swal from "sweetalert2";
import { InputField } from "../../../../components/ui/InputField";
import { useForm } from "react-hook-form";
import { FileUploadField } from "../../../../components/ui/FileUploadField";
import { Camera, Store, Trash2, User, X } from "lucide-react";
import useBanners from "../../../../Utils/Hooks/useBanners";
import useAxiosPublic from "../../../../Utils/Hooks/useAxiosPublic";
import useAuth from "../../../../Utils/Hooks/useAuth";
import DatePicker from "react-datepicker";

function SettingsView({ setShowAddUserModal, admins, refetchAdmins }) {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [storeImg, setStoreImg] = useState(null);
  const [mainProductCategory, setMainProductCategory] = useState(
    user.product_category || ""
  );

  const [gender, setGender] = useState(user.gender || "");
  const [date, setDate] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const { banners, refetch } = useBanners();
  const baseUrl = import.meta.env.VITE_BASEURL;
  const categoryOptions = [
    { value: "All Categories", label: "All Categories" },
    { value: "Electronics", label: "Electronics" },
    { value: "Fashion", label: "Fashion" },
    { value: "Groceries", label: "Groceries" },
    { value: "Health & Beauty", label: "Health & Beauty" },
    { value: "Home & Living", label: "Home & Living" },
    { value: "Sports", label: "Sports" },
  ];

  const toggleActive = async (admin) => {
    try {
      const res = await axiosPublic.patch(`/admins/${admin.id}`, {
        is_active: !admin.is_active,
      });
      if (res.data.updatedCount > 0) {
        Swal.fire({
          icon: "success",
          title: `Admin Is ${!admin.is_active ? "Active" : "Inactive"} Now`,
          showConfirmButton: false,
          timer: 1500,
        });
        refetchAdmins();
      } else {
        Swal.fire({
          icon: "error",
          title: `Try Again!`,
          showConfirmButton: false,
          timer: 1500,
        });
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        image,
      };
      const res = await axiosPublic.post("/banner", payload);
      if (res.data.createdCount > 0) {
        Swal.fire({
          icon: "success",
          title: `Banner has added successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
        setImage(null);
        refetch();
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

  const handleDelete = async (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are You Sure?",
      showCancelButton: true, // confirm + cancel button
      confirmButtonColor: "#00C853",
      cancelButtonColor: "#f72c2c",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosPublic.delete(`/banner/${id}`);

        Swal.fire({
          icon: "success",
          title: "Deleted successfully",
          showConfirmButton: false,
          timer: 1200,
          toast: true,
          position: "top",
        });
        refetch();
      }
    });
  };

  const handleRemoveAdmins = async (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are You Sure?",
      showCancelButton: true, // confirm + cancel button
      confirmButtonColor: "#00C853",
      cancelButtonColor: "#f72c2c",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosPublic.delete(`/admins/${id}`);

        Swal.fire({
          icon: "success",
          title: "Deleted successfully",
          showConfirmButton: false,
          timer: 1200,
          toast: true,
          position: "top",
        });
        refetchAdmins();
      }
    });
  };
  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImg(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleStoreLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setStoreImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (type, updatedData) => {
    try {
      // পুরো ইউজার অবজেক্ট থেকে কপি
      const { new_password, old_password, ...safedata } = updatedData;
      let payload = {
        ...user, // আগের সব ডেটা রেখে দিচ্ছি
        ...safedata, // যেগুলো আপডেট হবে সেগুলো ওভাররাইট হবে

        date_of_birth: user.date_of_birth || date,
      };
      if (old_password && new_password) {
        payload = {
          ...user, // আগের সব ডেটা রেখে দিচ্ছি
          ...safedata, // যেগুলো আপডেট হবে সেগুলো ওভাররাইট হবে
          new_password,
          old_password,

          date_of_birth: user.date_of_birth || date,
        };
      }
      if (profileImg) {
        payload = {
          ...user, // আগের সব ডেটা রেখে দিচ্ছি
          ...safedata, // যেগুলো আপডেট হবে সেগুলো ওভাররাইট হবে
          img: profileImg,

          date_of_birth: user.date_of_birth || date,
        };
      }
      if (storeImg) {
        payload = {
          ...user, // আগের সব ডেটা রেখে দিচ্ছি
          ...safedata, // যেগুলো আপডেট হবে সেগুলো ওভাররাইট হবে
          storeImg: storeImg,

          date_of_birth: user.date_of_birth || date,
        };
      }
      console.log(payload);

      const res = await axiosPublic.put(`/admins/update/${user.id}`, payload);

      if (res.data.updatedCount > 0) {
        Swal.fire({
          icon: "success",
          title: `${type} updated successfully`,
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          position: "top",
        });
        refetchAdmins();
        return window.location.reload();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Something went wrong!",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        position: "top",
      });
    }
  };

  const handleUpdateStatus = async (e, id) => {
    const newRole = e.target.value;
    try {
      const res = await axiosPublic.patch(`/admins/role/${id}`, {
        role: newRole,
      });
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Role updated successfully",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          position: "top",
        });
        refetchAdmins();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Failed to update role",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        position: "top",
      });
    }
  };

  return (
    <div className="space-y-12 ">
      {/* Personal Information*/}

      <section className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <h3 className="font-semibold text-lg">Personal Information</h3>
        <div>
          <div className="flex justify-center mb-6">
            <div className="relative w-max">
              {/* মূল User আইকন */}
              <div className=" w-24 h-24 rounded-full bg-[#FFE5E5] text-[#FF0055] flex items-center justify-center overflow-hidden">
                {user?.profile_img || profileImg ? (
                  <img
                    src={
                      user?.profile_img
                        ? `${baseUrl}${user.profile_img}`
                        : profileImg
                    }
                    alt="product"
                    className="w-full h-full object-fill rounded-full"
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

          <input
            id="image-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleProfileImageUpload}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <InputField
            label="Full Name"
            placeholder="Full Name"
            id="full_name"
            defaultValue={user.full_name}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
          />

          <div className="flex flex-col">
            <label className="text-sm mb-1">Date Of Birth</label>
            <DatePicker
              selected={date || user.date_of_birth}
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
            <label className="block text-sm font-medium mb-1">Gender</label>
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

          <InputField
            label="Phone Number"
            placeholder="Phone Number"
            id="phone_number"
            defaultValue={user.phone_number}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
          />

          <InputField
            label="Address"
            placeholder="Address"
            id="address"
            defaultValue={user.address}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
          />

          <InputField
            label="District"
            placeholder="District"
            id="district"
            defaultValue={user.district}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
          />
          <InputField
            label="Thana"
            placeholder="Thana"
            id="thana"
            defaultValue={user.thana}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
          />
          <InputField
            label="Postal Code"
            placeholder="Postal Code"
            id="postal_code"
            type="number"
            defaultValue={user.postal_code}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault(); // keyboard up/down disable
              }
            }}
            onWheel={(e) => e.target.blur()}
          />
          <AddBtn
            btnHandler={() =>
              handleUpdate("Personal Information", {
                full_name: document.getElementById("full_name").value,
                phone_number: document.getElementById("phone_number").value,
                address: document.getElementById("address").value,
                district: document.getElementById("district").value,
                thana: document.getElementById("thana").value,
                postal_code: document.getElementById("postal_code").value,
                gender: gender === "" ? user.gender : gender,
              })
            }
          >
            Save
          </AddBtn>
        </div>
      </section>

      {/* Team Management */}
      <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800 tracking-wide">
            Team Management
          </h3>

          <AddBtn btnHandler={() => setShowAddUserModal(true)}>
            Add Member
          </AddBtn>
        </div>

        {/* Admin Users */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            Admins
          </h4>

          <ul className="space-y-3 text-sm">
            {admins.admins?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                admins not found
              </div>
            ) : admins.admins?.length === null ? (
              <div className="flex flex-col items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-xl"></span>
              </div>
            ) : (
              admins.admins
                ?.sort((a, b) => {
                  // ধরছি role ফিল্ডে super admin লেখা আছে
                  if (a.role === "super admin") return -1;
                  if (b.role === "super admin") return 1;
                  return 0;
                })
                .map((admin) => (
                  <li
                    key={admin.id}
                    className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm border border-gray-100"
                  >
                    <div cla>
                      <p className="font-medium text-gray-800">{admin.email}</p>
                      <span className="text-xs text-gray-500 capitalize">
                        Role: {admin.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md font-medium capitalize">
                        {admin.role}
                      </span>
                      {!(
                        user.role !== "super admin" &&
                        admin.role === "super admin"
                      ) && (
                        <select
                          value={admin.role}
                          onChange={(e) => handleUpdateStatus(e, admin.id)}
                          className="bg-white border border-gray-300 text-gray-900 hover:border-gray-400  rounded px-2 py-1 text-sm focus:ring-2 focus:ring-[#FF0055] focus:border-[#FF0055]"
                          disabled={
                            admin.role === "super admin" &&
                            user.role !== "super admin"
                          }
                        >
                          <option value="super admin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                        </select>
                      )}

                      {/* Delete Button Logic */}
                      {admin.role === "super admin" &&
                      user.role !== "super admin" ? (
                        <div className="relative inline-block group">
                          <button
                            disabled
                            className="px-3 py-2 rounded bg-gray-200 cursor-not-allowed"
                          >
                            <Trash2 size={20} />
                          </button>

                          <span
                            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 
    text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 
    transition whitespace-nowrap"
                          >
                            Not allowed
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => toggleActive(admin)}
                            className={`px-3 py-2 rounded ${
                              !admin.is_active
                                ? "bg-[#00C853] hover:bg-[#00B34A] text-white"
                                : "text-white bg-[#f72c2c] hover:bg-[#e92323]"
                            }`}
                          >
                            {!admin.is_active ? "Active" : "Inactive"}
                          </button>
                          <button
                            onClick={() => {
                              handleRemoveAdmins(admin.id);
                            }}
                            className=" bg-red-100 hover:bg-red-600 text-red-600 rounded  px-3 py-2  hover:text-white 
                          cursor-pointer"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))
            )}
          </ul>
        </div>

        {/* Moderator Users */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Moderators
          </h4>

          {admins.moderators == null ? (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="loading loading-spinner loading-xl"></span>
            </div>
          ) : admins.moderators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              moderators not found
            </div>
          ) : (
            <ul className="space-y-3 text-sm">
              {admins.moderators.map((moderator) => (
                <li
                  key={moderator.id}
                  className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm border border-gray-100"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {moderator.email}
                    </p>
                    <span className="text-xs text-gray-500 capitalize">
                      Role: {moderator.role}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-md font-medium capitalize">
                      {moderator.role}
                    </span>

                    {/* Updated Delete Button */}
                    <div className="flex gap-2 items-center">
                      {user.role === "admin" ||
                        (user.role === "super admin" && (
                          <>
                            <select
                              value={moderator.role}
                              onChange={(e) =>
                                handleUpdateStatus(e, moderator.id)
                              }
                              className="bg-white border border-gray-300 text-gray-900 hover:border-gray-400  rounded px-2 py-1 text-sm focus:ring-2 focus:ring-[#FF0055] focus:border-[#FF0055]"
                              disabled={
                                moderator.role === "super admin" &&
                                user.role !== "super admin"
                              }
                            >
                              <option value="admin">Admin</option>
                              <option value="moderator">Moderator</option>
                            </select>
                          </>
                        ))}
                      <button
                        onClick={() => toggleActive(moderator)}
                        className={`px-3 py-2 rounded ${
                          !moderator.is_active
                            ? "bg-[#00C853] hover:bg-[#00B34A] text-white"
                            : "text-white bg-[#f72c2c] hover:bg-[#e92323]"
                        }`}
                      >
                        {!moderator.is_active ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => {
                          handleRemoveAdmins(moderator.id);
                        }}
                        className=" bg-red-100 hover:bg-red-600 text-red-600 rounded  px-3 py-2  hover:text-white 
                          cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Account Information */}

      <section className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <h3 className="font-semibold text-lg">Account Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField
            label="Email"
            placeholder="Email"
            type="email"
            id="email"
            defaultValue={user.email}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
          />
          <InputField
            label="Old Password"
            placeholder="Old Password"
            type="password"
            defaultValue={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
          />
          <InputField
            label="New Password"
            placeholder="New Password"
            type="password"
            disabled={password.length === 0}
            defaultValue={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white disabled:bg-gray-100 m-0"
          />
          <InputField
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
            disabled={password.length === 0}
            defaultValue={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white disabled:bg-gray-100 m-0"
          />
        </div>
        <div className="flex flex-wrap gap-4 mt-2">
          <AddBtn
            btnHandler={() =>
              handleUpdate("Account Information", {
                email: document.getElementById("email").value,
              })
            }
          >
            Save
          </AddBtn>
          {newPassword?.length && confirmPassword === newPassword && (
            <AddBtn
              btnHandler={() =>
                handleUpdate("New Password Set ", {
                  old_password: password,
                  new_password: newPassword,
                })
              }
            >
              Set New Password
            </AddBtn>
          )}
        </div>
      </section>

      {/* Business Information */}

      {user.role === "super admin" && (
        <section className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          <h3 className="font-semibold text-lg">Business Information</h3>
          <div>
            <div className="flex justify-center mb-6">
              <div className="relative w-max">
                {/* মূল User আইকন */}
                <div className=" w-24 h-24 rounded-full bg-[#FFE5E5] text-[#FF0055] flex items-center justify-center overflow-hidden">
                  {user?.store_img || storeImg ? (
                    <img
                      src={
                        user?.store_img
                          ? `${baseUrl}${user.store_img}`
                          : storeImg
                      }
                      alt="store"
                      className="w-full h-full object-fill rounded-full"
                    />
                  ) : (
                    <Store size={32} />
                  )}
                </div>

                {/* ছোট পেন আইকন */}
                <div
                  onClick={() => {
                    document.getElementById("store-logo-upload").click();
                  }}
                  className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-300 cursor-pointer"
                >
                  <Camera size={12} className="text-[#FF0055]" />
                </div>
              </div>
            </div>
            <input
              id="store-logo-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleStoreLogoUpload}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <InputField
              label="Store Name"
              id={"store_name"}
              placeholder="Store Name"
              defaultValue={user.store_name}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Main Product Category
              </label>
              <SelectField
                selectValue={mainProductCategory}
                selectValueChange={(e) =>
                  setMainProductCategory(e.target.value)
                }
                isWide={true}
                required
              >
                <option value="" disabled>
                  Select
                </option>
                {categoryOptions.map((cat) => (
                  <option key={cat.value}>{cat.label}</option>
                ))}
              </SelectField>
            </div>
            <AddBtn
              btnHandler={() =>
                handleUpdate("Business Information", {
                  store_name: document.getElementById("store_name").value,
                  product_category:
                    mainProductCategory === ""
                      ? user.product_category
                      : mainProductCategory,
                })
              }
            >
              Save
            </AddBtn>
          </div>
        </section>
      )}

      {/*General Settings*/}
      {/* <section className="bg-white rounded-lg shadow-sm p-4 ">
        <h3 className="font-semibold text-lg">General Settings</h3>
        <div className="space-y-3 bg-white p-4 rounded shadow">
          <div>
            <label className="block text-sm font-medium">Currency</label>
            <SelectField
              selectValue={"USD"}
              selectValueChange={() => {}}
              isWide={true}
            >
              <option>USD</option>
              <option>BDT</option>
              <option>EUR</option>
            </SelectField>
          </div>
          <div>
            <label className="block text-sm font-medium">Theme</label>
            <SelectField
              selectValue={"Light"}
              selectValueChange={() => {}}
              isWide={true}
            >
              <option>Light</option>
              <option>Dark</option>
              <option>System Default</option>
            </SelectField>
          </div>
        </div>
      </section> */}

      {/* Security */}

      {/* <section className="bg-white rounded-lg shadow-sm p-4 ">
        <h3 className="font-semibold text-lg">Security</h3>
        <div className="bg-white p-4 rounded shadow space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-secondary checkbox-xs rounded-sm"
              defaultChecked
            />{" "}
            Two-Factor Authentication
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-secondary checkbox-xs rounded-sm"
            />{" "}
            Allow IP Whitelisting
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Policy
            </label>
            <SelectField
              selectValue={"Standard"}
              selectValueChange={() => {}}
              isWide={true}
            >
              <option>Standard</option>
              <option>Strong (8+ chars, special symbols)</option>
            </SelectField>
          </div>
        </div>
      </section> */}

      {/* Hero Section Settings*/}
      <section className="space-y-3 bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold text-lg">Hero Section Settings</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FileUploadField
            label="Banner"
            image={image}
            setImage={setImage}
            PRIMARY_COLOR={"#FF0055"}
          />
          <InputField
            {...register("link", { require: true })}
            className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
            label={"Link"}
            required
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault(); // keyboard up/down disable
              }
            }}
            onWheel={(e) => e.target.blur()}
            errors={errors.link}
            errorsMessage={errors.link?.message}
            type="url"
            placeholder="Enter Link"
          />

          <AddBtn
            type="submit"
            className="bg-[#FF0055] hover:bg-[#e6004e] text-white px-6 py-2 rounded-lg  transition"
          >
            Upload
          </AddBtn>
        </form>
        <div className="grid sm:grid-cols-2  gap-4 mt-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative rounded-lg overflow-hidden shadow h-40"
            >
              <img
                src={`${baseUrl}${banner.image}`}
                alt="banner"
                className="w-full h-full  object-fill"
              />

              <button
                onClick={() => handleDelete(banner.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SettingsView;
