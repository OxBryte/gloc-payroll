import React from "react";
import JobCard from "../job/JobCard";
import { Link } from "react-router-dom";
import { useGetJobs } from "../../hooks/useJobs";
import { Loader2 } from "lucide-react";

export default function Jobs() {
  const { jobs, isLoadingJobs } = useGetJobs();

  if (isLoadingJobs) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-c-color" />
      </div>
    );
  }

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
        <Link to="?create">
          <button className="bg-c-color text-white px-6 py-2.5 text-sm rounded-lg cursor-pointer hover:bg-c-bg transition-colors duration-200">
            Create a Job
          </button>
        </Link>
        <div className="absolute -bottom-10 opacity-[20%] right-0 ">
          <img src="/gloc-border.svg" alt="" className="w-60" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {jobs?.length > 0 ? (
          jobs.map((job) => <JobCard key={job._id || job.id} job={job} />)
        ) : (
          <div className="col-span-full py-10 text-center text-gray-500">
            No jobs found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
