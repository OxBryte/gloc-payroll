import React from "react";
import AllWorkspace from "../components/features/AllWorkspace";
import EmployeeAnalytics from "../components/features/Analytics/EmployeeAnalytics";
import PaymentAnalytics from "../components/features/Analytics/PaymentAnalytics";
import TotalWorkspace from "../components/features/Analytics/TotalWorkspace";
import HomeChart from "../components/features/HomeChart";

export default function Home() {
  return (
    <div className="w-full space-y-10">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PaymentAnalytics />
        <TotalWorkspace />
        <EmployeeAnalytics />
      </div>
      {/* <div className="bg-white border border-gray-200 rounded-lg h-[350px] space-y-3 w-full"> */}
        {/* <HomeChart /> */}
      {/* </div> */}
      <AllWorkspace />
    </div>
  );
}
