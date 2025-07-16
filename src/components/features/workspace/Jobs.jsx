import React from "react";

export default function Jobs() {
  return (
    <div className="w-full space-y-5">
      <div className="w-full bg-gradient-to-r from-c-color via-black to-c-color-sec rounded-lg p-4">
        <h1 className="font-semibold text-white font-[24px]">
          {" "}
          Here is a Job Board for your Project
        </h1>
        <p>Connect your software with the curring-edge technology.</p>
        <button className="bg-c-color text-white px-6 py-2.5 text-sm rounded-lg cursor-pointer hover:bg-c-bg transition-colors duration-200">
          Create Job
        </button>
      </div>
    </div>
  );
}
