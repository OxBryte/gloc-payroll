import React from "react";
import { CgChevronDown } from "react-icons/cg";
import { useUser } from "../hooks/useUser";

export default function Navbar() {
  const { user } = useUser();

  return (
    <div className="w-full mx-auto py-5 border-b border-black/10 h-[85.12px]">
      <div className="mx-auto px-4 md:px-6 flex items-center justify-between max-w-[1280px]">
        <p className="font-semibold text-[20px]">
          Welcome,{" "}
          <span className="text-c-color capitalize">{user?.username}</span>
        </p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-c-color overflow-hidden">
            <img src={user?.avatar} alt="" />
          </div>
          <div className="space-y-0">
            <p className="text-sm font-semibold capitalize">{user?.fullName}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <CgChevronDown />
        </div>
      </div>
    </div>
  );
}
