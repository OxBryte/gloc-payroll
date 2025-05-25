import React from "react";
import AllWorkspace from "../components/features/AllWorkspace";

export default function Workspace() {
  return (
    <div className="w-full space-y-5">
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between gap-3">
          {/* <BsGrid3X2Gap size={30} className="text-gray-400" /> */}
          <p className="font-semibold text-[24px]">Workspace</p>
          <button className="bg-c-bg-2 px-5 py-3 rounded-lg text-sm font-medium bg-c-color transition-colors">
            Create New Workspace
          </button>
        </div>
        <AllWorkspace />
      </div>
    </div>
  );
}
