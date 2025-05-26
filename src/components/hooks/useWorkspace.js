import { useQuery } from "@tanstack/react-query";
import { getSingleWorkspace, getWorkspace } from "../services/workspaceApi";

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
