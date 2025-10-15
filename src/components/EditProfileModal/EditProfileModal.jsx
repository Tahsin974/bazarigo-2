import { Upload, X } from "lucide-react";

export default function EditProfileModal({
  user,
  setUser,
  showEditProfile,
  setShowEditProfile,
  handleProfileSave,
  handleAvatarChange,
}) {
  return (
    <div>
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-lg ">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-500"
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleProfileSave} className="space-y-3">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-100 px-3 py-2 rounded">
                    <Upload size={16} /> Change photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <label className="block">
                Name
                <input
                  value={user.name}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded-md mt-1"
                />
              </label>
              <label className="block">
                Email
                <input
                  value={user.email}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded-md mt-1"
                />
              </label>
              <label className="block">
                Phone
                <input
                  value={user.phone}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded-md mt-1"
                />
              </label>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00C853] hover:bg-[#00B34A] text-white rounded-md"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-4 py-2 text-white rounded-md bg-[#f72c2c] hover:bg-[#e92323]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
