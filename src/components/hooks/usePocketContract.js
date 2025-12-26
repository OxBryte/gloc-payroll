import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { pocketContractAddress, pocketContractABI } from "../constants/pocketCotract.js";
import { parseUnits, formatUnits } from "viem";
import toast from "react-hot-toast";

/**
 * Hook to interact with the Pocket smart contract
 * Handles deposits, category management, locking, and withdrawals
 */
export function usePocketContract() {
  const { address, isConnected } = useAccount();

  // Write contract hook
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

  // Wait for transaction receipt
  const {
    isLoading: isConfirming,
    isSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // ========== READ FUNCTIONS ==========

  // Get contract owner
  const {
    data: owner,
    isLoading: isLoadingOwner,
    refetch: refetchOwner,
  } = useReadContract({
    address: pocketContractAddress,
    abi: pocketContractABI,
    functionName: "owner",
  });

  // Get paused status
  const {
    data: isPaused,
    isLoading: isLoadingPaused,
    refetch: refetchPaused,
  } = useReadContract({
    address: pocketContractAddress,
    abi: pocketContractABI,
    functionName: "paused",
  });

  // Get USDC token address
  const {
    data: usdcTokenAddress,
    isLoading: isLoadingUsdcToken,
    refetch: refetchUsdcToken,
  } = useReadContract({
    address: pocketContractAddress,
    abi: pocketContractABI,
    functionName: "usdcToken",
  });

  // Get user's unallocated balance
  const {
    data: unallocatedBalance,
    isLoading: isLoadingUnallocatedBalance,
    refetch: refetchUnallocatedBalance,
  } = useReadContract({
    address: pocketContractAddress,
    abi: pocketContractABI,
    functionName: "unallocatedBalance",
    args: address ? [address] : undefined,
    enabled: !!address && isConnected,
  });

  // Get user's categories
  const {
    data: userCategories,
    isLoading: isLoadingUserCategories,
    refetch: refetchUserCategories,
  } = useReadContract({
    address: pocketContractAddress,
    abi: pocketContractABI,
    functionName: "getUserCategories",
    args: address ? [address] : undefined,
    enabled: !!address && isConnected,
  });

  // ========== WRITE FUNCTIONS ==========

  /**
   * Deposit USDC to the contract
   * @param {string} amount - Amount in USDC (e.g., "100.5" for 100.5 USDC)
   */
  const deposit = async (amount) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const amountInWei = parseUnits(amount.toString(), 6); // USDC has 6 decimals

      writeContract(
        {
          address: pocketContractAddress,
          abi: pocketContractABI,
          functionName: "deposit",
          args: [amountInWei],
        },
        {
          onSuccess: () => {
            toast.success("Deposit transaction submitted!");
          },
          onError: (error) => {
            toast.error(`Deposit failed: ${error.message}`);
          },
        }
      );
    } catch (error) {
      toast.error(`Error preparing deposit: ${error.message}`);
    }
  };

  /**
   * Create a new category
   * @param {string} categoryName - Name of the category
   */
  const createCategory = async (categoryName) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      writeContract(
        {
          address: pocketContractAddress,
          abi: pocketContractABI,
          functionName: "createCategory",
          args: [categoryName],
        },
        {
          onSuccess: () => {
            toast.success("Category creation submitted!");
          },
          onError: (error) => {
            toast.error(`Category creation failed: ${error.message}`);
          },
        }
      );
    } catch (error) {
      toast.error(`Error creating category: ${error.message}`);
    }
  };

  /**
   * Allocate funds to a category
   * @param {string} categoryName - Name of the category
   * @param {string} amount - Amount in USDC (e.g., "100.5" for 100.5 USDC)
   */
  const allocateToCategory = async (categoryName, amount) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const amountInWei = parseUnits(amount.toString(), 6);

      writeContract(
        {
          address: pocketContractAddress,
          abi: pocketContractABI,
          functionName: "allocateToCategory",
          args: [categoryName, amountInWei],
        },
        {
          onSuccess: () => {
            toast.success("Allocation submitted!");
          },
          onError: (error) => {
            toast.error(`Allocation failed: ${error.message}`);
          },
        }
      );
    } catch (error) {
      toast.error(`Error allocating funds: ${error.message}`);
    }
  };

  /**
   * Lock a category for a specific duration
   * @param {string} categoryName - Name of the category
   * @param {number} durationInSeconds - Duration in seconds
   */
  const lockCategory = async (categoryName, durationInSeconds) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      writeContract(
        {
          address: pocketContractAddress,
          abi: pocketContractABI,
          functionName: "lockCategory",
          args: [categoryName, BigInt(durationInSeconds)],
        },
        {
          onSuccess: () => {
            toast.success("Category lock submitted!");
          },
          onError: (error) => {
            toast.error(`Lock failed: ${error.message}`);
          },
        }
      );
    } catch (error) {
      toast.error(`Error locking category: ${error.message}`);
    }
  };

  /**
   * Withdraw from a category
   * @param {string} categoryName - Name of the category
   * @param {string} amount - Amount in USDC (e.g., "100.5" for 100.5 USDC)
   */
  const withdrawFromCategory = async (categoryName, amount) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const amountInWei = parseUnits(amount.toString(), 6);

      writeContract(
        {
          address: pocketContractAddress,
          abi: pocketContractABI,
          functionName: "withdrawFromCategory",
          args: [categoryName, amountInWei],
        },
        {
          onSuccess: () => {
            toast.success("Withdrawal submitted!");
          },
          onError: (error) => {
            toast.error(`Withdrawal failed: ${error.message}`);
          },
        }
      );
    } catch (error) {
      toast.error(`Error withdrawing: ${error.message}`);
    }
  };

  /**
   * Get category details (read function that can be called on demand)
   * Note: This is a view function, so it's read-only
   */
  const getCategoryDetails = async (categoryName) => {
    if (!isConnected || !address) {
      return null;
    }

    // This would need to be called via a read contract hook or direct contract call
    // For now, return a function that can be used with useReadContract
    return {
      categoryName,
      address,
    };
  };

  // ========== ADMIN FUNCTIONS ==========

  /**
   * Pause the contract (admin only)
   */
  const pause = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      writeContract(
        {
          address: pocketContractAddress,
          abi: pocketContractABI,
          functionName: "pause",
        },
        {
          onSuccess: () => {
            toast.success("Pause transaction submitted!");
          },
          onError: (error) => {
            toast.error(`Pause failed: ${error.message}`);
          },
        }
      );
    } catch (error) {
      toast.error(`Error pausing contract: ${error.message}`);
    }
  };

  /**
   * Unpause the contract (admin only)
   */
  const unpause = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      writeContract(
        {
          address: pocketContractAddress,
          abi: pocketContractABI,
          functionName: "unpause",
        },
        {
          onSuccess: () => {
            toast.success("Unpause transaction submitted!");
          },
          onError: (error) => {
            toast.error(`Unpause failed: ${error.message}`);
          },
        }
      );
    } catch (error) {
      toast.error(`Error unpausing contract: ${error.message}`);
    }
  };

  // Handle transaction success
  if (isSuccess && hash) {
    toast.success("Transaction confirmed!");
    // Refetch relevant data
    refetchUnallocatedBalance();
    refetchUserCategories();
  }

  // Handle transaction errors
  if (txError) {
    toast.error(`Transaction failed: ${txError.message}`);
  }

  return {
    // Read data
    owner,
    isPaused,
    usdcTokenAddress,
    unallocatedBalance: unallocatedBalance
      ? formatUnits(unallocatedBalance, 6)
      : "0",
    userCategories: userCategories || [],

    // Loading states
    isLoadingOwner,
    isLoadingPaused,
    isLoadingUsdcToken,
    isLoadingUnallocatedBalance,
    isLoadingUserCategories,

    // Write functions
    deposit,
    createCategory,
    allocateToCategory,
    lockCategory,
    withdrawFromCategory,
    getCategoryDetails,

    // Admin functions
    pause,
    unpause,

    // Transaction states
    isPending,
    isConfirming,
    isSuccess,
    txHash: hash,
    error: writeError || txError,

    // Refetch functions
    refetchOwner,
    refetchPaused,
    refetchUsdcToken,
    refetchUnallocatedBalance,
    refetchUserCategories,
  };
}

/**
 * Hook to get category details for a specific user and category
 * @param {string} userAddress - User's wallet address
 * @param {string} categoryName - Name of the category
 */
export function useCategoryDetails(userAddress, categoryName) {
  const {
    data: categoryData,
    isLoading,
    refetch,
  } = useReadContract({
    address: pocketContractAddress,
    abi: pocketContractABI,
    functionName: "getCategoryDetails",
    args: userAddress && categoryName ? [userAddress, categoryName] : undefined,
    enabled: !!userAddress && !!categoryName,
  });

  return {
    balance: categoryData?.[0] ? formatUnits(categoryData[0], 6) : "0",
    unlockTime: categoryData?.[1] ? Number(categoryData[1]) : null,
    isLoading,
    refetch,
  };
}

/**
 * Hook to get user categories list
 * @param {string} userAddress - User's wallet address
 */
export function useUserCategories(userAddress) {
  const {
    data: categories,
    isLoading,
    refetch,
  } = useReadContract({
    address: pocketContractAddress,
    abi: pocketContractABI,
    functionName: "getUserCategories",
    args: userAddress ? [userAddress] : undefined,
    enabled: !!userAddress,
  });

  return {
    categories: categories || [],
    isLoading,
    refetch,
  };
}

