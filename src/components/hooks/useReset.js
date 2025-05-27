import { forgetPassword } from "../services/authApi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useForget = () => {
  const { mutateAsync: forgetFn, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (body) => {
      return await forgetPassword(body);
    },
    onSuccess(data) {
      // console.log(data);
      toast.success(`${data.message}`);
    },
    onError(error) {
      console.log(error);

      toast.error(`${error.message}`);
    },
  });
  return { forgetFn, isPending };
};
