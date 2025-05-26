import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { login, signup, verifyEmail } from "../services/authApi";

export const useSignup = () => {
  const navigate = useNavigate();

  const { mutateAsync: signupFn, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (body) => {
      return await signup(body);
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
  return { signupFn, isPending };
};

export const useVerify = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: verifyFn, isPending } = useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: async (body) => {
      return await verifyEmail(body);
    },
    onSuccess(data) {
      console.log(data);
      toast.success(`${data.message}`);

      //set user data and session in global state
      queryClient.setQueryData(["user"], data.data.user);

      //save token in local storage
      localStorage.setItem("token", data.data.token);
      document.cookie = `token=${data.data.token}; path=/; max-age=604800; Secure; SameSite=Strict;`;

      //redirect to dashboard
      navigate("/");
    },
    onError(error) {
      console.log(error);
      toast.error(`${error.message}`);
      navigate("/");
    },
  });
  return { verifyFn, isPending };
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: loginFn, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (body) => {
      return await login(body);
    },
    onSuccess(data) {
      console.log(data);
      toast(`${data.message}`, { icon: "🚀" });

      //set user data and session in global state
      queryClient.setQueryData(["user"], data.data.user);

      //save token in local storage
      localStorage.setItem("token", data.data.token);
      document.cookie = `token=${data?.data?.token}; path=/; max-age=604800; Secure; SameSite=Strict;`;
      navigate("/");
    },
    onError(error) {
      toast(`${error.message}`, { icon: "🔥" });
    },
  });
  return { loginFn, isPending };
};
