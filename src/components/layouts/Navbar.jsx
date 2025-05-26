import React from "react";
import { CgChevronDown } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/auth";

export default function Navbar() {

  // const { user, isAuthenticated } = useAuth();

  return (
    <div className="w-full mx-auto py-5 border-b border-black/10 h-[85.12px]">
      <div className="mx-auto px-4 md:px-6 flex items-center justify-between max-w-[1280px]">
        <p className="font-semibold text-[20px]">Welcome, Bright Team</p>
        {/* <div className="flex items-center gap-3 h-auto">
          <Link to="/signup">
            <button className="px-5 py-2.5 bg-c-color rounded-lg hover:bg-c-bg cursor-pointer text-white">
              Create account
            </button>
          </Link>
          <Link to="/login">
            <button className="px-5 py-2.5 bg-c-bg rounded-lg hover:bg-c-color cursor-pointer text-white">
              Login
            </button>
          </Link>
        </div> */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-c-color"></div>
          <div className="space-y-0">
            <p className="text-sm font-semibold">Olumide Silas</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <CgChevronDown />
        </div>
      </div>
    </div>
  );
}
