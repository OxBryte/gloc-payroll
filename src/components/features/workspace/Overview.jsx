import React from "react";
import { useParams } from "react-router-dom";
import { useGetSingleWorkspace } from "../../hooks/useWorkspace";
import { formatNumberWithCommas } from "../../lib/utils";

export default function Overview() {
  const { slug } = useParams();
  const { singleWorkspace } = useGetSingleWorkspace(slug);

  return (
    <>
      <div className="w-full space-y-6">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="w-full min-h-[180px] h-auto rounded-lg bg-gradient-to-bl from-c-color to-black border border-gray-200 flex flex-col items-left gap-3 p-5">
            <p className="text-sm font-medium text-white/50">Payroll</p>
            <p className="font-bold text-white text-[46px]">
              ${formatNumberWithCommas(singleWorkspace?.monthlyRevenue)}
            </p>
            <p className="text-xs text-white/50">+$500 from last month</p>
          </div>
          <div className="w-full min-h-[180px] h-auto rounded-lg bg-c-color-2 border border-gray-200 flex flex-col items-left gap-3 p-5">
            <p className="text-sm font-medium text-black/50">Total Employees</p>
          </div>
          <div className="w-full min-h-[180px] h-auto rounded-lg bg-c-color-2 border border-gray-200 flex flex-col items-left gap-3 p-5">
            <p className="text-sm font-medium text-black/50">Total Employees</p>
          </div>
        </div>
        <div className="bg-c-color-2 border border-gray-200 rounded-lg h-[350px] space-y-3 w-full"></div>
      </div>
    </>
  );
}
