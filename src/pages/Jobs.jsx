import React, { useState } from "react";
import JobCard from "../components/features/job/JobCard";
import { useGetAllJobs } from "../components/hooks/useJobs";
import { Loader2, Search, Filter } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Parse current params
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const type = searchParams.get("type") || "";
  const locationType = searchParams.get("locationType") || "";
  const search = searchParams.get("search") || "";
  const skills = searchParams.get("skills") || "";

  // Prepare params object for hook
  const queryParams = {
    page,
    limit,
    ...(type && { type }),
    ...(locationType && { locationType }),
    ...(search && { search }),
    ...(skills && { skills }),
  };

  const { jobs, isLoadingJobs, pagination } = useGetAllJobs(queryParams);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      search,
      type,
      locationType,
      skills,
    },
  });

  const onSubmit = (data) => {
    const newParams = { page: "1", limit: limit.toString() };
    if (data.search) newParams.search = data.search;
    if (data.type) newParams.type = data.type;
    if (data.locationType) newParams.locationType = data.locationType;
    if (data.skills) newParams.skills = data.skills;
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    reset({ search: "", type: "", locationType: "", skills: "" });
    setSearchParams({ page: "1", limit: limit.toString() });
  };

  return (
    <div className="w-full h-[70dvh] gap-4 rounded-lg flex flex-col">
      {/* Search and Filters Header */}
      <div className="bg-white p-4 rounded-lg border border-gray-100 space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jobs..."
                {...register("search")}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-c-color transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 border rounded-lg transition-colors ${
                showFilters
                  ? "bg-c-color/10 border-c-color text-c-color"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-c-color text-white rounded-lg text-sm font-medium hover:bg-c-bg transition-colors"
            >
              Search
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
              <select
                {...register("type")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-c-color bg-white"
              >
                <option value="">All Employment Types</option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>

              <select
                {...register("locationType")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-c-color bg-white"
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <input
                type="text"
                placeholder="Skills (e.g. React, Node)"
                {...register("skills")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-c-color"
              />

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Jobs Grid */}
      {isLoadingJobs ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-c-color" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {jobs.map((job) => (
                <JobCard key={job._id || job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-gray-500">
              <p>No jobs found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="text-c-color hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination (if available) */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 py-4">
          <button
            disabled={page <= 1}
            onClick={() => setSearchParams({ ...queryParams, page: page - 1 })}
            className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setSearchParams({ ...queryParams, page: page + 1 })}
            className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
