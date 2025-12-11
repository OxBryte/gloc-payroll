import { useState, useCallback, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { contractAddress } from "../constants/contractABI";

// =============================================================================
// CONFIGURATION (Assuming these are NOT defined in this file, but you need them)
// If you are using a dedicated wallet hook (like useAppKit), you should get
// signer/address/chainId from there, not re-initialize Web3Provider here.
// =============================================================================

// Base Network Details
const BASE_CHAIN_ID = 8453;
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDC_DECIMALS = 6;

// Minimal ERC20 ABI
const USDC_APPROVAL_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)", // Kept for balance check
];

// =============================================================================
// MOCK/ADAPTER: Get Signer/Provider from your 'reown/appkit' setup
// You must ADAPT these lines based on how you get the Ethers Signer and Address
// from your 'useAppKitAccount' and 'useAppKit' environment.
// For this example, we'll assume you pass them into the hook.
// =============================================================================

// Assuming the component passes the necessary AppKit state:
export function useApproveUsdc(appKitAddress, appKitIsConnected) {
  // --- State for the approval process ---
  const [currentAllowance, setCurrentAllowance] = useState(
    ethers.constants.Zero
  );
  const [usdcBalance, setUsdcBalance] = useState(ethers.constants.Zero);
  const [isLoadingAllowance, setIsLoadingAllowance] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState(null);

  // NOTE: The `isWaitingApproval` state is handled via the `isApproving` flag
  // and the toast/UI in the component, simplifying the hook state.

  // -------------------------------------------------------------------------
  // 1. ADAPTER: Get Ethers Signer/Provider from AppKit
  // -------------------------------------------------------------------------

  // This is a common pattern to get the provider/signer from the window.ethereum
  // when using an external connector like AppKit/Wagmi.
  const getWeb3Objects = useCallback(() => {
    if (!appKitIsConnected || typeof window.ethereum === "undefined") {
      return { provider: null, signer: null, chainId: null };
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // You may need to fetch the chainId asynchronously here or rely on the caller
    // For simplicity, we assume we are on the correct network (Base) for the core logic
    return { provider, signer };
  }, [appKitIsConnected]);

  const { provider, signer } = getWeb3Objects();
  const userAddress = appKitAddress;
  const chainId = BASE_CHAIN_ID; // Assuming AppKit is set to Base

  // -------------------------------------------------------------------------
  // 2. CORE LOGIC: FETCH ALLOWANCE & BALANCE
  // -------------------------------------------------------------------------

  const fetchAllowance = useCallback(async () => {
    if (!provider || !userAddress || chainId !== BASE_CHAIN_ID) {
      setCurrentAllowance(ethers.constants.Zero);
      return ethers.constants.Zero;
    }

    try {
      setIsLoadingAllowance(true);
      const usdcContract = new ethers.Contract(
        USDC_ADDRESS,
        USDC_APPROVAL_ABI,
        provider
      );

      // Fetch Allowance
      const allowance = await usdcContract.allowance(
        userAddress,
        contractAddress
      );
      setCurrentAllowance(allowance);

      // Fetch Balance
      const balance = await usdcContract.balanceOf(userAddress);
      setUsdcBalance(balance);

      return allowance;
    } catch (err) {
      console.error("❌ Failed to fetch USDC data:", err);
      setError("Failed to fetch balance or allowance.");
      return ethers.constants.Zero;
    } finally {
      setIsLoadingAllowance(false);
    }
  }, [provider, userAddress, chainId]);

  // Auto-fetch data on connect/address change
  useEffect(() => {
    if (appKitIsConnected && userAddress) {
      fetchAllowance();
    }
  }, [appKitIsConnected, userAddress, fetchAllowance]);

  // -------------------------------------------------------------------------
  // 3. CORE LOGIC: APPROVE USDC
  // -------------------------------------------------------------------------

  const approveUsdc = useCallback(
    async (requiredAmount) => {
      if (!signer || !userAddress) {
        toast.error("Wallet not connected or signer unavailable.");
        throw new Error("Wallet not connected.");
      }

      try {
        setIsApproving(true);
        setError(null);

        // Convert human amount to units (BigNumber)
        const amountInUnits = ethers.utils.parseUnits(
          requiredAmount.toString(),
          USDC_DECIMALS
        );

        // Check allowance one last time before sending tx
        if (currentAllowance.gte(amountInUnits)) {
          toast.success("Allowance is already sufficient.");
          return;
        }

        const usdcContract = new ethers.Contract(
          USDC_ADDRESS,
          USDC_APPROVAL_ABI,
          signer
        );

        // Send Approve Transaction
        const tx = await usdcContract.approve(
          contractAddress,
          amountInUnits
        );

        toast.loading(`Approval submitted! Waiting for confirmation...`, {
          id: "approval",
        });

        // Wait for Confirmation
        const receipt = await tx.wait();

        if (receipt.status !== 1) {
          throw new Error("Transaction failed on-chain.");
        }

        // Success: Refetch allowance to update UI state immediately
        await fetchAllowance();
        return tx.hash;
      } catch (err) {
        console.error("❌ USDC Approval Error:", err);
        const errorMessage =
          err.code === 4001 || err.code === "ACTION_REJECTED"
            ? "Transaction rejected by user."
            : err.reason || err.message || "Failed to approve USDC.";

        setError(errorMessage);
        // The caller (handleDistributePayroll) will show the toast error
        throw err;
      } finally {
        setIsApproving(false);
      }
    },
    [signer, userAddress, currentAllowance, fetchAllowance]
  );

  // -------------------------------------------------------------------------
  // 4. HELPERS
  // -------------------------------------------------------------------------

  // Check if current allowance is less than the required amount
  const needsApproval = useCallback(
    (requiredAmount) => {
      if (!currentAllowance || requiredAmount <= 0) return true;
      try {
        const requiredInUnits = ethers.utils.parseUnits(
          requiredAmount.toString(),
          USDC_DECIMALS
        );
        return currentAllowance.lt(requiredInUnits);
      } catch (e) {
        console.error("Error in needsApproval conversion:", e);
        return true;
      }
    },
    [currentAllowance]
  );

  // Check if current balance is greater than the required amount
  const hasSufficientBalance = useCallback(
    (requiredAmount) => {
      if (!usdcBalance || requiredAmount <= 0) return false;
      try {
        const requiredInUnits = ethers.utils.parseUnits(
          requiredAmount.toString(),
          USDC_DECIMALS
        );
        return usdcBalance.gte(requiredInUnits);
      } catch (e) {
        console.error("Error in hasSufficientBalance conversion:", e);
        return false;
      }
    },
    [usdcBalance]
  );

  // Formatted balance for UI display
  const usdcBalanceFormatted = useMemo(() => {
    return Number(ethers.utils.formatUnits(usdcBalance, USDC_DECIMALS)).toFixed(
      2
    );
  }, [usdcBalance]);

  // -------------------------------------------------------------------------
  // RETURN
  // -------------------------------------------------------------------------
  return {
    // Data
    usdcBalance: usdcBalanceFormatted, // Returning formatted number for simpler component use
    currentAllowance: currentAllowance, // Returning raw BigNumber for internal checks

    // State
    isApproving,
    isLoadingAllowance,

    // Core Functions
    approveUsdc,
    needsApproval,
    hasSufficientBalance,
    refetchAllowance: fetchAllowance, // Expose fetch as refetch

    // Error
    error,
  };
}
