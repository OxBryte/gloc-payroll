import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getCurrentUser, updateUser } from "../services/authApi";
import toast from "react-hot-toast";

export function useUser() {
  const token = document.cookie.includes("token=")
    ? document.cookie.split("token=")[1].split(";")[0]
    : null;

  const {
    isPending: isLoadingUser,
    data: user,
    error,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    enabled: token !== null, // Only run the query if the token exists
    retry: 1, // Reduce retries for faster failure detection
  });

  // Clear invalid token when authentication fails
  useEffect(() => {
    if (isError && token) {
      // Token is invalid, clear it from storage
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; max-age=0; Secure; SameSite=Strict;";
    }
  }, [isError, token]);

  // isAuthenticated should be true only if:
  // 1. Token exists AND
  // 2. Query succeeded (token is valid)
  // During loading, we use token presence as a preliminary check
  const isAuthenticated = token !== null && (isLoadingUser || isSuccess);

  return {
    isLoadingUser,
    user: user?.data,
    error,
    isAuthenticated,
  };
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutateAsync: updateUserFn, isPending } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async (body) => {
      return await updateUser(body);
    },
    onSuccess(data) {
      console.log(data);
      toast.success(data?.success === true && "Profile updated successfully");
      queryClient.refetchQueries({
        queryKey: ["user"],
      });
    },
    onError(error) {
      console.log(error);

      toast.error(`${error.message}`);
    },
  });
  return { updateUserFn, isPending };
}
