import { useState, useCallback } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { parseUnits } from "viem";
import { contractAddress, contractABI } from "../constants/contractABI";
import { USDC_ABI } from "../constants/USDCAbi";
import { base } from "@reown/appkit/networks";
import { useCreatePayroll } from "./usePayroll";
import toast from "react-hot-toast";

// USDC contract address on Base Mainnet
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// USDC decimals
const USDC_DECIMALS = 6;

const contractConfig = {
  address: contractAddress,
  abi: contractABI,
  chainId: base.id,
};

/**
 * Hook for USDC approval
 */
export function useUSDCApproval(userAddress) {
  const [approvalHash, setApprovalHash] = useState(null);

  // Check current allowance
  const {
    data: currentAllowance,
    isLoading: isLoadingAllowance,
    refetch: refetchAllowance,
  } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "allowance",
    args: [userAddress, contractAddress],
    chainId: base.id,
    query: {
      enabled: !!userAddress,
    },
  });

  // Check USDC balance
  const {
    data: usdcBalance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [userAddress],
    chainId: base.id,
    query: {
      enabled: !!userAddress,
    },
  });

  // Write contract hook for approval
  const {
    writeContractAsync: approveAsync,
    isPending: isApproving,
    error: approvalError,
  } = useWriteContract();

  // Wait for approval transaction
  const { isLoading: isWaitingApproval, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
    });

  // Approve USDC spending
  const approveUSDC = useCallback(
    async (amount) => {
      try {
        // Convert amount to USDC units (6 decimals)
        const amountInUnits = parseUnits(amount.toString(), USDC_DECIMALS);

        const hash = await approveAsync({
          address: USDC_ADDRESS,
          abi: USDC_ABI,
          functionName: "approve",
          args: [contractAddress, amountInUnits],
          chainId: base.id,
        });

        setApprovalHash(hash);
        toast.success("USDC approval submitted");
        return hash;
      } catch (error) {
        console.error("Error approving USDC:", error);
        toast.error(error?.shortMessage || "Failed to approve USDC");
        throw error;
      }
    },
    [approveAsync]
  );

  // Check if approval is needed
  const needsApproval = useCallback(
    (requiredAmount) => {
      if (!currentAllowance) return true;
      const requiredInUnits = parseUnits(
        requiredAmount.toString(),
        USDC_DECIMALS
      );
      return currentAllowance < requiredInUnits;
    },
    [currentAllowance]
  );

  // Check if user has sufficient balance
  const hasSufficientBalance = useCallback(
    (requiredAmount) => {
      if (!usdcBalance) return false;
      const requiredInUnits = parseUnits(
        requiredAmount.toString(),
        USDC_DECIMALS
      );
      return usdcBalance >= requiredInUnits;
    },
    [usdcBalance]
  );

  return {
    currentAllowance,
    usdcBalance,
    isLoadingAllowance,
    isLoadingBalance,
    isApproving,
    isWaitingApproval,
    isApprovalSuccess,
    approvalError,
    approveUSDC,
    needsApproval,
    hasSufficientBalance,
    refetchAllowance,
    refetchBalance,
  };
}

/**
 * Hook for payroll distribution (single recipient)
 */
