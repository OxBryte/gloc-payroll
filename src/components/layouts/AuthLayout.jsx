import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      <div className="p-4 h-screen flex flex-col gap-6 md:flex-row">
        <div className="min-w-[36rem] bg-gray-200 h-full overflow-hidden rounded-xl hidden md:flex bg-gradient-to-br from-c-color to-black">

        </div>
        <div className="w-full h-full flex items-center justify-center">
          <Outlet />
        </div>
      </div>
    </>
  );
}
