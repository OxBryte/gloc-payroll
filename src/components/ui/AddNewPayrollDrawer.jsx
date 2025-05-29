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
          <h2 className="text-xl font-semibold text-gray-900">
            Add new employee
          </h2>
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
                    Employee name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter workspace name"
                    {...register("name", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Employee email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter employee email"
                    {...register("email", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Employee role
                  </label>
                  <input
                    type="text"
                    placeholder="Enter employee role"
                    {...register("role", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                  />
                </div>

                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Employment date
                  </label>
                  <input
                    type="date"
                    placeholder="Enter employee salary (USD)"
                    {...register("employmentDate", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Salary (Monthly)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter employee salary (USD)"
                    {...register("salary", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Employment type
                  </label>
                  <select
                    {...register("employmentType", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                  >
                    <option value="" disabled selected>
                      Select employment type
                    </option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Internship</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
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
