import React, { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle } from "lucide-react";
import { useGetJobById } from "../components/hooks/useJobs";
import { useApplyForJob } from "../components/hooks/useJobs";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { job, isLoadingJob } = useGetJobById(id);
  const { applyForJobFn, isPending: isSubmitting } = useApplyForJob();
  const fileInputRef = useRef(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Watch cover letter for ReactQuill
  const coverLetterValue = watch("coverLetter");

  // Sync ReactQuill with React Hook Form
  const onCoverLetterChange = (content) => {
    setValue("coverLetter", content);
  };

  // Register cover letter field manually
  React.useEffect(() => {
    register("coverLetter", { required: "Cover letter is required" });
  }, [register]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      // Check file type (PDF, DOC, DOCX)
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF, DOC, or DOCX file");
        return;
      }
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };

  const onSubmit = async (data) => {
    if (!resumeFile) {
      alert("Please upload your resume");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", id);
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone || "");
    formData.append("coverLetter", data.coverLetter);
    formData.append("portfolio", data.portfolio || "");
    formData.append("linkedIn", data.linkedIn || "");
    formData.append("resume", resumeFile);

    try {
      await applyForJobFn(formData);
      // Success handled in hook, navigate back after a delay
      setTimeout(() => {
        navigate(`/jobs/${id}`);
      }, 2000);
    } catch (error) {
      // Error handled in hook
      console.error(error);
    }
  };

  if (isLoadingJob) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-c-color" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Job not found</p>
          <Link
            to="/careers"
            className="text-c-color hover:underline"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/jobs/${id}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-c-color transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Details</span>
          </Link>
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Apply for {job.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">{job.companyName || "Company"}</span>
              <span>•</span>
              <span>{job.location}</span>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6"
        >
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("fullName", { required: "Full name is required" })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
                />
                {errors.fullName && (
                  <span className="text-xs text-red-500">
                    {errors.fullName.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
                />
                {errors.email && (
                  <span className="text-xs text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                {...register("phone")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Resume</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Upload Resume <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 font-normal ml-2">
                  (PDF, DOC, DOCX - Max 5MB)
                </span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-c-color transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                {resumeFile ? (
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {resumeFileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResumeFile(null);
                        setResumeFileName("");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center gap-2 text-gray-600 hover:text-c-color transition-colors"
                  >
                    <Upload className="w-8 h-8" />
                    <span className="text-sm">Click to upload or drag and drop</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Cover Letter <span className="text-red-500">*</span>
            </h2>
            <div className="space-y-2">
              <div className="h-64 mb-12">
                <ReactQuill
                  theme="snow"
                  value={coverLetterValue || ""}
                  onChange={onCoverLetterChange}
                  className="h-full bg-white rounded-lg"
                  placeholder="Tell us why you're a great fit for this position..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
                    ],
                  }}
                />
              </div>
              {errors.coverLetter && (
                <span className="text-xs text-red-500 block mt-2">
                  {errors.coverLetter.message}
                </span>
              )}
            </div>
          </div>

          {/* Additional Links */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Additional Information (Optional)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  {...register("portfolio", {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Please enter a valid URL",
                    },
                  })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
                />
                {errors.portfolio && (
                  <span className="text-xs text-red-500">
                    {errors.portfolio.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  {...register("linkedIn", {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Please enter a valid URL",
                    },
                  })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
                />
                {errors.linkedIn && (
                  <span className="text-xs text-red-500">
                    {errors.linkedIn.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting || !resumeFile}
              className="w-full bg-c-color text-white py-4 rounded-xl font-semibold hover:bg-c-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              By submitting, you agree to our terms and conditions
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

