import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useUpdateJob } from "../hooks/useJobs";

export default function EditJobModal({ job, setIsOpen }) {
  const { updateJobFn, isPending: isUpdatingJob } = useUpdateJob();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  // Pre-populate form with job data
  useEffect(() => {
    if (job) {
      // Parse amount if it's in format "$X - $Y"
      let minSalary = "";
      let maxSalary = "";
      if (job.amount) {
        const amountMatch = job.amount.match(/\$([\d,]+)\s*-\s*\$([\d,]+)/);
        if (amountMatch) {
          minSalary = amountMatch[1].replace(/,/g, "");
          maxSalary = amountMatch[2].replace(/,/g, "");
        }
      }

      // Convert skills array to comma-separated string
      const skillsString = job.skills ? job.skills.join(", ") : "";

      reset({
        companyName: job.companyName || "",
        logo: job.logo || "",
        location: job.location || "",
        locationType: job.locationType || "remote",
        title: job.title || "",
        type: job.type || "fulltime",
        skills: skillsString,
        minSalary: minSalary,
        maxSalary: maxSalary,
        duration: job.duration || "",
        description: job.description || "",
        isActive: job.isActive !== undefined ? job.isActive : true,
      });
    }
  }, [job, reset]);

  // Watch description for ReactQuill
  const descriptionValue = watch("description");

  // Sync ReactQuill with React Hook Form
  const onEditorChange = (content) => {
    setValue("description", content);
  };

  // Register description field manually
  useEffect(() => {
    register("description", { required: "Description is required" });
  }, [register]);

  const onSubmit = async (data) => {
    // Parse skills
    const skillsArray = data.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    // Format amount
    const amountString = `$${data.minSalary} - $${data.maxSalary}`;

    const payload = {
      companyName: data.companyName,
      logo: data.logo,
      location: data.location,
      locationType: data.locationType.toLowerCase(),
      title: data.title,
      type: data.type.toLowerCase(),
      skills: skillsArray,
      amount: amountString,
      duration: data.duration,
      description: data.description,
      isActive: data.isActive,
    };

    try {
      await updateJobFn({ jobId: job._id || job.id, body: payload });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Edit Job</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tech Corp"
                  {...register("companyName", {
                    required: "Company name is required",
                  })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
                />
                {errors.companyName && (
                  <span className="text-xs text-red-500">
                    {errors.companyName.message}
                  </span>
                )}
              </div>

              {/* Logo URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Logo URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/logo.png"
                  {...register("logo", { required: "Logo URL is required" })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
                />
                {errors.logo && (
                  <span className="text-xs text-red-500">
                    {errors.logo.message}
                  </span>
                )}
              </div>

              {/* Job Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  {...register("title", { required: "Job title is required" })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
                />
                {errors.title && (
                  <span className="text-xs text-red-500">
                    {errors.title.message}
                  </span>
                )}
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Employment Type
                </label>
                <select
                  {...register("type", {
                    required: "Employment type is required",
                  })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none bg-white"
                >
                  <option value="fulltime">Full-time</option>
                  <option value="parttime">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                </select>
                {errors.type && (
                  <span className="text-xs text-red-500">
                    {errors.type.message}
                  </span>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Remote, New York, Singapore"
                  {...register("location", { required: "Location is required" })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
                />
                {errors.location && (
                  <span className="text-xs text-red-500">
                    {errors.location.message}
                  </span>
                )}
              </div>

              {/* Location Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Location Type
                </label>
                <select
                  {...register("locationType", {
                    required: "Location type is required",
                  })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none bg-white"
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.locationType && (
                  <span className="text-xs text-red-500">
                    {errors.locationType.message}
                  </span>
                )}
              </div>

              {/* Salary Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Salary Range
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Min"
                      {...register("minSalary", {
                        required: "Min salary is required",
                      })}
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="relative w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Max"
                      {...register("maxSalary", {
                        required: "Max salary is required",
                      })}
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
                    />
                  </div>
                </div>
                {(errors.minSalary || errors.maxSalary) && (
                  <span className="text-xs text-red-500">
                    {errors.minSalary?.message || errors.maxSalary?.message}
                  </span>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. Year, Month, Permanent"
                  {...register("duration", { required: "Duration is required" })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
                />
                {errors.duration && (
                  <span className="text-xs text-red-500">
                    {errors.duration.message}
                  </span>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Required Skills
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, TypeScript (comma separated)"
                {...register("skills", { required: "Skills are required" })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
              />
              {errors.skills && (
                <span className="text-xs text-red-500">
                  {errors.skills.message}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Job Description
              </label>
              <div className="h-[300px] mb-12">
                <ReactQuill
                  theme="snow"
                  value={descriptionValue || ""}
                  onChange={onEditorChange}
                  className="h-full bg-white rounded-lg"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              </div>
              {errors.description && (
                <span className="text-xs text-red-500 block mt-2">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                {...register("isActive")}
                className="w-4 h-4 text-c-color border-gray-300 rounded focus:ring-c-color"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700"
              >
                Job is active
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingJob}
                className="px-8 py-3 bg-c-color text-white text-sm font-medium rounded-lg hover:bg-c-bg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUpdatingJob && <Loader2 className="w-4 h-4 animate-spin" />}
                {isUpdatingJob ? "Updating Job..." : "Update Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

