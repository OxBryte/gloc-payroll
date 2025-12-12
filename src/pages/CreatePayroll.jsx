import React, { useMemo, useState } from "react";
import { ChevronLeft, Check, Loader2, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleWorkspace } from "../components/hooks/useWorkspace";
import {
  truncateAddress,
  formatNumberWithCommas,
} from "../components/lib/utils";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import { useDistributeBulk } from "../components/hooks/usePayrollWrite";
import toast from "react-hot-toast";
import { useApproveUsdc } from "../components/hooks/useApproveUsdc";

const CreatePayroll = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [chain, setChain] = useState("base");
  const [currency, setCurrency] = useState("USDC");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(""); // "approving" | "distributing" | ""

  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();

  const handleDisconnect = async () => {
    await disconnect();
    toast.success("Disconnected from wallet");
  };

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

  // Calculate totals
  const totalSalary = useMemo(() => {
    return selectedEmployees.reduce((total, employee) => {
      return total + (employee.salary || 0);
    }, 0);
  }, [selectedEmployees]);

  const taxRate = 0.03; // 3% tax rate
  const totalTax = useMemo(() => {
    return totalSalary * taxRate;
  }, [totalSalary, taxRate]);

  const totalAmount = totalSalary + totalTax;

  // Payroll data for the hook
  const payrollData = useMemo(
    () => ({
      title,
      category,
      chain,
      currency,
      totalAmount,
      totalTax,
      workspaceId: singleWorkspace?.id,
      selectedEmployees,
    }),
    [
      title,
      category,
      chain,
      currency,
      totalAmount,
      totalTax,
      singleWorkspace?.id,
      selectedEmployees,
    ]
  );

  // USDC Approval hook
  const {
    usdcBalance, // This is now a formatted string
    isApproving,
    approveUsdc,
    needsApproval,
    hasSufficientBalance,
    refetchAllowance,
  } = useApproveUsdc(address, isConnected);

  // Distribution hook
  const {
    distributeBulk,
    isDistributing,
    isConfirming,
    isCreatingRecord,
    isSuccess,
    txHash,
  } = useDistributeBulk(payrollData);

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

  // Handle payroll distribution with approval flow
  const handleDistributePayroll = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      open();
      return;
    }

    if (!isFormValid) {
      toast.error("Please fill in all required fields and select employees");
      return;
    }

    // Check if all selected employees have wallet addresses
    const employeesWithoutAddress = selectedEmployees.filter(
      (emp) => !emp.address || emp.address === "N/A"
    );
    if (employeesWithoutAddress.length > 0) {
      toast.error(
        `${employeesWithoutAddress.length} employee(s) don't have wallet addresses`
      );
      return;
    }

    // Check sufficient balance
    if (!hasSufficientBalance(totalAmount)) {
      toast.error("Insufficient USDC balance");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Check and approve USDC if needed
      if (needsApproval(totalAmount)) {
        setCurrentStep("approving");
        toast.loading("Approving USDC...", { id: "approval" });

        await approveUsdc(totalAmount);

        // Wait for approval to be confirmed
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await refetchAllowance();

        toast.success("USDC approved successfully", { id: "approval" });
      }

      // Step 2: Distribute payroll
      setCurrentStep("distributing");
      toast.loading("Processing payroll distribution...", { id: "distribute" });

      // Prepare recipients and amounts
      const recipients = selectedEmployees.map((emp) => emp.address);
      const grossAmounts = selectedEmployees.map((emp) => emp.salary);

      await distributeBulk(recipients, grossAmounts);

      toast.success("Payroll distributed successfully!", { id: "distribute" });

      // Reset and navigate back
      setTimeout(() => {
        navigate(`/workspace/${slug}/payroll`);
      }, 2000);
    } catch (error) {
      console.error("Error in payroll distribution:", error);
      toast.error(error?.message, {
        id: currentStep === "approving" ? "approval" : "distribute",
      });
    } finally {
      setIsProcessing(false);
      setCurrentStep("");
    }
  };

  // Get button text based on state
  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet";
    if (isApproving) return "Approving USDC...";
    if (isDistributing) return "Submitting Transaction...";
    if (isConfirming) return "Confirming Transaction...";
    if (isCreatingRecord) return "Saving Payroll Record...";
    if (isProcessing)
      return currentStep === "approving" ? "Approving..." : "Processing...";
    if (needsApproval(totalAmount) && totalAmount > 0)
      return "Approve & Distribute";
    return "Distribute Payroll";
  };

  const isButtonDisabled =
    !isConnected ||
    !isFormValid ||
    isProcessing ||
    isApproving ||
    isDistributing ||
    isConfirming ||
    isCreatingRecord;

  return (
    <div className="max-w-full mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-fit border border-gray-200 p-3 rounded-lg hover:bg-white cursor-pointer"
          onClick={() => navigate(`/workspace/${slug}/payroll`)}
        >
          <ChevronLeft size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Payroll
          </h1>
          <p className="text-gray-600">
            Set up a new payroll for your workspace
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative h-full">
        {/* Left Column - Form */}
        <div className="space-y-6 w-full">
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Select Employees</h2>
              <div
                onClick={() => {
                  if (
                    selectedEmployees?.length === employees?.length &&
                    employees?.length > 0
                  ) {
                    setSelectedEmployees([]);
                  } else {
                    setSelectedEmployees(employees ? [...employees] : []);
                  }
                }}
                className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-800"
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    selectedEmployees?.length === employees?.length &&
                    employees?.length > 0
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedEmployees?.length === employees?.length &&
                    employees?.length > 0 && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                </div>
                <span className="text-sm">Select All</span>
              </div>
            </div>
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
                        <div>
                          <p className="font-medium capitalize">
                            {employee.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {employee.role}
                          </p>
                          <p className="text-sm text-gray-600">
                            {truncateAddress(employee.address)}
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
        <div className="space-y-6 md:sticky top-[100px] max-w-[400px] w-full h-full">
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
              <hr className="my-3 border-gray-200" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>${(totalSalary + totalTax).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Payment</h2>

              {isConnected ? (
                <div className="flex items-center gap-2">
                  <div
                    className="w-fit bg-c-color/10 text-xs px-3 py-2 rounded-lg cursor-pointer"
                    onClick={() => open({ view: "Account" })}
                  >
                    <div className="w-2 h-2 bg-c-color rounded-full inline-block mr-2"></div>
                    {truncateAddress(address)}
                  </div>
                  <div
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
                    onClick={handleDisconnect}
                  >
                    <LogOut className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div
                  className="w-fit bg-c-color text-white text-xs px-3 py-2 rounded-lg cursor-pointer"
                  onClick={() => open()}
                >
                  Connect Wallet
                </div>
              )}
            </div>

            {/* USDC Balance Display */}
            {isConnected && usdcBalance !== undefined && (
              <div className="flex justify-between text-sm bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-600">Your USDC Balance:</span>
                <span className="font-medium">${usdcBalance}</span>
              </div>
            )}

            {/* Insufficient Balance Warning */}
            {isConnected &&
              totalAmount > 0 &&
              !hasSufficientBalance(totalAmount) && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  Insufficient USDC balance. You need $
                  {formatNumberWithCommas(totalAmount)} USDC.
                </div>
              )}

            {/* Transaction Success */}
            {isSuccess && txHash && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <p className="font-medium">Transaction successful!</p>
                <a
                  href={`https://basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-xs"
                >
                  View on BaseScan
                </a>
              </div>
            )}

            <button
              className={`w-full text-white text-center font-medium px-2 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-c-color hover:bg-c-color/80 cursor-pointer"
              }`}
              onClick={handleDistributePayroll}
              disabled={isButtonDisabled}
            >
              {(isProcessing ||
                isApproving ||
                isDistributing ||
                isConfirming ||
                isCreatingRecord) && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {getButtonText()}
            </button>

            {/* Approval Status */}
            {isConnected && needsApproval(totalAmount) && totalAmount > 0 && (
              <p className="text-xs text-gray-500 text-center">
                You'll need to approve USDC spending before distribution
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePayroll;
