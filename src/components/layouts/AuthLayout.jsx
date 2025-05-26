import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      <div className="p-4 h-screen flex flex-col gap-6 md:flex-row">
        <div className="min-w-[36rem] bg-gray-200 h-full overflow-hidden rounded-xl">
          {/* <img src="login-bg.jpg" alt="" className="w-full h-full" /> */}
        </div>
        <div className="w-full h-full">
          <Outlet />
        </div>
      </div>
    </>
  );
}
