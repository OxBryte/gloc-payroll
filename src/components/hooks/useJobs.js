import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createJob,
  getJobs,
  getAllJobs,
  updateJob,
  getJobById,
  deleteJob,
} from "../services/jobsApi";
import { useNavigate } from "react-router-dom";

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: createJobFn, isPending } = useMutation({
    mutationKey: ["createJob"],
    mutationFn: async (body) => {
      return await createJob(body);
    },
    onSuccess() {
      toast.success("Job created successfully!");
      // Refetch workspace data to show new job in list if necessary,
      // assuming jobs are listed under workspace details or a jobs list.
      // Adjust query key based on where jobs are fetched.
      queryClient.invalidateQueries({ queryKey: ["singleWorkspace"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["allJobs"] });
      navigate(-1);
    },
    onError(error) {
      console.log(error);
      toast.error(`${error.message}`);
    },
  });
  return { createJobFn, isPending };
};

export const useGetJobs = () => {
  const {
    data: jobsData,
    isLoading: isLoadingJobs,
    error,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  return { jobs: jobsData?.data || [], isLoadingJobs, error };
};

export const useGetAllJobs = (params) => {
  const {
    data: jobsData,
    isLoading: isLoadingJobs,
    error,
  } = useQuery({
    queryKey: ["allJobs", params],
    queryFn: () => getAllJobs(params),
    keepPreviousData: true, // Useful for pagination
  });

  return {
    jobs: jobsData?.data || [],
    pagination: jobsData?.pagination,
    isLoadingJobs,
    error,
  };
};

export const useGetJobById = (jobId) => {
  const {
    data: jobData,
    isLoading: isLoadingJob,
    error,
  } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobById(jobId),
    enabled: !!jobId, // Only run if jobId exists
  });

  return {
    job: jobData?.data || jobData,
    isLoadingJob,
    error,
  };
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateJobFn, isPending } = useMutation({
    mutationKey: ["updateJob"],
    mutationFn: async ({ jobId, body }) => {
      return await updateJob(jobId, body);
    },
    onSuccess(_, variables) {
      toast.success("Job updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["singleWorkspace"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["allJobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", variables.jobId] });
    },
    onError(error) {
      console.log(error);
      toast.error(`${error.message}`);
    },
  });
  return { updateJobFn, isPending };
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteJobFn, isPending } = useMutation({
    mutationKey: ["deleteJob"],
    mutationFn: async (jobId) => {
      return await deleteJob(jobId);
    },
    onSuccess(_, jobId) {
      toast.success("Job deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["singleWorkspace"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["allJobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    },
    onError(error) {
      console.log(error);
      toast.error(`${error.message}`);
    },
  });
  return { deleteJobFn, isPending };
};
