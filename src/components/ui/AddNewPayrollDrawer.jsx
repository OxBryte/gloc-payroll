import React, { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useGetSingleWorkspace } from "../hooks/useWorkspace";
import { useCreatePayroll } from "../hooks/usePayroll";

const AddNewPayrollDrawer = ({ setIsOpen, workspaceId, slug }) => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [chain, setChain] = useState("");
  const [currency, setCurrency] = useState("");

  const { register, handleSubmit } = useForm();
  const { createPayrollFn, isPending } = useCreatePayroll();
  const { singleWorkspace } = useGetSingleWorkspace(slug);
  const employees = singleWorkspace?.employees || [];

  // Toggle employee selection
  const toggleEmployeeSelection = (employee) => {
    setSelectedEmployees((prev) => {
      const isSelected = prev.some((emp) => emp.id === employee.id);
      if (isSelected) {
        return prev.filter((emp) => emp.id !== employee.id);
      } else {
        return [...prev, employee];
      }
    });
  };

  const totalSalary = useMemo(() => {
    return selectedEmployees.reduce((total, employee) => {
      return total + (employee.salary || 0);
    }, 0);
  }, [selectedEmployees]);

  const taxRate = 0.3; // Example tax rate of 10%
  const totalTax = useMemo(() => {
    return totalSalary * taxRate;
  }, [totalSalary, taxRate]);

  const onSubmit = (data) => {
    const updatedData = {
      ...data,
      workspaceId: workspaceId,
      employeeCount: selectedEmployees?.length,
      totalSalary: totalSalary,
      tax: totalTax,
      status: "pending",
      tx: "0x8403176115a49b2081a8220b9535672b13936844818b091791929b4585119f6b",
      chain: chain,
      currency: currency,
    };
    // console.log("Form submitted with data:", updatedData);
    createPayrollFn(updatedData)
      .then(() => {
        setIsOpen(false);
        setSelectedEmployees([]);
        setChain("");
        setCurrency("");
      })
      .catch((error) => {
        console.error("Error creating payroll:", error);
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
      <div className="w-full max-w-lg bg-white h-screen overflow-y-auto shadow-2xl">
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
                    placeholder="Enter payroll title"
                    {...register("title", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Payroll Category
                  </label>
                  <select
                    defaultValue={""}
                    {...register("category", { required: true })}
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
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Currency
                  </label>
                  <div className="flex gap-3 items-center">
                    <div
                      className={`border ${
                        currency === "USDC"
                          ? "border-c-color bg-c-color/20"
                          : "border-gray-200"
                      } p-3 rounded-lg flex items-center gap-2 cursor-pointer`}
                      onClick={() => setCurrency("USDC")}
                    >
                      <img src="/usdc.svg" alt="" className="w-6" />
                      <p className="text-sm font-medium">USDC</p>
                    </div>
                    <div
                      className={`border ${
                        currency === "USDT"
                          ? "border-c-color bg-c-color/20"
                          : "border-gray-200"
                      } p-3 rounded-lg flex items-center gap-2 cursor-pointer`}
                      onClick={() => setCurrency("USDT")}
                    >
                      <img src="/usdt.svg" alt="" className="w-6" />
                      <p className="text-sm font-medium">USDT</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Chain
                  </label>
                  <div className="flex gap-3 items-center">
                    <div
                      className={`border ${
                        chain === "optimism"
                          ? "border-c-color bg-c-color/20"
                          : "border-gray-200"
                      } p-3 rounded-lg flex items-center gap-2 cursor-pointer`}
                      onClick={() => setChain("optimism")}
                    >
                      <img src="/op.svg" alt="" className="w-6" />
                      <p className="text-sm font-medium">Optimism</p>
                    </div>
                    <div
                      className={`border ${
                        chain === "arbitrum"
                          ? "border-c-color bg-c-color/20"
                          : "border-gray-200"
                      } p-3 rounded-lg flex items-center gap-2 cursor-pointer`}
                      onClick={() => setChain("arbitrum")}
                    >
                      <img src="/arb.svg" alt="" className="w-6" />
                      <p className="text-sm font-medium">Arbitrum</p>
                    </div>
                    <div
                      className={`border ${
                        chain === "base"
                          ? "border-c-color bg-c-color/20"
                          : "border-gray-200"
                      } p-3 rounded-lg flex items-center gap-2 cursor-pointer`}
                      onClick={() => setChain("base")}
                    >
                      <img src="/base.svg" alt="" className="w-6" />
                      <p className="text-sm font-medium">Base</p>
                    </div>
                  </div>
                </div>

                {/* List of employees where they can be able to selct and delect fromt ethe array */}
                <div className="space-y-3 w-full pt-2">
                  <div className="flex w-full items-center gap-5 justify-between">
                    <label className="text-sm font-medium text-gray-700 block">
                      Select Employees ({selectedEmployees.length} selected)
                    </label>
                    <div
                      onClick={() => {
                        if (selectedEmployees.length === employees.length) {
                          setSelectedEmployees([]);
                        } else {
                          setSelectedEmployees([...employees]);
                        }
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selectedEmployees.length === employees.length &&
                          employees.length > 0
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedEmployees.length === employees.length &&
                          employees.length > 0 && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                      </div>
                      <span className="text-xs text-gray-600">Select All</span>
                    </div>
                  </div>

                  {employees.length === 0 ? (
                    <div className="text-sm text-gray-500 py-4 text-center border border-gray-200 rounded-lg">
                      No employees found in this workspace
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg max-h-70 overflow-y-auto">
                      {employees.map((employee) => {
                        const isSelected = selectedEmployees.some(
                          (emp) => emp.id === employee.id
                        );
                        return (
                          <div
                            key={employee.id}
                            onClick={() => toggleEmployeeSelection(employee)}
                            className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                              isSelected ? "bg-blue-50 border-blue-200" : ""
                            }`}
                          >
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Salary: $
                                {(employee.salary || 0).toLocaleString()}
                              </div>
                              <div className="text-sm font-medium truncate w-40 text-gray-900">
                                {employee?.address}
                              </div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                isSelected
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {selectedEmployees.length > 0 && (
                  <div className="space-y-2 w-full">
                    <label className="text-sm font-medium text-gray-700 block">
                      Selected Employees Summary
                    </label>
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
                      <div className="border-b border-gray-300 py-2 flex justify-between font-semibold text-gray-900">
                        <span>Total Salary:</span>
                        <span>${totalSalary.toLocaleString()}</span>
                      </div>
                      <div className="border-b border-gray-300 py-2 flex justify-between font-semibold text-gray-900">
                        <span>Rate charge(3%):</span>
                        <span>${totalTax.toLocaleString()}</span>
                      </div>
                      <div className="py-2 flex justify-between font-semibold text-gray-900">
                        <span>Total:</span>
                        <span>
                          ${(totalTax + totalSalary).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              className="flex-1 py-4 px-6 bg-c-color text-white cursor-pointer rounded-lg text-sm font-medium hover:bg-c-bg transition-colors"
              onClick={handleSubmit(onSubmit)}
              disabled={selectedEmployees.length === 0}
            >
              {isPending ? "Sending..." : "Send Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewPayrollDrawer;
