import React, { useState } from "react";
import { X, MapPin, Briefcase, DollarSign, Calendar, Edit } from "lucide-react";
import EditJobModal from "./EditJobModal";

export default function JobDetailsModal({ job, setIsOpen }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
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
            <div>
              <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <span className="font-medium">
                  {job.companyName || "Company Name"}
                </span>
                {job.location && (
                  <>
                    <span>•</span>
                    <span>{job.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Type</span>
              </div>
              <p className="font-semibold text-sm capitalize">
                {job.locationType || "On-site"}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Employment</span>
              </div>
              <p className="font-semibold text-sm capitalize">{job.type}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Salary</span>
              </div>
              <p className="font-semibold text-sm">{job.amount}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Duration</span>
              </div>
              <p className="font-semibold text-sm">
                {job.duration || "Permanent"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900">About the role</h3>
            <div
              className="prose prose-sm max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Job
            </button>
            <button className="flex-1 bg-c-color text-white py-3 rounded-xl font-semibold hover:bg-c-bg transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Edit Job Modal */}
      {isEditModalOpen && (
        <EditJobModal
          job={job}
          setIsOpen={setIsEditModalOpen}
        />
      )}
    </div>
  );
}
