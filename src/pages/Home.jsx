import React from "react";
import AllWorkspace from "../components/features/AllWorkspace";
import EmployeeAnalytics from "../components/features/Analytics/EmployeeAnalytics";
import PaymentAnalytics from "../components/features/Analytics/PaymentAnalytics";

export default function Home() {
  return (
    <div className="w-full space-y-10">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PaymentAnalytics />
        <div className="w-full min-h-[180px] h-auto rounded-lg bg-white border border-gray-200"></div>
        <EmployeeAnalytics />
      </div>
      <AllWorkspace />
      <div className="space-y-3 w-full"></div>
    </div>
  );
}
