import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEmployee } from "../services/employeeApi";

export const useCreateEmployee = () => {
  const { mutateAsync: createEmployeeFn, isPending } = useMutation({
    mutationKey: ["createEmployee"],
    mutationFn: async (body) => {
      return await createEmployee(body);
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
  return { createEmployeeFn, isPending };
};
