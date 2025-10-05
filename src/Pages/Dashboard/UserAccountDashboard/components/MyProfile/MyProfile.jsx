export default function MyProfile({ user, activeTab, setShowEditProfile }) {
  return (
    <div>
      {activeTab === "account" && (
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto">
          <div className="flex flex-col items-center text-center">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-28 h-28 rounded-full mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">Phone: {user.phone}</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setShowEditProfile(true)}
                className="px-4 py-2 bg-[#FF0055] text-white rounded-md"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
