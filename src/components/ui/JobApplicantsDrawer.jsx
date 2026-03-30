import React from "react";
import { X, Loader2, User, Mail, FileText, ExternalLink, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { useGetApplicants, useUpdateApplicationStatus } from "../hooks/useJobs";

export default function JobApplicantsDrawer({ jobId, isOpen, setIsOpen, jobTitle }) {
  const { applicants, isLoadingApplicants, error } = useGetApplicants(jobId);
  const { updateStatusFn, isPending } = useUpdateApplicationStatus();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex h-screen">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/20 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="w-full max-w-lg bg-white h-screen overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Applicants</h2>
            <p className="text-sm text-gray-500 font-light">{jobTitle}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {isLoadingApplicants ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-c-color" />
              <p className="text-gray-500 animate-pulse">Fetching applicants...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error.message}</p>
            </div>
          ) : applicants?.length > 0 ? (
            <div className="space-y-4">
              {applicants.map((applicant, index) => (
                <div
                  key={applicant._id || index}
                  className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-c-color/10 flex items-center justify-center text-c-color">
                          <User size={16} />
                        </div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {applicant.fullName || "Anonymous Applicant"}
                        </h3>
                      </div>
                      
                      <div className="space-y-2 pl-10">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          <span>{applicant.email}</span>
                        </div>

                        {applicant.coverLetter && (
                          <div className="mt-4 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                              <MessageSquare size={12} />
                              Cover Letter
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100/50 italic font-light">
                              "{applicant.coverLetter}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                  <div className="flex flex-col items-end gap-2">
                    {applicant.resume && (
                      <a
                        href={applicant.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 border border-transparent text-white text-xs rounded-lg hover:bg-black transition-colors"
                      >
                        <FileText size={14} />
                        Resume
                        <ExternalLink size={12} className="opacity-70" />
                      </a>
                    )}

                    {(!applicant.status || applicant.status === "applied") ? (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateStatusFn({ id: applicant._id, status: "accepted" })}
                          disabled={isPending}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 text-xs rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle size={14} />
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatusFn({ id: applicant._id, status: "rejected" })}
                          disabled={isPending}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 text-xs rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full border ${
                          applicant.status === "accepted"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {applicant.status?.charAt(0).toUpperCase() +
                          applicant.status?.slice(1)}
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                <User size={32} />
              </div>
              <div>
                <p className="text-gray-900 font-medium">No applicants yet</p>
                <p className="text-gray-500 text-sm max-w-[200px]">
                  When people apply for this job, they will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
