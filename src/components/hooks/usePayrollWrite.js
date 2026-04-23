import React, { useState, useCallback } from "react";
import { useSendTransaction, useConfig } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { encodeFunctionData, parseUnits } from "viem";
import { contractAddress, contractABI } from "../constants/contractABI";
import { base } from "@reown/appkit/networks";
import { useCreatePayroll } from "./usePayroll";
import toast from "react-hot-toast";

// USDC decimals
const USDC_DECIMALS = 6;
/**
 * Hook for payroll distribution (single recipient)
 */
export function useDistribute() {
  const [txHash, setTxHash] = useState(null);
  const [isDistributing, setIsDistributing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [distributeError, setDistributeError] = useState(null);

  // AppKit send transaction hook
  const { sendTransactionAsync } = useSendTransaction();

  const distribute = useCallback(
    async (recipient, grossAmount) => {
      try {
        setIsDistributing(true);
        setDistributeError(null);

        // Convert amount to USDC units (6 decimals)
        const amountInUnits = parseUnits(grossAmount.toString(), USDC_DECIMALS);

        // Encode the distribute function call
        const data = encodeFunctionData({
          abi: contractABI,
          functionName: "distribute",
          args: [recipient, amountInUnits],
        });

        setIsConfirming(true);

        const hash = await sendTransactionAsync({
          to: contractAddress,
          data,
          chainId: base.id,
        });

        if (hash) {
          setTxHash(hash);
          setIsSuccess(true);
          toast.success("Distribution successful");
          return hash;
        }

        throw new Error("No transaction hash returned");
      } catch (error) {
        setDistributeError(error);
        toast.error(
          error?.shortMessage || error?.message || "Failed to distribute"
        );
        throw error;
      } finally {
        setIsDistributing(false);
        setIsConfirming(false);
      }
    },
    [sendTransactionAsync]
  );

  return {
    distribute,
    isDistributing,
    isConfirming,
    isSuccess,
    txHash,
    error: distributeError,
  };
}

/**
 * Hook for bulk payroll distribution (multiple recipients)
 */
export function useDistributeBulk(payrollData = {}) {
  const [txHash, setTxHash] = useState(null);
  const [isDistributing, setIsDistributing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCreatingRecord, setIsCreatingRecord] = useState(false);
  const [distributeError, setDistributeError] = useState(null);
  const { createPayrollFn } = useCreatePayroll();

  // Wagmi hooks
  const config = useConfig();
  const { sendTransactionAsync } = useSendTransaction();

  const distributeBulk = useCallback(
    async (recipients, grossAmounts) => {
      try {
        setIsDistributing(true);
        setDistributeError(null);
        setIsSuccess(false);

        // Convert amounts to USDC units (6 decimals)
        const amountsInUnits = grossAmounts.map((amount) =>
          parseUnits(amount.toString(), USDC_DECIMALS)
        );

        // Encode the distributeBulk function call
        const data = encodeFunctionData({
          abi: contractABI,
          functionName: "distributeBulk",
          args: [recipients, amountsInUnits],
        });

        setIsConfirming(true);
        toast.loading("Waiting for wallet approval...", {
          id: "tx-confirm",
        });

        // Send transaction and get hash
        let hash;
        try {
          hash = await sendTransactionAsync({
            to: contractAddress,
            data,
            chainId: base.id,
          });
        } catch (txError) {
          console.error("Error from sendTransactionAsync:", txError);
          throw txError;
        }

        if (!hash) {
          throw new Error("Transaction was rejected or failed");
        }

        setTxHash(hash);
        toast.loading(`Transaction submitted! Waiting for confirmation...`, {
          id: "tx-confirm",
        });

        // Wait for transaction confirmation
        const receipt = await waitForTransactionReceipt(config, {
          hash,
          chainId: base.id,
        });
        if (receipt && receipt.status === "success") {
          setIsSuccess(true);
          toast.success("Transaction confirmed!", { id: "tx-confirm" });

          // Create payroll record in database after successful transaction
          if (payrollData.workspaceId) {
            setIsCreatingRecord(true);
            try {
              const payrollBody = {
                title: payrollData.title,
                category: payrollData.category,
                chain: payrollData.chain,
                currency: payrollData.currency,
                totalSalary: payrollData.totalAmount,
                tax: payrollData.totalTax,
                tx: hash,
                workspaceId: payrollData.workspaceId,
                employeeCount: payrollData.selectedEmployees?.length || 0,
              };

              await createPayrollFn(payrollBody);
              toast.success("Payroll record saved successfully!");
            } catch (error) {
              toast.error(
                error?.shortMessage ||
                  error?.message ||
                  "Transaction successful but failed to save payroll record"
              );
            } finally {
              setIsCreatingRecord(false);
            }
          }

          return hash;
        } else if (receipt && receipt.status === "reverted") {
          throw new Error("Transaction was reverted");
        }

        throw new Error("Transaction failed");
      } catch (error) {
        setDistributeError(error);

        // Check if user rejected the transaction
        const isUserRejection =
          error?.message?.includes("User rejected") ||
          error?.message?.includes("user rejected") ||
          error?.message?.includes("User denied") ||
          error?.message?.includes("rejected the request") ||
          error?.code === 4001 ||
          error?.code === "ACTION_REJECTED";

        if (isUserRejection) {
          toast.error("Transaction was rejected", { id: "tx-confirm" });
        } else {
          toast.error(
            error?.shortMessage ||
              error?.message ||
              "Failed to distribute payroll",
            { id: "tx-confirm" }
          );
        }
        throw error;
      } finally {
        setIsDistributing(false);
        setIsConfirming(false);
      }
    },
    [config, sendTransactionAsync, payrollData, createPayrollFn]
  );

  return {
    distributeBulk,
    isDistributing,
    isConfirming,
    isCreatingRecord,
    isSuccess,
    txHash,
    error: distributeError,
  };
}

/**
 * Hook for contract admin functions
 */
export function usePayrollAdmin() {
  const [txHash, setTxHash] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  // AppKit send transaction hook
  const { sendTransactionAsync } = useSendTransaction();

  // Pause contract
  const pause = useCallback(async () => {
    try {
      setIsPending(true);
      setError(null);

      const data = encodeFunctionData({
        abi: contractABI,
        functionName: "pause",
      });

      setIsConfirming(true);

      const hash = await sendTransactionAsync({
        to: contractAddress,
        data,
        chainId: base.id,
      });

      if (hash) {
        setTxHash(hash);
        setIsSuccess(true);
        toast.success("Contract paused successfully");
        return hash;
      }

      throw new Error("No transaction hash returned");
    } catch (err) {
      setError(err);
      toast.error(
        err?.shortMessage || err?.message || "Failed to pause contract"
      );
      throw err;
    } finally {
      setIsPending(false);
      setIsConfirming(false);
    }
  }, [sendTransactionAsync]);

  // Unpause contract
  const unpause = useCallback(async () => {
    try {
      setIsPending(true);
      setError(null);

      const data = encodeFunctionData({
        abi: contractABI,
        functionName: "unpause",
      });

      setIsConfirming(true);

      const hash = await sendTransactionAsync({
        to: contractAddress,
        data,
        chainId: base.id,
      });

      if (hash) {
        setTxHash(hash);
        setIsSuccess(true);
        toast.success("Contract unpaused successfully");
        return hash;
      }

      throw new Error("No transaction hash returned");
    } catch (err) {
      setError(err);
      toast.error(
        err?.shortMessage || err?.message || "Failed to unpause contract"
      );
      throw err;
    } finally {
      setIsPending(false);
      setIsConfirming(false);
    }
  }, [sendTransactionAsync]);

  // Set tax percentage
  const setTaxPercentage = useCallback(
    async (newPercentage) => {
      try {
        setIsPending(true);
        setError(null);

        const data = encodeFunctionData({
          abi: contractABI,
          functionName: "setTaxPercentage",
          args: [BigInt(newPercentage)],
        });

        setIsConfirming(true);

        const hash = await sendTransactionAsync({
          to: contractAddress,
          data,
          chainId: base.id,
        });

        if (hash) {
          setTxHash(hash);
          setIsSuccess(true);
          toast.success("Tax percentage updated successfully");
          return hash;
        }

        throw new Error("No transaction hash returned");
      } catch (err) {
        setError(err);
        toast.error(
          err?.shortMessage || err?.message || "Failed to set tax percentage"
        );
        throw err;
      } finally {
        setIsPending(false);
        setIsConfirming(false);
      }
    },
    [sendTransactionAsync]
  );

  // Emergency withdraw
  const emergencyWithdraw = useCallback(
    async (tokenAddress) => {
      try {
        setIsPending(true);
        setError(null);

        const data = encodeFunctionData({
          abi: contractABI,
          functionName: "emergencyWithdraw",
          args: [tokenAddress],
        });

        setIsConfirming(true);

        const hash = await sendTransactionAsync({
          to: contractAddress,
          data,
          chainId: base.id,
        });

        if (hash) {
          setTxHash(hash);
          setIsSuccess(true);
          toast.success("Emergency withdraw successful");
          return hash;
        }

        throw new Error("No transaction hash returned");
      } catch (err) {
        setError(err);
        toast.error(
          err?.shortMessage || err?.message || "Failed to emergency withdraw"
        );
        throw err;
      } finally {
        setIsPending(false);
        setIsConfirming(false);
      }
    },
    [sendTransactionAsync]
  );

  // Transfer ownership
  const transferOwnership = useCallback(
    async (newOwner) => {
      try {
        setIsPending(true);
        setError(null);

        const data = encodeFunctionData({
          abi: contractABI,
          functionName: "transferOwnership",
          args: [newOwner],
        });

        setIsConfirming(true);

        const hash = await sendTransactionAsync({
          to: contractAddress,
          data,
          chainId: base.id,
        });

        if (hash) {
          setTxHash(hash);
          setIsSuccess(true);
          toast.success("Ownership transferred successfully");
          return hash;
        }

        throw new Error("No transaction hash returned");
      } catch (err) {
        setError(err);
        toast.error(
          err?.shortMessage || err?.message || "Failed to transfer ownership"
        );
        throw err;
      } finally {
        setIsPending(false);
        setIsConfirming(false);
      }
    },
    [sendTransactionAsync]
  );

  // Renounce ownership
  const renounceOwnership = useCallback(async () => {
    try {
      setIsPending(true);
      setError(null);

      const data = encodeFunctionData({
        abi: contractABI,
        functionName: "renounceOwnership",
      });

      setIsConfirming(true);

      const hash = await sendTransactionAsync({
        to: contractAddress,
        data,
        chainId: base.id,
      });

      if (hash) {
        setTxHash(hash);
        setIsSuccess(true);
        toast.success("Ownership renounced successfully");
        return hash;
      }

      throw new Error("No transaction hash returned");
    } catch (err) {
      setError(err);
      toast.error(
        err?.shortMessage || err?.message || "Failed to renounce ownership"
      );
      throw err;
    } finally {
      setIsPending(false);
      setIsConfirming(false);
    }
  }, [sendTransactionAsync]);

  return {
    pause,
    unpause,
    setTaxPercentage,
    emergencyWithdraw,
    transferOwnership,
    renounceOwnership,
    isPending,
    isConfirming,
    isSuccess,
    txHash,
    error,
  };
}

/**
 * Hook for bulk employee management operations
 */
export function useBulkEmployeeOperations() {
  const [txHash, setTxHash] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [operationError, setOperationError] = useState(null);

  // AppKit send transaction hook
  const { sendTransactionAsync } = useSendTransaction();

  // Bulk employee salary updates (if contract supports it)
  const bulkUpdateSalaries = useCallback(
    async (employeeAddresses, newSalaries) => {
      try {
        setIsProcessing(true);
        setOperationError(null);
        setIsSuccess(false);

        if (employeeAddresses.length !== newSalaries.length) {
          throw new Error("Employee addresses and salaries arrays must match");
        }

        if (employeeAddresses.length === 0 || employeeAddresses.length > 20) {
          throw new Error("Must update 1-20 employees at a time");
        }

        // Convert salaries to USDC units
        const salariesInUnits = newSalaries.map((salary) =>
          parseUnits(salary.toString(), USDC_DECIMALS)
        );

        // Encode bulk update function call
        const data = encodeFunctionData({
          abi: contractABI,
          functionName: "bulkUpdateEmployeeSalaries",
          args: [employeeAddresses, salariesInUnits],
        });

        setIsConfirming(true);
        toast.loading("Processing bulk salary updates...", {
          id: "bulk-salary-update",
        });

        const hash = await sendTransactionAsync({
          to: contractAddress,
          data,
          chainId: base.id,
        });

        if (hash) {
          setTxHash(hash);
          setIsSuccess(true);
          toast.success(`Successfully updated ${employeeAddresses.length} employee salaries!`, {
            id: "bulk-salary-update",
          });
          return hash;
        }

        throw new Error("No transaction hash returned");
      } catch (error) {
        setOperationError(error);
        toast.error(
          error?.shortMessage || error?.message || "Failed to update employee salaries",
          { id: "bulk-salary-update" }
        );
        throw error;
      } finally {
        setIsProcessing(false);
        setIsConfirming(false);
      }
    },
    [sendTransactionAsync]
  );

  // Bulk employee removal
  const bulkRemoveEmployees = useCallback(
    async (employeeAddresses) => {
      try {
        setIsProcessing(true);
        setOperationError(null);
        setIsSuccess(false);

        if (employeeAddresses.length === 0 || employeeAddresses.length > 25) {
          throw new Error("Must remove 1-25 employees at a time");
        }

        // Encode bulk removal function call
        const data = encodeFunctionData({
          abi: contractABI,
          functionName: "bulkRemoveEmployees",
          args: [employeeAddresses],
        });

        setIsConfirming(true);
        toast.loading(`Removing ${employeeAddresses.length} employees...`, {
          id: "bulk-employee-removal",
        });

        const hash = await sendTransactionAsync({
          to: contractAddress,
          data,
          chainId: base.id,
        });

        if (hash) {
          setTxHash(hash);
          setIsSuccess(true);
          toast.success(`Successfully removed ${employeeAddresses.length} employees!`, {
            id: "bulk-employee-removal",
          });
          return hash;
        }

        throw new Error("No transaction hash returned");
      } catch (error) {
        setOperationError(error);
        toast.error(
          error?.shortMessage || error?.message || "Failed to remove employees",
          { id: "bulk-employee-removal" }
        );
        throw error;
      } finally {
        setIsProcessing(false);
        setIsConfirming(false);
      }
    },
    [sendTransactionAsync]
  );

  return {
    bulkUpdateSalaries,
    bulkRemoveEmployees,
    isProcessing,
    isConfirming,
    isSuccess,
    txHash,
    error: operationError,
  };
}

/**
 * Hook for bulk workspace operations
 */
export function useBulkWorkspaceOperations() {
  const [txHash, setTxHash] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [operationError, setOperationError] = useState(null);

  // AppKit send transaction hook
  const { sendTransactionAsync } = useSendTransaction();

  // Bulk admin invitations
  const bulkInviteAdmins = useCallback(
    async (adminAddresses, workspaceId) => {
      try {
        setIsProcessing(true);
        setOperationError(null);
        setIsSuccess(false);

        if (adminAddresses.length === 0 || adminAddresses.length > 15) {
          throw new Error("Must invite 1-15 admins at a time");
        }

        // Encode bulk admin invitation function call
        const data = encodeFunctionData({
          abi: contractABI,
          functionName: "bulkInviteWorkspaceAdmins",
          args: [adminAddresses, workspaceId],
        });

        setIsConfirming(true);
        toast.loading(`Inviting ${adminAddresses.length} admins...`, {
          id: "bulk-admin-invite",
        });

        const hash = await sendTransactionAsync({
          to: contractAddress,
          data,
          chainId: base.id,
        });

        if (hash) {
          setTxHash(hash);
          setIsSuccess(true);
          toast.success(`Successfully invited ${adminAddresses.length} admins!`, {
            id: "bulk-admin-invite",
          });
          return hash;
        }

        throw new Error("No transaction hash returned");
      } catch (error) {
        setOperationError(error);
        toast.error(
          error?.shortMessage || error?.message || "Failed to invite admins",
          { id: "bulk-admin-invite" }
        );
        throw error;
      } finally {
        setIsProcessing(false);
        setIsConfirming(false);
      }
    },
    [sendTransactionAsync]
  );

  // Bulk workspace fund allocation
  const bulkAllocateWorkspaceFunds = useCallback(
    async (workspaceIds, amounts) => {
      try {
        setIsProcessing(true);
        setOperationError(null);
        setIsSuccess(false);

        if (workspaceIds.length !== amounts.length) {
          throw new Error("Workspace IDs and amounts arrays must match");
        }

        if (workspaceIds.length === 0 || workspaceIds.length > 10) {
          throw new Error("Must allocate to 1-10 workspaces at a time");
        }

        // Convert amounts to USDC units
        const amountsInUnits = amounts.map((amount) =>
          parseUnits(amount.toString(), USDC_DECIMALS)
        );

        // Encode bulk fund allocation function call
        const data = encodeFunctionData({
          abi: contractABI,
          functionName: "bulkAllocateWorkspaceFunds",
          args: [workspaceIds, amountsInUnits],
        });

        setIsConfirming(true);
        toast.loading(`Allocating funds to ${workspaceIds.length} workspaces...`, {
          id: "bulk-fund-allocation",
        });

        const hash = await sendTransactionAsync({
          to: contractAddress,
          data,
          chainId: base.id,
        });

        if (hash) {
          setTxHash(hash);
          setIsSuccess(true);
          toast.success(`Successfully allocated funds to ${workspaceIds.length} workspaces!`, {
            id: "bulk-fund-allocation",
          });
          return hash;
        }

        throw new Error("No transaction hash returned");
      } catch (error) {
        setOperationError(error);
        toast.error(
          error?.shortMessage || error?.message || "Failed to allocate workspace funds",
          { id: "bulk-fund-allocation" }
        );
        throw error;
      } finally {
        setIsProcessing(false);
        setIsConfirming(false);
      }
    },
    [sendTransactionAsync]
  );

  return {
    bulkInviteAdmins,
    bulkAllocateWorkspaceFunds,
    isProcessing,
    isConfirming,
    isSuccess,
    txHash,
    error: operationError,
  };
}

/**
 * Hook for bulk job board operations
 */
export function useBulkJobOperations() {
  const [txHash, setTxHash] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [operationError, setOperationError] = useState(null);

  // AppKit send transaction hook
  const { sendTransactionAsync } = useSendTransaction();

  // Bulk job status updates
  const bulkUpdateJobStatus = useCallback(
    async (jobIds, newStatuses) => {
      try {
        setIsProcessing(true);
        setOperationError(null);
        setIsSuccess(false);

        if (jobIds.length !== newStatuses.length) {
          throw new Error("Job IDs and statuses arrays must match");
        }

        if (jobIds.length === 0 || jobIds.length > 20) {
          throw new Error("Must update 1-20 jobs at a time");
        }

        // Encode bulk job status update function call
        const data = encodeFunctionData({
          abi: contractABI,
          functionName: "bulkUpdateJobStatuses",
          args: [jobIds, newStatuses],
        });

        setIsConfirming(true);
        toast.loading(`Updating ${jobIds.length} job statuses...`, {
          id: "bulk-job-update",
        });

        const hash = await sendTransactionAsync({
          to: contractAddress,
          data,
          chainId: base.id,
        });

        if (hash) {
          setTxHash(hash);
          setIsSuccess(true);
          toast.success(`Successfully updated ${jobIds.length} job statuses!`, {
            id: "bulk-job-update",
          });
          return hash;
        }

        throw new Error("No transaction hash returned");
      } catch (error) {
        setOperationError(error);
        toast.error(
          error?.shortMessage || error?.message || "Failed to update job statuses",
          { id: "bulk-job-update" }
        );
        throw error;
      } finally {
        setIsProcessing(false);
        setIsConfirming(false);
      }
    },
    [sendTransactionAsync]
  );

  // Bulk job removal
  const bulkRemoveJobs = useCallback(
    async (jobIds) => {
      try {
        setIsProcessing(true);
        setOperationError(null);
        setIsSuccess(false);

        if (jobIds.length === 0 || jobIds.length > 25) {
          throw new Error("Must remove 1-25 jobs at a time");
        }

        // Encode bulk job removal function call
        const data = encodeFunctionData({
          abi: contractABI,
          functionName: "bulkRemoveJobs",
          args: [jobIds],
        });

        setIsConfirming(true);
        toast.loading(`Removing ${jobIds.length} jobs...`, {
          id: "bulk-job-removal",
        });

        const hash = await sendTransactionAsync({
          to: contractAddress,
          data,
          chainId: base.id,
        });

        if (hash) {
          setTxHash(hash);
          setIsSuccess(true);
          toast.success(`Successfully removed ${jobIds.length} jobs!`, {
            id: "bulk-job-removal",
          });
          return hash;
        }

        throw new Error("No transaction hash returned");
      } catch (error) {
        setOperationError(error);
        toast.error(
          error?.shortMessage || error?.message || "Failed to remove jobs",
          { id: "bulk-job-removal" }
        );
        throw error;
      } finally {
        setIsProcessing(false);
        setIsConfirming(false);
      }
    },
    [sendTransactionAsync]
  );

  return {
    bulkUpdateJobStatus,
    bulkRemoveJobs,
    isProcessing,
    isConfirming,
    isSuccess,
    txHash,
    error: operationError,
  };
}

/**
 * Hook for bulk analytics and reporting
 */
export function useBulkAnalytics() {
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);

  // Get bulk analytics for multiple workspaces
  const getBulkWorkspaceAnalytics = useCallback(
    async (workspaceIds) => {
      try {
        setIsLoading(true);
        setError(null);

        if (workspaceIds.length === 0 || workspaceIds.length > 10) {
          throw new Error("Must analyze 1-10 workspaces at a time");
        }

        // This would typically make API calls to get analytics data
        // For now, we'll simulate the bulk analytics gathering
        const analytics = await Promise.all(
          workspaceIds.map(async (workspaceId) => {
            // Simulate API calls for each workspace
            const payrollCount = Math.floor(Math.random() * 50) + 1;
            const totalPaid = Math.floor(Math.random() * 10000) + 1000;
            const employeeCount = Math.floor(Math.random() * 20) + 1;

            return {
              workspaceId,
              payrollCount,
              totalPaid,
              employeeCount,
              averageSalary: totalPaid / employeeCount,
              lastPayrollDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            };
          })
        );

        setAnalyticsData({
          totalWorkspaces: workspaceIds.length,
          totalPayrolls: analytics.reduce((sum, a) => sum + a.payrollCount, 0),
          totalPaid: analytics.reduce((sum, a) => sum + a.totalPaid, 0),
          totalEmployees: analytics.reduce((sum, a) => sum + a.employeeCount, 0),
          workspaceAnalytics: analytics,
        });

        return analytics;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get bulk employee performance metrics
  const getBulkEmployeeMetrics = useCallback(
    async (employeeAddresses) => {
      try {
        setIsLoading(true);
        setError(null);

        if (employeeAddresses.length === 0 || employeeAddresses.length > 20) {
          throw new Error("Must analyze 1-20 employees at a time");
        }

        // Simulate bulk employee metrics gathering
        const metrics = await Promise.all(
          employeeAddresses.map(async (address) => {
            const totalPaid = Math.floor(Math.random() * 5000) + 500;
            const payrollCount = Math.floor(Math.random() * 12) + 1;

            return {
              address,
              totalPaid,
              payrollCount,
              averagePayment: totalPaid / payrollCount,
              lastPaymentDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
              paymentConsistency: Math.random() > 0.2 ? "Good" : "Needs Improvement",
            };
          })
        );

        return metrics;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    getBulkWorkspaceAnalytics,
    getBulkEmployeeMetrics,
    analyticsData,
    isLoading,
    error,
  };
}
