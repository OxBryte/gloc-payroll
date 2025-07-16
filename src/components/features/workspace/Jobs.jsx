import React from "react";
import JobCard from "../job/JobCard";

export default function Jobs() {
  return (
    <div className="w-full space-y-5">
      <div className="relative w-full bg-gradient-to-r  overflow-hidden from-black to-c-color rounded-lg p-10 space-y-2">
        <h1 className="font-bold text-white text-[24px]">
          {" "}
          Here is a Job Board for your Project
        </h1>
        <p className="text-white text-sm font-light">
          Connect your software with the curring-edge technology.
        </p>
        <button className="bg-c-color text-white px-6 py-2.5 text-sm rounded-lg cursor-pointer hover:bg-c-bg transition-colors duration-200">
          Create a Job
              </button>
              <div className="absolute -bottom-10 opacity-[10%] right-0 ">
                  <img src="/gloc-border.svg" alt="" className="w-60" />
              </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2  gap-4 w-full">
        {Array.from({ length: 3 }).map((_, index) => (
          <JobCard key={index} />
        ))}
      </div>
    </div>
  );
}
