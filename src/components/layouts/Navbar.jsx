import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-full mx-auto py-5 border-b border-black/10">
      <div className="mx-auto px-4 flex items-center justify-between max-w-[1280px]">
        <p>logo</p>
        <div className="flex items-center gap-3 h-auto">
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
        </div>
      </div>
    </div>
  );
}
