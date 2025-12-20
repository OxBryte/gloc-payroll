import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateJob() {
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // TODO: Connect to backend API
      console.log("Job Data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Job created successfully! (Mock)");
      // navigate back or clear form
    } catch (error) {
      console.error(error);
      toast.error("Failed to create job");
    } finally {
      setIsSubmitting(false);
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
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
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
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
                Salary Range (Monthly)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  placeholder="e.g. 5000 - 8000"
                  {...register("salary", { required: "Salary is required" })}
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
                />
              </div>
              {errors.salary && (
                <span className="text-xs text-red-500">
                  {errors.salary.message}
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
            <textarea
              rows={6}
              placeholder="Describe the role, responsibilities, and requirements..."
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none resize-none"
            />
            {errors.description && (
              <span className="text-xs text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-c-color text-white text-sm font-medium rounded-lg hover:bg-c-bg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Creating Job..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
