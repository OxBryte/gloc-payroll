import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWorkspace,
  getSingleWorkspace,
  getWorkspace,
} from "../services/workspaceApi";
import toast from "react-hot-toast";

export function useGetWorkspace() {
  const {
    isPending: isLoadingWorkspace,
    data: workspace,
    error,
  } = useQuery({
    queryKey: ["workspace"],
    queryFn: getWorkspace,
  });

  return {
    isLoadingWorkspace,
    workspace: workspace?.data,
    error,
  };
}

export function useGetSingleWorkspace(slug) {
  const {
    isPending: isLoadingSingleWorkspace,
    data: workspace,
    error,
  } = useQuery({
    queryKey: ["singleWorkspace", slug],
    queryFn: () => getSingleWorkspace(slug),
  });

  return {
    isLoadingSingleWorkspace,
    singleWorkspace: workspace?.data,
    error,
  };
}

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: createWorkspaceFn, isPending } = useMutation({
    mutationKey: ["createWorkspace"],
    mutationFn: async (body) => {
      return await createWorkspace(body);
    },
    onSuccess(data) {
      // console.log(data);
      toast.success(`${data.message}`);
      queryClient.refetchQueries({ queryKey: ["workspace"] });
      queryClient.refetchQueries({ queryKey: ["singleWorkspace"] });
    },
    onError(error) {
      console.log(error);

      toast.error(`${error.message}`);
    },
  });
  return { createWorkspaceFn, isPending };
};
