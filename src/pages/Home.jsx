import React from "react";
import AllWorkspace from "../components/features/AllWorkspace";

export default function Home() {
  return (
    <div className="w-full space-y-5">
      <div className="w-full flex flex-col md:flex-row gap-6">
        <div className="w-full h-[300px] rounded-lg bg-white border border-gray-300"></div>
        <div className="w-full h-[300px] rounded-lg bg-white border border-gray-300"></div>
      </div>
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-[24px]">Workspace</p>
        </div>
        <AllWorkspace />
      </div>
      <div className="space-y-3 w-full"></div>
    </div>
  );
}
