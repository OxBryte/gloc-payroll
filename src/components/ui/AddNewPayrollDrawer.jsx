import React from "react";
import { X } from "lucide-react";

import { useForm } from "react-hook-form";

import { useCreateEmployee } from "../hooks/useEmployee";

const AddNewPayrollDrawer = ({ setIsOpen, workspaceId }) => {
  const { register, handleSubmit } = useForm();
  const { createEmployeeFn, isPending: isCreatingEmployee } =
    useCreateEmployee();

  const onSubmit = (data) => {
    const updatedData = {
      ...data,
      workspaceId: workspaceId,
    };
    createEmployeeFn(updatedData, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex h-screen">
      {/* Backdrop */}
      <div
        className="flex-1 bg-c-bg/20 backdrop-blur-xs bg-opacity-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="w-full max-w-md bg-white h-screen overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">New Payroll</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div div className="space-y-6 pl-0">
              <div className="space-y-3">
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Payroll Name/Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter payroll name"
                    {...register("name", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Payroll Category
                  </label>
                  <select
                    defaultValue={""}
                    {...register("name", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                  >
                    <option value="" disabled>
                      Select payroll name
                    </option>
                    <option value="monthly">Monthly Payroll</option>
                    <option value="bi-weekly">Bi-Weekly Payroll</option>
                    <option value="weekly">Weekly Payroll</option>
                  </select>
                </div>

               
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              className="flex-1 py-4 px-6 bg-c-color text-white cursor-pointer rounded-lg text-sm font-medium hover:bg-c-bg transition-colors"
              onClick={handleSubmit(onSubmit)}
            >
              {isCreatingEmployee ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewPayrollDrawer;
