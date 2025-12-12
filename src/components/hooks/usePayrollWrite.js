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
