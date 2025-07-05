import React, { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleWorkspace } from "../components/hooks/useWorkspace";
import ConnectButtonThirdweb from "../components/ui/ConnectButtonThirdweb";

const CreatePayroll = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [chain, setChain] = useState("base");
  const [currency, setCurrency] = useState("USDC");

  const {
    register,
    watch,
    formState: { errors },
  } = useForm();
  const { singleWorkspace } = useGetSingleWorkspace(slug);
  const employees = singleWorkspace?.employees || [];

  // Watch form values
  const title = watch("title");
  const category = watch("category");

  // Validation check
  const isFormValid = title && category && selectedEmployees.length > 0;

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

  const taxRate = 0.03; // Example tax rate of 3%
  const totalTax = useMemo(() => {
    return totalSalary * taxRate;
  }, [totalSalary, taxRate]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(`/workspace/${slug}/payroll`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Payroll
          </h1>
          <p className="text-gray-600">
            Set up a new payroll for your workspace
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Payroll Details</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Payroll Name/Title
                </label>
                <input
                  type="text"
                  placeholder="Enter payroll title"
                  {...register("title", { required: "Title is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Payroll Category
                </label>
                <select
                  defaultValue={""}
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                >
                  <option value="" disabled>
                    Select payroll category
                  </option>
                  <option value="monthly">Monthly Payroll</option>
                  <option value="bi-weekly">Bi-Weekly Payroll</option>
                  <option value="weekly">Weekly Payroll</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Blockchain Network
                </label>
                <div className="flex flex-wrap gap-3 items-center">
                  <div
                    className={`border ${
                      chain === "arbitrum"
                        ? "border-c-color bg-c-color/20"
                        : "border-gray-200"
                    } p-3 rounded-lg flex items-center gap-2 cursor-not-allowed opacity-50`}
                    title="Coming soon"
                    style={{ pointerEvents: "none" }}
                    disabled
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
                  <div
                    className={`border ${
                      chain === "optimism"
                        ? "border-c-color bg-c-color/20"
                        : "border-gray-200"
                    } p-3 rounded-lg flex items-center gap-2 cursor-not-allowed opacity-50`}
                    title="Coming soon"
                    style={{ pointerEvents: "none" }}
                    disabled
                  >
                    <img src="/op.svg" alt="" className="w-6" />
                    <p className="text-sm font-medium">Optimism</p>
                  </div>
                  <div
                    className={`border ${
                      chain === "celo"
                        ? "border-c-color bg-c-color/20"
                        : "border-gray-200"
                    } p-3 rounded-lg flex items-center gap-2 cursor-not-allowed opacity-50`}
                    title="Coming soon"
                    style={{ pointerEvents: "none" }}
                    disabled
                  >
                    <img src="/celo.svg" alt="" className="w-6" />
                    <p className="text-sm font-medium">Celo</p>
                  </div>
                  <div
                    className={`border ${
                      chain === "starknet"
                        ? "border-c-color bg-c-color/20"
                        : "border-gray-200"
                    } p-3 rounded-lg flex items-center gap-2 cursor-not-allowed opacity-50`}
                    title="Coming soon"
                    style={{ pointerEvents: "none" }}
                    disabled
                  >
                    <img src="/starknet.svg" alt="" className="w-6" />
                    <p className="text-sm font-medium">Starknet</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Payment Currency
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
                    } p-3 rounded-lg flex items-center gap-2 cursor-not-allowed opacity-50`}
                    title="Coming soon"
                    style={{ pointerEvents: "none" }}
                    disabled
                  >
                    <img src="/usdt.svg" alt="" className="w-6" />
                    <p className="text-sm font-medium">USDT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Select Employees</h2>
            <div className="space-y-3">
              {employees.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No employees found in this workspace
                </p>
              ) : (
                employees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedEmployees.some((emp) => emp.id === employee.id)
                        ? "border-c-color bg-c-color/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleEmployeeSelection(employee)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          <img
                            src={employee.avatar || "/default-avatar.png"}
                            alt={employee.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-gray-600">
                            {employee.role}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${employee.salary?.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Monthly</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Payment */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Payroll Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Employees:</span>
                <span className="font-medium">{selectedEmployees.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Salary:</span>
                <span className="font-medium">
                  ${totalSalary.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (3%):</span>
                <span className="font-medium">
                  ${totalTax.toLocaleString()}
                </span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>${(totalSalary + totalTax).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Payment</h2>
            <ConnectButtonThirdweb
              selectedEmployees={selectedEmployees}
              totalTax={totalTax}
              title={title}
              category={category}
              chain={chain}
              currency={currency}
              totalAmount={totalSalary + totalTax}
              workspaceId={singleWorkspace?.id}
              isFormValid={isFormValid}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePayroll;
