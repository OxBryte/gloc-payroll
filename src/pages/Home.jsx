import React from "react";
import AllWorkspace from "../components/features/AllWorkspace";
import { useAuth } from "../components/hooks/auth";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="w-full space-y-10">
      <div className="w-full flex flex-col md:flex-row gap-6">
        <div className="w-full h-[300px] rounded-lg bg-white border border-gray-300"></div>
        <div className="w-full h-[300px] rounded-lg bg-white border border-gray-300"></div>
      </div>
      <AllWorkspace />
      <div className="space-y-3 w-full"></div>
    </div>
  );
}
