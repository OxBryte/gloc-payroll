import { PiBriefcase, PiMapPin } from "react-icons/pi";
import React from "react";
import { Dot } from "lucide-react";

export default function JobCard({ job }) {
  if (!job) return null;

  return (
    <div className="w-full bg-white rounded-lg border border-gray-100 p-4 flex flex-col gap-3 hover:border-c-color/50">
      <div className="flex w-full gap-3 items-center">
        <div className="min-w-20 h-20 rounded-lg bg-[#e9e9e9] overflow-hidden">
          <img
            src={job?.logo}
            alt={job?.companyName}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-lg">{job.title}</p>
          <div className="flex gap-0 items-center text-black/70">
            {/* You might want to map these fields if available in job object */}
            <p className="font-medium text-sm">{job?.companyName}</p>
            <Dot
              className={`${
                job?.isActive === true ? "text-green-500" : ""
              }`}
            />
            <p className="font-medium text-sm">{job.location}</p>
          </div>
        </div>
      </div>
      <div className="space-y-1 w-full">
        <div className="flex items-center gap-2">
          <div className="bg-gray-50 text-sm font-light w-fit flex items-center gap-1 px-2 py-1 rounded-full">
            <PiMapPin />
            {job.locationType || "Remote"}
          </div>
          <div className="bg-green-50 text-green-600 text-sm font-light w-fit flex items-center gap-1 px-2 py-1 rounded-full capitalize">
            <PiBriefcase />
            {job.type}
          </div>
        </div>
      </div>
      <div className="text-gray-500 font-light text-sm line-clamp-2">
        {job.skills && job.skills.join(", ")}
      </div>
      <div className="flex items-center gap-3 justify-between w-full">
        <p className="font-bold text-xl">
          {job.amount}{" "}
          {/* <span className="font-light text-sm text-gray-400">/monthly</span> */}
        </p>
        <button className="w-fit px-5 py-2 text-white bg-c-color text-sm cursor-pointer hover:bg-c-bg rounded-lg">
          View Details
        </button>
      </div>
    </div>
  );
}
