import React from "react";
import JobCard from "../components/features/job/JobCard";

export default function Jobs() {
  return (
    <>
      {/* <div className="w-full h-[70dvh] flex flex-col items-center justify-center gap-4 bg-white p-4 rounded-lg">
      <img src="/jobs.svg" alt="Jobs Illustration" className="w-50" />
      <p className="font-light max-w-[340px] text-center">
        No jobs available yet. This section is under development (Coming Soon).
      </p>
    </div> */}
      <div className="w-full h-[70dvh] gap-4 rounded-lg">
        .grid.grid-cols-1.md:grid-cols-3.grid-cols-4
        <JobCard />
      </div>
    </>
  );
}
