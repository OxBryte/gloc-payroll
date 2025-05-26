import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/authApi";

export function useUser() {
  const token = document.cookie.includes("token=")
    ? document.cookie.split("token=")[1].split(";")[0]
    : null;
  const {
    isPending: isLoadingUser,
    data: user,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return {
    isLoadingUser,
    user: user?.data,
    error,
    isAuthenticated: token !== null,
  };
}
