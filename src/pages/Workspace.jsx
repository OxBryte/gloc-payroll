import React from "react";
import Tabbar from "../components/layouts/Tabbar";

export default function Workspace() {
  return (
    <div className="w-full space-y-5">
      <div className="space-y-6 w-full">
        <div className="w-full flex items-center justify-between gap-6">
          <h1 className="text-2xl font-semibold">Bright Team</h1>
          <div className="flex items-center gap-3">
            <button className="bg-c-bg-2 px-5 py-3 rounded-lg text-sm font-medium bg-c-color transition-colors">
              Create New Workspace
            </button>
          </div>
        </div>
        <Tabbar />
      </div>
    </div>
  );
}
