import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleWorkspace } from "../../hooks/useWorkspace";
import EmployeeTable from "./EmployeeTable";
import AddEmployeeDrawer from "../../ui/AddEmployeeDrawer";

export default function Employees() {
  const [isOpen, setIsOpen] = useState(false);
  const { slug } = useParams();
  const { singleWorkspace } = useGetSingleWorkspace(slug);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between w-full gap-2">
        <h1 className="text-xl font-bold text-gray-800">Employee</h1>
        <button
          className="bg-c-color text-white px-6 py-2.5 rounded-lg cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Add employee
        </button>
      </div>
      <div className="w-full">
        {singleWorkspace?.employees?.length > 0 ? (
          <EmployeeTable employees={singleWorkspace?.employees}  />
        ) : (
          <div className="w-full h-[320px] bg-white rounded-lg flex flex-col items-center justify-center gap-4 p-6">
            <img src="/empty.svg" alt="No admins" className="w-20" />
            <p className="text-gray-500">No employee found.</p>
          </div>
        )}
      </div>
      {isOpen && (
        <AddEmployeeDrawer
          setIsOpen={setIsOpen}
          workspaceId={singleWorkspace?.id}
        />
      )}
    </div>
  );
}
