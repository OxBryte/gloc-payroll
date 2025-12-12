import React, { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { useGetSingleWorkspace } from "../../hooks/useWorkspace";
import { useParams, useNavigate } from "react-router-dom";
import PayrollTable from "./PayrollTable";
import PayrollGrid from "./PayrollGrid";
import { useGetPayroll } from "../../hooks/usePayroll";
import { LayoutGrid, Table } from "lucide-react";

export default function Payroll() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { singleWorkspace } = useGetSingleWorkspace(slug);
  const { user } = useUser();
  const { payrolls, isLoadingPayroll } = useGetPayroll(singleWorkspace?.id);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between w-full gap-2 flex-wrap">
        <h1 className="text-xl font-bold text-gray-800">Payroll</h1>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          {payrolls?.length > 0 && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === "table"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                title="Table View"
              >
                <Table className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          )}

          {/* New Payroll Button */}
          {user?._id === singleWorkspace?.userId?._id && (
            <button
              className="bg-c-color text-white text-sm px-6 py-2.5 rounded-lg cursor-pointer hover:bg-c-bg transition-colors duration-200"
              onClick={() => navigate(`/workspace/${slug}/payroll/create`)}
            >
              New Payroll
            </button>
          )}
        </div>
      </div>
      {isLoadingPayroll ? (
        <div className="w-full min-h-[320px] p-6 flex gap-3 flex-col items-center justify-center bg-white">
          <img src="/loading.svg" alt="" className="w-30" />
          <p className="text-sm font-light">Loading payroll...</p>
        </div>
      ) : (
        <>
          {payrolls.length > 0 ? (
            <>
              {viewMode === "table" ? (
                <PayrollTable payrolls={payrolls} />
              ) : (
                <PayrollGrid payrolls={payrolls} />
              )}
            </>
          ) : (
            <div className="w-full min-h-[320px]  bg-white rounded-lg flex flex-col items-center justify-center gap-2 p-6">
              <img src="/empty.svg" alt="No payrolls" className="w-20" />
              <p className="text-gray-500">No payroll found.</p>
              <p className="text-gray-400 text-center text-sm">
                You can add payroll to your workspace to manage employee
                payments.
              </p>
              <span className="text-c-color text-sm font-semibold">
                Click on "New Payroll" to get started.
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
