import React, { useState } from "react";
import PublicJobCard from "../components/features/job/PublicJobCard";
import { useGetAllJobs } from "../components/hooks/useJobs";
import { Loader2, Search, Filter, Briefcase } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function Careers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Parse current params
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
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
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-c-color/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-c-color" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Careers</h1>
              <p className="text-gray-600 mt-1">
                Find your next opportunity with us
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or keywords..."
                  {...register("search")}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 border rounded-lg transition-all flex items-center gap-2 ${
                  showFilters
                    ? "bg-c-color/10 border-c-color text-c-color"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-c-color text-white rounded-lg text-sm font-semibold hover:bg-c-bg transition-colors shadow-sm"
              >
                Search
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <select
                    {...register("type")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-c-color/20 focus:border-c-color bg-white"
                  >
                    <option value="">All Types</option>
                    <option value="fulltime">Full-time</option>
                    <option value="parttime">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Type
                  </label>
                  <select
                    {...register("locationType")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-c-color/20 focus:border-c-color bg-white"
                  >
                    <option value="">All Locations</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, Python"
                    {...register("skills")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-c-color/20 focus:border-c-color"
                  />
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-red-500 transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results Count */}
        {!isLoadingJobs && jobs.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {jobs.length} job{jobs.length !== 1 ? "s" : ""}
            {pagination?.total && ` of ${pagination.total}`}
          </div>
        )}

        {/* Jobs Grid */}
        {isLoadingJobs ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-c-color" />
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          </div>
        ) : (
          <>
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {jobs.map((job) => (
                  <PublicJobCard key={job._id || job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any jobs matching your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-c-color text-white rounded-lg hover:bg-c-bg transition-colors text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6 border-t border-gray-200">
                <button
                  disabled={page <= 1}
                  onClick={() =>
                    setSearchParams({ ...queryParams, page: page - 1 })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 text-sm text-gray-700 font-medium">
                    Page {page} of {pagination.totalPages}
                  </span>
                </div>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() =>
                    setSearchParams({ ...queryParams, page: page + 1 })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
