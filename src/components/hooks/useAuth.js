import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authApi";

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
