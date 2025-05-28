import React from "react";
import AllWorkspace from "../components/features/AllWorkspace";
import EmployeeAnalytics from "../components/features/Analytics/EmployeeAnalytics";
import PaymentAnalytics from "../components/features/Analytics/PaymentAnalytics";
import TotalWorkspace from "../components/features/Analytics/TotalWorkspace";

export default function Home() {
  return (
    <div className="w-full space-y-10">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PaymentAnalytics />
        <TotalWorkspace />
        <EmployeeAnalytics />
      </div>
      <AllWorkspace />
      <div className="space-y-3 w-full"></div>
    </div>
  );
}
