import React from "react";

export default function JobCard() {
  return (
    <div className="w-full max-w-[360px] bg-white rounded-lg border border-gray-100 p-4 flex flex-col gap-3">
      <div className="flex w-full gap-2 items-center">
        <div className="w-12 h-12 rounded-lg bg-[#e9e9e9]"></div>
        <div className="space-y-1">
          <p className="font-semibold">Company name</p>
          <p className="font-light text-xs">Company Location</p>
        </div>
      </div>
      <p className="font-semibold text-lg">Front-end Developer</p>
      <div className="flex items-center gap-2">
        <div className="bg-grey-50 text-grey-600 text-xs font-light w-fit px-3 py-1 rounded-full">
         On-Site
        </div>
        <div className="bg-green-50 text-green-600 text-xs font-light w-fit px-3 py-1 rounded-full">
          Full-time
        </div>
      </div>
    </div>
  );
}
