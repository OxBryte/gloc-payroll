import React from "react";
import { useUser } from "../../hooks/useUser";

export default function Account() {
  const { user } = useUser();

  const [username, setUsername] = React.useState(user?.username || "");
  const [fullName, setFullName] = React.useState(user?.fullName || "");

  return (
    <div className="w-full space-y-6">
      <div className="space-y-3">
        <p className="font-semibold text-lg">Avatar</p>
        <p className="text-xs font-light">Edit your profile picture</p>
        <img
          src={user?.avatar}
          alt={user?.fullName}
          className="w-20 h-20 overflow-hidden rounded-full object-cover"
        />
      </div>
      <hr className="border-black/10" />
      <div className="space-y-3">
        <p className="font-semibold text-lg">Personal Information</p>
        <p className="text-xs font-light">Edit your personal information</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-light">Username</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-c-color"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-light">Full Name</p>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-c-color"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              // Handle save logic here
              console.log("Saved:", { username, fullName });
            }}
            className="px-4 py-2 bg-c-color text-white rounded-lg hover:bg-c-color-dark transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
