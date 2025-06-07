import React from "react";
import { useUser } from "../../hooks/useUser";

export default function Account() {
  const { user, isLoadingUser } = useUser();

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
      </div>
    </div>
  );
}
