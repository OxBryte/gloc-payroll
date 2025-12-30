import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  get2FAStatus,
  enable2FA,
  verify2FASetup,
  disable2FA,
} from "../services/authApi";

export function use2FAStatus() {
  const {
    data: statusData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["2faStatus"],
    queryFn: get2FAStatus,
  });

  return {
    is2FAEnabled: statusData?.data?.enabled || false,
    isLoading,
    refetch,
  };
}

export function useEnable2FA() {
  const queryClient = useQueryClient();
  const { mutateAsync: enable2FAFn, isPending } = useMutation({
    mutationKey: ["enable2FA"],
    mutationFn: enable2FA,
    onSuccess(data) {
      toast.success("2FA setup initiated. Please scan the QR code.");
      queryClient.invalidateQueries({ queryKey: ["2faStatus"] });
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  return { enable2FAFn, isPending };
}

export function useVerify2FASetup() {
  const queryClient = useQueryClient();
  const { mutateAsync: verify2FASetupFn, isPending } = useMutation({
    mutationKey: ["verify2FASetup"],
    mutationFn: verify2FASetup,
    onSuccess(data) {
      toast.success("2FA enabled successfully!");
      queryClient.invalidateQueries({ queryKey: ["2faStatus"] });
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  return { verify2FASetupFn, isPending };
}

export function useDisable2FA() {
  const queryClient = useQueryClient();
  const { mutateAsync: disable2FAFn, isPending } = useMutation({
    mutationKey: ["disable2FA"],
    mutationFn: disable2FA,
    onSuccess(data) {
      toast.success("2FA disabled successfully!");
      queryClient.invalidateQueries({ queryKey: ["2faStatus"] });
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  return { disable2FAFn, isPending };
}

