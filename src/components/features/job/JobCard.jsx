import React from "react";

export default function JobCard() {
  return (
    <div className="w-full max-w-[280px] rounded-lg border border-gray-100 p-4 flex flex-col gap-3">
      <div className="flex w-full gap-3 items-center">
        <div className="w-20 h-20 rounded-lg bg-[#e9e9e9]"></div>
              <div className="space-y-2">
                  <p className="font-semibold text-xl">Role Title</p>
                  <p className="font-light text-sm">Company Name</p>
      </div>
          </div>
    </div>
  );
}
