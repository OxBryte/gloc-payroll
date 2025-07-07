import { PiBriefcase, PiMapPin } from "react-icons/pi";
import React from "react";
import { Dot } from "lucide-react";

export default function JobCard() {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-100 p-4 flex flex-col gap-3 hover:border-c-color">
      <div className="flex w-full gap-3 items-center">
        <div className="min-w-24 h-24 rounded-lg bg-[#e9e9e9]"></div>
        <div className="space-y-2">
          <p className="font-bold text-lg">Senior Front-end Developer</p>
          <div className="flex gap-1 items-center text-black/70">
            <p className="font-medium text-sm">Figma</p>
            <Dot />
            <p className="font-medium text-sm">Singapore</p>
          </div>
        </div>
      </div>
      <div className="space-y-1 w-full">
        <div className="flex items-center gap-2">
          <div className="bg-gray-50 text-sm font-light w-fit flex items-center gap-1 px-2 py-1 rounded-full">
            <PiMapPin />
            Remote
          </div>
          <div className="bg-green-50 text-green-600 text-sm font-light w-fit flex items-center gap-1 px-2 py-1 rounded-full">
            <PiBriefcase />
            Full-time
          </div>
        </div>
      </div>
      <div className="text-gray-500 font-light text-sm">
        Javascript, Bootstrap, Tailwind CSS, Typescript, Thirdweb
      </div>
      <div className="flex items-center gap-3 justify-between w-full">
        <p className="font-bold text-xl">
          $5,000{" "}
          <span className="font-light text-sm text-gray-400">/monthly</span>
        </p>
        <button className="w-fit px-5 py-2 text-white bg-c-color text-sm cursor-pointer hover:bg-c-bg rounded-lg">
          View Details
        </button>
      </div>
    </div>
  );
}
