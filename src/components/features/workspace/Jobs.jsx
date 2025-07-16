import React from "react";

export default function Jobs() {
  return (
    <div className="w-full space-y-5">
      <div className="w-full bg-gradient-to-r from-black to-c-color rounded-lg p-10 space-y-2">
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
          </div>
          
          
    </div>
  );
}
