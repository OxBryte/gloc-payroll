import { PiBriefcase, PiMapPin } from "react-icons/pi";
import React, { useState } from "react";
import { Dot, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeleteJob, useToggleJobStatus } from "../../hooks/useJobs";

export default function JobCard({ job, showDelete = false, showToggle = false }) {
  const navigate = useNavigate();
  const { deleteJobFn, isPending: isDeleting } = useDeleteJob();
  const { toggleJobStatusFn, isPending: isToggling } = useToggleJobStatus();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!job) return null;

  const handleViewDetails = () => {
    navigate(`/jobs/${job._id || job.id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteJobFn(job._id || job.id);
      setShowConfirmDelete(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleToggleStatus = async () => {
    try {
      await toggleJobStatusFn(job._id || job.id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-100 p-4 flex flex-col gap-3 hover:border-c-color/50 relative">
      {(showDelete || showToggle) && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {showToggle && (
            <div className="flex items-center gap-2">
              {isToggling ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              ) : (
                <button
                  onClick={handleToggleStatus}
                  disabled={isToggling}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-c-color focus:ring-offset-2 disabled:opacity-50 ${
                    job?.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                  title={job?.isActive ? "Deactivate job" : "Activate job"}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      job?.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              )}
            </div>
          )}
          {showDelete && (
            <button
              onClick={() => setShowConfirmDelete(true)}
              disabled={isDeleting}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete job"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      )}

      {showConfirmDelete && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg flex items-center justify-center z-10 p-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg max-w-xs w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Job?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this job? This action cannot be
              undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full gap-3 items-center">
        <div className="w-20 h-20 rounded-lg bg-[#e9e9e9] overflow-hidden">
          <img
            src={job?.logo}
            alt={job?.companyName}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-lg capitalize">{job.title}</p>
          <div className="flex gap-0 items-center text-black/70">
            <p className="font-medium text-sm capitalize">{job?.companyName}</p>
            <Dot
              className={`${job?.isActive === true ? "text-green-500" : ""}`}
            />
            <p className="font-medium text-sm capitalize">{job.location}</p>
          </div>
        </div>
      </div>
      <div className="space-y-1 w-full">
        <div className="flex items-center gap-2">
          <div className="bg-gray-50 capitalize text-sm font-light w-fit flex items-center gap-1 px-2 py-1 rounded-full">
            <PiMapPin />
            {job.locationType || "Remote"}
          </div>
          <div className="bg-green-50 text-green-600 text-sm font-light w-fit flex items-center gap-1 px-2 py-1 rounded-full capitalize">
            <PiBriefcase />
            {job.type}
          </div>
        </div>
      </div>
      <div className="text-gray-500 font-light text-sm line-clamp-2 capitalize">
        {job.skills && job.skills.join(", ")}
      </div>
      <div className="flex items-center gap-3 justify-between w-full">
        <p className="font-bold text-lg">
          {job.amount}{" "}
          <span className="font-light text-sm text-gray-400">/yearly</span>
        </p>
        <button
          onClick={handleViewDetails}
          className="w-fit px-4 py-2 text-white bg-c-color text-sm cursor-pointer hover:bg-c-bg rounded-lg"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
