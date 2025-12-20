import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createJob, getJobs } from "../services/jobsApi";

export const useCreateJob = () => {
  const queryClient = useQueryClient();
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
