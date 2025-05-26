import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { acceptAdmin, inviteAdmin } from "../services/adminApi";

export const useAcceptAdmin = () => {
  const navigate = useNavigate();

  const { mutateAsync: acceptFn, isPending } = useMutation({
    mutationKey: ["acceptAdmin"],
    mutationFn: async (body) => {
      return await acceptAdmin(body);
    },
    onSuccess(data) {
      // console.log(data);
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

export const useInviteAdmin = () => {
  const { mutateAsync: inviteFn, isPending } = useMutation({
    mutationKey: ["inviteAdmin"],
    mutationFn: async ({ body, id }) => {
      console.log("Inviting admin with body:", body, "and workspace ID:", id);
      return await inviteAdmin(body, id);
    },
    onSuccess(data) {
      toast.success(data.message);
    },
    onError(error) {
      console.error(error);
      toast.error(error.message);
    },
  });
  return { inviteFn, isPending };
};
