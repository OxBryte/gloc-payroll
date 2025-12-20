import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constants/contractABI";

const contractConfig = {
  address: contractAddress,
  abi: contractABI,
};

/**
 * Hook to read payroll contract data
 */
export function usePayrollRead() {
  // Get contract owner
  const {
    data: owner,
    isLoading: isLoadingOwner,
    refetch: refetchOwner,
  } = useReadContract({
    ...contractConfig,
    functionName: "owner",
  });

  // Get USDC token address
  const {
    data: usdcTokenAddress,
    isLoading: isLoadingUsdcToken,
    refetch: refetchUsdcToken,
  } = useReadContract({
    ...contractConfig,
    functionName: "getUSDCAddress",
  });

  // Get tax collector address
  const {
    data: taxCollector,
    isLoading: isLoadingTaxCollector,
    refetch: refetchTaxCollector,
  } = useReadContract({
    ...contractConfig,
    functionName: "getTaxCollector",
  });

  // Get tax percentage
  const {
    data: taxPercentage,
    isLoading: isLoadingTaxPercentage,
    refetch: refetchTaxPercentage,
  } = useReadContract({
    ...contractConfig,
    functionName: "taxPercentage",
  });

  // Get max tax percentage
  const { data: maxTaxPercentage, isLoading: isLoadingMaxTaxPercentage } =
    useReadContract({
      ...contractConfig,
      functionName: "MAX_TAX_PERCENTAGE",
    });

  // Get paused status
  const {
    data: isPaused,
    isLoading: isLoadingPaused,
    refetch: refetchPaused,
  } = useReadContract({
    ...contractConfig,
    functionName: "paused",
  });

  // Get total tax collected
  const {
    data: totalTaxCollected,
    isLoading: isLoadingTotalTaxCollected,
    refetch: refetchTotalTaxCollected,
  } = useReadContract({
    ...contractConfig,
    functionName: "totalTaxCollected",
  });

  // Get total gross distributed
  const {
    data: totalGrossDistributed,
    isLoading: isLoadingTotalGrossDistributed,
    refetch: refetchTotalGrossDistributed,
  } = useReadContract({
    ...contractConfig,
    functionName: "totalGrossDistributed",
  });

  // Get total net distributed
  const {
    data: totalNetDistributed,
    isLoading: isLoadingTotalNetDistributed,
    refetch: refetchTotalNetDistributed,
  } = useReadContract({
    ...contractConfig,
    functionName: "totalNetDistributed",
  });

  // Get distribution count
  const {
    data: distributionCount,
    isLoading: isLoadingDistributionCount,
    refetch: refetchDistributionCount,
  } = useReadContract({
    ...contractConfig,
    functionName: "distributionCount",
  });

  // Refetch all data
  const refetchAll = () => {
    refetchOwner();
    refetchUsdcToken();
    refetchTaxCollector();
    refetchTaxPercentage();
    refetchPaused();
    refetchTotalTaxCollected();
    refetchTotalGrossDistributed();
    refetchTotalNetDistributed();
    refetchDistributionCount();
  };

  const isLoading =
    isLoadingOwner ||
    isLoadingUsdcToken ||
    isLoadingTaxCollector ||
    isLoadingTaxPercentage ||
    isLoadingMaxTaxPercentage ||
    isLoadingPaused ||
    isLoadingTotalTaxCollected ||
    isLoadingTotalGrossDistributed ||
    isLoadingTotalNetDistributed ||
    isLoadingDistributionCount;

  return {
    // Contract data
    owner,
    usdcTokenAddress,
    taxCollector,
    taxPercentage,
    maxTaxPercentage,
    isPaused,
    totalTaxCollected,
    totalGrossDistributed,
    totalNetDistributed,
    distributionCount,

    // Loading states
    isLoading,
    isLoadingOwner,
    isLoadingUsdcToken,
    isLoadingTaxCollector,
    isLoadingTaxPercentage,
    isLoadingMaxTaxPercentage,
    isLoadingPaused,
    isLoadingTotalTaxCollected,
    isLoadingTotalGrossDistributed,
    isLoadingTotalNetDistributed,
    isLoadingDistributionCount,

    // Refetch functions
    refetchAll,
  };
}

/**
 * Hook to get contract stats in a single call
 */
export function usePayrollStats() {
  const {
    data: stats,
    isLoading,
    refetch,
  } = useReadContract({
    ...contractConfig,
    functionName: "getStats",
  });

  return {
    stats: stats
      ? {
          totalTaxCollected: stats[0],
          totalGrossDistributed: stats[1],
          totalNetDistributed: stats[2],
          distributionCount: stats[3],
          currentTaxPercentage: stats[4],
        }
      : null,
    isLoading,
    refetch,
  };
}

/**
 * Hook to calculate distribution for a single amount
 */
export function useCalculateDistribution(grossAmount) {
  const { data, isLoading, refetch } = useReadContract({
    ...contractConfig,
    functionName: "calculateDistribution",
    args: [grossAmount],
    query: {
      enabled: !!grossAmount && grossAmount > 0,
    },
  });

  return {
    netAmount: data?.[0],
    taxAmount: data?.[1],
    isLoading,
    refetch,
  };
}

/**
 * Hook to calculate bulk distribution for multiple amounts
 */
export function useCalculateBulkDistribution(grossAmounts = []) {
  const { data, isLoading, refetch } = useReadContract({
    ...contractConfig,
    functionName: "calculateBulkDistribution",
    args: [grossAmounts],
    query: {
      enabled: grossAmounts.length > 0,
    },
  });

  return {
    totalGross: data?.[0],
    totalNet: data?.[1],
    totalTax: data?.[2],
    isLoading,
    refetch,
  };
}
