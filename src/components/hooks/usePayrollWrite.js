import React, { useState, useCallback } from "react";
import { useSendTransaction } from "wagmi";
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
  const { sendTransaction } = useSendTransaction();

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

        const hash = await sendTransaction({
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
        console.error("Error distributing:", error);
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
    [sendTransaction]
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

  // AppKit send transaction hook
  const { sendTransaction } = useSendTransaction();

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
        toast.loading("Waiting for transaction confirmation...", {
          id: "tx-confirm",
        });

        const hash = await sendTransaction({
          to: contractAddress,
          data,
          chainId: base.id,
        });

        if (hash) {
          setTxHash(hash);
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

              console.log("Creating payroll record:", payrollBody);
              await createPayrollFn(payrollBody);
              toast.success("Payroll record saved successfully!");
            } catch (error) {
              console.error("Error creating payroll record:", error);
              toast.error(
                "Transaction successful but failed to save payroll record"
              );
            } finally {
              setIsCreatingRecord(false);
            }
          }

          return hash;
        }

        throw new Error("No transaction hash returned");
      } catch (error) {
        console.error("Error distributing bulk:", error);
        setDistributeError(error);
        toast.error(
          error?.shortMessage ||
            error?.message ||
            "Failed to distribute payroll",
          { id: "tx-confirm" }
        );
        throw error;
      } finally {
        setIsDistributing(false);
        setIsConfirming(false);
      }
    },
    [sendTransaction, payrollData, createPayrollFn]
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
  const { sendTransaction } = useSendTransaction();

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

      const hash = await sendTransaction({
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
      console.error("Error pausing contract:", err);
      setError(err);
      toast.error(
        err?.shortMessage || err?.message || "Failed to pause contract"
      );
      throw err;
    } finally {
      setIsPending(false);
      setIsConfirming(false);
    }
  }, [sendTransaction]);

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

      const hash = await sendTransaction({
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
      console.error("Error unpausing contract:", err);
      setError(err);
      toast.error(
        err?.shortMessage || err?.message || "Failed to unpause contract"
      );
      throw err;
    } finally {
      setIsPending(false);
      setIsConfirming(false);
    }
  }, [sendTransaction]);

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

        const hash = await sendTransaction({
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
        console.error("Error setting tax percentage:", err);
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
    [sendTransaction]
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

        const hash = await sendTransaction({
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
        console.error("Error emergency withdraw:", err);
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
    [sendTransaction]
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

        const hash = await sendTransaction({
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
        console.error("Error transferring ownership:", err);
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
    [sendTransaction]
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

      const hash = await sendTransaction({
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
      console.error("Error renouncing ownership:", err);
      setError(err);
      toast.error(
        err?.shortMessage || err?.message || "Failed to renounce ownership"
      );
      throw err;
    } finally {
      setIsPending(false);
      setIsConfirming(false);
    }
  }, [sendTransaction]);

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
