import React from "react";
import { useGetWorkspace } from "../../hooks/useWorkspace";

export default function PaymentAnalytics() {
  const { isLoadingWorkspace } = useGetWorkspace();

  if (isLoadingWorkspace) {
    return (
      <div className="w-full flex bg-white min-h-[180px] border border-gray-200 rounded-lg items-center justify-center p-3">
        <div className="w-8 h-8 border-4 border-c-color border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full min-h-[180px] h-auto rounded-lg bg-gradient-to-bl from-c-color to-black flex flex-col items-left gap-3 p-5">
        <p className="text-sm font-medium text-white/80">Payment</p>
        <div className="w-full flex items-center justify-between">
          <div className="space-y-2">
            <p className="font-bold text-[46px] text-white">$10,000</p>
            <span className="text-white/80 text-xs">
              Mothly revenue (Transactions)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
