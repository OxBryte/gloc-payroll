import { Calculator, Search } from "lucide-react";
import React from "react";
import { useUser } from "../../hooks/useUser";
import { useGetSingleWorkspace } from "../../hooks/useWorkspace";
import { useParams } from "react-router-dom";
import PayrollTable from "./PayrollTable";

export default function Payroll() {
  const { slug } = useParams();
  const { singleWorkspace } = useGetSingleWorkspace(slug);
  const { user } = useUser();

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between w-full gap-2">
          <h1 className="text-xl font-bold text-gray-800">Payroll</h1>
          {user?._id === singleWorkspace?.userId?._id && (
            <button className="bg-c-color text-white px-6 py-2.5 rounded-lg cursor-pointer flex gap-2 items-center hover:bg-c-bg transition-colors duration-200">
              <Calculator />
              New Payroll
            </button>
          )}
        </div>
        {singleWorkspace?.payrolls?.length > 0 ? (
          <PayrollTable payrolls={singleWorkspace?.payrolls} />
        ) : (
          <div className="w-full min-h-[320px]  bg-white rounded-lg flex flex-col items-center justify-center gap-2 p-6">
            <img src="/empty.svg" alt="No admins" className="w-20" />
            <p className="text-gray-500">No payroll found.</p>
            <p className="text-gray-400 text-sm">
              You can add payroll to your workspace to manage employee payments.
            </p>
            <span className="text-c-color text-sm font-semibold">
              Click on "New Payroll" to get started.
            </span>
          </div>
        )}
      </div>
    </>
  );
}
