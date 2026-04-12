import React from "react";
import { useGetWorkspace } from "../components/hooks/useWorkspace";
import { useGetJobs } from "../components/hooks/useJobs";
import { Loader2 } from "lucide-react";
import JobCard from "../components/features/job/JobCard";

function WorkspaceSection({ workspace }) {
  const workspaceId = workspace._id || workspace.id;
  const { jobs, isLoadingJobs } = useGetJobs(workspaceId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-c-color/10 overflow-hidden flex items-center justify-center shrink-0">
          {workspace.logo ? (
            <img
              src={workspace.logo}
              alt={workspace.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-c-color font-bold text-sm">
              {workspace.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <p className="font-semibold text-base">{workspace.name}</p>
        {!isLoadingJobs && (
          <span className="text-xs text-gray-400 font-light">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {isLoadingJobs ? (
        <div className="w-full h-32 bg-white rounded-lg flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-c-color" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="w-full bg-white rounded-lg border border-gray-100 py-8 flex flex-col items-center justify-center gap-2">
          <img src="/empty.svg" alt="" className="w-12 opacity-60" />
          <p className="text-gray-400 text-sm font-light">
            No jobs in this workspace
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id || job.id} job={job} showToggle={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Applicants() {
  const { workspace: workspaces, isLoadingWorkspace } = useGetWorkspace();

  return (
    <div className="w-full space-y-8">
      {/* Header banner */}
      <div className="relative w-full bg-gradient-to-r overflow-hidden from-black to-c-color rounded-lg p-10 space-y-2">
        <h1 className="font-bold text-white text-[24px]">Applicants</h1>
        <p className="text-white text-sm font-light">
          View and manage applicants across all your workspaces and jobs.
        </p>
        <div className="absolute -bottom-10 opacity-[20%] right-0">
          <img src="/gloc-border.svg" alt="" className="w-60" />
        </div>
      </div>

      {/* Content */}
      {isLoadingWorkspace ? (
        <div className="w-full min-h-[320px] bg-white rounded-lg flex flex-col gap-3 items-center justify-center">
          <img src="/loading.svg" alt="" className="w-30" />
          <p className="text-sm font-light">Loading workspaces...</p>
        </div>
      ) : !workspaces || workspaces.length === 0 ? (
        <div className="w-full h-[320px] bg-white rounded-lg flex flex-col items-center justify-center gap-4 p-6">
          <img src="/empty.svg" alt="" className="w-20" />
          <p className="text-gray-500 text-sm font-light">
            No workspaces found. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {workspaces.map((ws) => (
            <WorkspaceSection key={ws._id || ws.id} workspace={ws} />
          ))}
        </div>
      )}
    </div>
  );
}
