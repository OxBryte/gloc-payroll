import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createWorkspace,
  getSingleWorkspace,
  getWorkspace,
} from "../services/workspaceApi";
import { useNavigate } from "react-router-dom";
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

export function useGetSingleWorkspace(id) {
  const {
    isPending: isLoadingSingleWorkspace,
    data: workspace,
    error,
  } = useQuery({
    queryKey: ["singleWorkspace", id],
    queryFn: () => getSingleWorkspace(id),
  });

  return {
    isLoadingSingleWorkspace,
    singleWorkspace: workspace?.data,
    error,
  };
}

export const useCreateWorkspace = () => {
  const navigate = useNavigate();

  const { mutateAsync: createWorkspaceFn, isPending } = useMutation({
    mutationKey: ["createWorkspace"],
    mutationFn: async (body) => {
      return await createWorkspace(body);
    },
    onSuccess(data) {
      console.log(data);
      toast.success(`${data.message}`);

      //redirect to dashboard
      navigate("/verify-email");
    },
    onError(error) {
      console.log(error);

      toast.error(`${error.message}`);
    },
  });
  return { createWorkspaceFn, isPending };
};
