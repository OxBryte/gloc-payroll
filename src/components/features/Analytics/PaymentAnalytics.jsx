import React from "react";
import { useGetWorkspace } from "../../hooks/useWorkspace";

export default function PaymentAnalytics() {
  const { workspace, isLoadingWorkspace } = useGetWorkspace();

  if (isLoadingWorkspace) {
    return (
      <div className="w-full flex bg-white border border-gray-200 rounded-lg items-center justify-center p-3">
        <div className="w-8 h-8 border-4 border-c-color border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full min-h-[180px] h-auto rounded-lg bg-gradient-to-br from-c-color to-c-bg flex flex-col items-left gap-3 p-5">
        <p className="text-sm font-medium text-white/80">Payment</p>
      </div>
    </div>
  );
}
