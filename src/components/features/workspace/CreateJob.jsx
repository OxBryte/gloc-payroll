import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCreateJob } from "../../hooks/useJobs";
import { useGetSingleWorkspace } from "../../hooks/useWorkspace";

export default function CreateJob() {
  const location = useLocation();
  const { slug } = useParams();
  const { singleWorkspace } = useGetSingleWorkspace(slug);
  const { createJobFn, isPending: isCreatingJob } = useCreateJob();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  // const [isSubmitting, setIsSubmitting] = useState(false); // Using react-query isPending instead

  // Watch description for manual validation if needed, or rely on React Hook Form's Controller
  // However, simpler to just use state for Quill if not using Controller,
  // but to integrate with RHF properly we should register it.
  // For simplicity here, we'll use local state and sync on submit or use setValue.

  // Using setValue to sync Quill content to RHF
  const onEditorChange = (content) => {
    setValue("description", content);
  };

  // Register description field manually
  React.useEffect(() => {
    register("description", { required: "Description is required" });
  }, [register]);

  const descriptionValue = watch("description");

  const onSubmit = async (data) => {
   
    // Parse skills
    const skillsArray = data.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    // Format amount
    const amountString = `$${data.minSalary} - $${data.maxSalary}`;

    // Determine location type (simple logic for now)
    const locationType = data.location.toLowerCase().includes("remote")
      ? "remote"
      : "onsite";

    const payload = {
      location: data.location,
      locationType: locationType,
      title: data.title,
      type: data.type.toLowerCase(), // API example showed lowercase
      skills: skillsArray,
      amount: amountString,
      duration: "Year", // Defaulting for now as requested schema doesn't match form exactly, or we can add a field
      description: data.description,
      workspaceId: singleWorkspace?.id,
    };

    try {
      await createJobFn(payload);
      // toast handled in hook
      // Optional: navigate back
      // navigate(-1);
    } catch (error) {
      // Error handled in hook mostly, but can log here
      console.error(error);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to={location.pathname}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Create a New Job</h1>
          <p className="text-sm text-gray-500 font-light">
            Post a new job opening for your workspace
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <option value="">Select type</option>
                <option value="Fulltime">Full-time</option>
                <option value="Parttime">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
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

            {/* Salary */}
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

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isCreatingJob}
              className="px-8 py-3 bg-c-color text-white text-sm font-medium rounded-lg hover:bg-c-bg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isCreatingJob && <Loader2 className="w-4 h-4 animate-spin" />}
              {isCreatingJob ? "Creating Job..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