export function useDistribute() {
  const [txHash, setTxHash] = useState(null);

  const {
    writeContractAsync,
    isPending: isDistributing,
    error: distributeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const distribute = useCallback(
    async (recipient, grossAmount) => {
      try {
        // Convert amount to USDC units (6 decimals)
        const amountInUnits = parseUnits(grossAmount.toString(), USDC_DECIMALS);

        const hash = await writeContractAsync({
          ...contractConfig,
          functionName: "distribute",
          args: [recipient, amountInUnits],
        });

        setTxHash(hash);
        toast.success("Distribution submitted");
        return hash;
      } catch (error) {
        console.error("Error distributing:", error);
        toast.error(error?.shortMessage || "Failed to distribute");
        throw error;
      }
    },
    [writeContractAsync]
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
  const { createPayrollFn } = useCreatePayroll();

  const {
    writeContractAsync,
    isPending: isDistributing,
    error: distributeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const distributeBulk = useCallback(
    async (recipients, grossAmounts) => {
      try {
        // Convert amounts to USDC units (6 decimals)
        const amountsInUnits = grossAmounts.map((amount) =>
          parseUnits(amount.toString(), USDC_DECIMALS)
        );

        const hash = await writeContractAsync({
          ...contractConfig,
          functionName: "distributeBulk",
          args: [recipients, amountsInUnits],
        });

        setTxHash(hash);
        toast.success("Bulk distribution submitted");

        // Create payroll record in database after successful transaction
        if (payrollData.workspaceId) {
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
            toast.success("Payroll record created successfully");
          } catch (error) {
            console.error("Error creating payroll record:", error);
            toast.error(
              "Transaction successful but failed to save payroll record"
            );
          }
        }

        return hash;
      } catch (error) {
        console.error("Error distributing bulk:", error);
        toast.error(error?.shortMessage || "Failed to distribute payroll");
        throw error;
      }
    },
    [writeContractAsync, payrollData, createPayrollFn]
  );

  return {
    distributeBulk,
    isDistributing,
    isConfirming,
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

  const {
    writeContractAsync,
    isPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Pause contract
  const pause = useCallback(async () => {
    try {
      const hash = await writeContractAsync({
        ...contractConfig,
        functionName: "pause",
      });
      setTxHash(hash);
      toast.success("Pause transaction submitted");
      return hash;
    } catch (error) {
      console.error("Error pausing contract:", error);
      toast.error(error?.shortMessage || "Failed to pause contract");
      throw error;
    }
  }, [writeContractAsync]);

  // Unpause contract
  const unpause = useCallback(async () => {
    try {
      const hash = await writeContractAsync({
        ...contractConfig,
        functionName: "unpause",
      });
      setTxHash(hash);
      toast.success("Unpause transaction submitted");
      return hash;
    } catch (error) {
      console.error("Error unpausing contract:", error);
      toast.error(error?.shortMessage || "Failed to unpause contract");
      throw error;
    }
  }, [writeContractAsync]);

  // Set tax percentage
  const setTaxPercentage = useCallback(
    async (newPercentage) => {
      try {
        const hash = await writeContractAsync({
          ...contractConfig,
          functionName: "setTaxPercentage",
          args: [BigInt(newPercentage)],
        });
        setTxHash(hash);
        toast.success("Tax percentage update submitted");
        return hash;
      } catch (error) {
        console.error("Error setting tax percentage:", error);
        toast.error(error?.shortMessage || "Failed to set tax percentage");
        throw error;
      }
    },
    [writeContractAsync]
  );

  // Emergency withdraw
  const emergencyWithdraw = useCallback(
    async (tokenAddress) => {
      try {
        const hash = await writeContractAsync({
          ...contractConfig,
          functionName: "emergencyWithdraw",
          args: [tokenAddress],
        });
        setTxHash(hash);
        toast.success("Emergency withdraw submitted");
        return hash;
      } catch (error) {
        console.error("Error emergency withdraw:", error);
        toast.error(error?.shortMessage || "Failed to emergency withdraw");
        throw error;
      }
    },
    [writeContractAsync]
  );

  // Transfer ownership
  const transferOwnership = useCallback(
    async (newOwner) => {
      try {
        const hash = await writeContractAsync({
          ...contractConfig,
          functionName: "transferOwnership",
          args: [newOwner],
        });
        setTxHash(hash);
        toast.success("Ownership transfer submitted");
        return hash;
      } catch (error) {
        console.error("Error transferring ownership:", error);
        toast.error(error?.shortMessage || "Failed to transfer ownership");
        throw error;
      }
    },
    [writeContractAsync]
  );

  // Renounce ownership
  const renounceOwnership = useCallback(async () => {
    try {
      const hash = await writeContractAsync({
        ...contractConfig,
        functionName: "renounceOwnership",
      });
      setTxHash(hash);
      toast.success("Renounce ownership submitted");
      return hash;
    } catch (error) {
      console.error("Error renouncing ownership:", error);
      toast.error(error?.shortMessage || "Failed to renounce ownership");
      throw error;
    }
  }, [writeContractAsync]);

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

