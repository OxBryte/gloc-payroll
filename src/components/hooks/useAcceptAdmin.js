import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { acceptAdmin } from "../services/workspaceApi";

export const useAcceptAdmin = () => {
  const navigate = useNavigate();

  const { mutateAsync: acceptFn, isPending } = useMutation({
    mutationKey: ["acceptAdmin"],
    mutationFn: async (body) => {
      return await acceptAdmin(body);
    },
    onSuccess(data) {
      console.log(data);
      toast.success(`${data.message}`);

      //redirect to dashboard
      navigate("/");
    },
    onError(error) {
      console.log(error);
      toast.error(`${error.message}`);
      navigate("/");
    },
  });
  return { acceptFn, isPending };
};
