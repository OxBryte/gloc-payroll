import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, DollarSign, Calendar, Edit, Loader2 } from "lucide-react";
import { useGetJobById } from "../components/hooks/useJobs";
import { useUser } from "../components/hooks/useUser";
import EditJobDrawer from "../components/ui/EditJobDrawer";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { job, isLoadingJob, error } = useGetJobById(id);
  const { user } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check if current user is the job owner
  const isJobOwner = user && job && (
    job.createdBy === user.id ||
    job.createdBy === user._id ||
    job.createdBy?._id === user._id ||
    job.createdBy?.id === user.id ||
    job.userId === user.id ||
    job.userId === user._id ||
    job.owner === user.id ||
    job.owner === user._id ||
    job.owner?._id === user._id ||
    job.owner?.id === user.id
  );

  if (isLoadingJob) {
    return (
      <div className="w-full h-[70dvh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-c-color" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="w-full h-[70dvh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Job not found or an error occurred.</p>
        <button
          onClick={() => navigate("/jobs")}
          className="px-4 py-2 bg-c-color text-white rounded-lg hover:bg-c-bg transition-colors"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-sm text-gray-500 font-light">
            {job.companyName || "Company Name"} • {job.location}
          </p>
        </div>
        {isJobOwner && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Job
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-100 p-6 md:p-8">
        <div className="space-y-8">
          {/* Company Logo and Info */}
          <div className="flex gap-4 items-start">
            <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
              {job.logo ? (
                <img
                  src={job.logo}
                  alt={job.companyName || "Company"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                  {job.companyName ? job.companyName.charAt(0) : "C"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {job.companyName || "Company Name"}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                {job.location && <span>{job.location}</span>}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                <MapPin className="w-4 h-4" />
                <span>Location Type</span>
              </div>
              <p className="font-semibold text-sm capitalize">
                {job.locationType || "On-site"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                <Briefcase className="w-4 h-4" />
                <span>Employment</span>
              </div>
              <p className="font-semibold text-sm capitalize">{job.type}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                <DollarSign className="w-4 h-4" />
                <span>Salary</span>
              </div>
              <p className="font-semibold text-sm">{job.amount}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                <Calendar className="w-4 h-4" />
                <span>Duration</span>
              </div>
              <p className="font-semibold text-sm">
                {job.duration || "Permanent"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-lg">About the role</h3>
            <div
              className="prose prose-sm max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-lg">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Button */}
          <div className="pt-4 border-t border-gray-100">
            <button className="w-full bg-c-color text-white py-4 rounded-xl font-semibold hover:bg-c-bg transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Edit Job Drawer */}
      {isEditModalOpen && (
        <EditJobDrawer
          job={job}
          setIsOpen={setIsEditModalOpen}
        />
      )}
    </div>
  );
}

