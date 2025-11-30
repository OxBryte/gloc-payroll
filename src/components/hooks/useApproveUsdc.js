import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";

// =============================================================================
// BASE MAINNET CONFIGURATION
// =============================================================================
const BASE_CHAIN_ID = 8453;
const BASE_CHAIN_ID_HEX = "0x2105";

const BASE_NETWORK_CONFIG = {
  chainId: BASE_CHAIN_ID_HEX,
  chainName: "Base",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

// =============================================================================
// USDC CONTRACT CONFIGURATION (Base Mainnet)
// =============================================================================
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDC_DECIMALS = 6;

// Full ERC20 ABI for approve, allowance, balanceOf
const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

// Payroll contract address (spender)
const PAYROLL_CONTRACT_ADDRESS = "0x08925Cf065dD4Ea5AA0d5077F544334B7b7B4a3d";

// =============================================================================
// HOOK: useApproveUsdc
// =============================================================================
export function useApproveUsdc() {
  // Provider & Signer state
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // USDC state
  const [usdcBalance, setUsdcBalance] = useState(null);
  const [usdcBalanceFormatted, setUsdcBalanceFormatted] = useState("0.00");
  const [currentAllowance, setCurrentAllowance] = useState(null);
  const [currentAllowanceFormatted, setCurrentAllowanceFormatted] = useState("0.00");

  // Loading states
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingAllowance, setIsLoadingAllowance] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Transaction state
  const [approvalTxHash, setApprovalTxHash] = useState(null);
  const [isWaitingConfirmation, setIsWaitingConfirmation] = useState(false);
  const [error, setError] = useState(null);

  // =============================================================================
  // INITIALIZE PROVIDER & SIGNER
  // =============================================================================
  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum === "undefined") {
        setError("No wallet detected. Please install MetaMask or another Web3 wallet.");
        return;
      }

      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        // Check if already connected
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const web3Signer = web3Provider.getSigner();
          const address = await web3Signer.getAddress();
          const network = await web3Provider.getNetwork();

          setSigner(web3Signer);
          setUserAddress(address);
          setChainId(network.chainId);
          setIsConnected(true);

        //   console.log("🔗 Wallet connected:", {
        //     address,
        //     chainId: network.chainId,
        //     isBase: network.chainId === BASE_CHAIN_ID,
        //   });
        }

        // Listen for account changes
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", () => window.location.reload());
      } catch (err) {
        console.error("❌ Failed to initialize provider:", err);
        setError(err.message);
      }
    };

    init();

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setSigner(null);
      setUserAddress(null);
      setIsConnected(false);
      setUsdcBalance(null);
      setCurrentAllowance(null);
    } else {
      window.location.reload();
    }
  };

  // =============================================================================
  // SWITCH TO BASE NETWORK
  // =============================================================================
  const switchToBase = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("No wallet detected");
      return false;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BASE_CHAIN_ID_HEX }],
      });
      return true;
    } catch (switchError) {
      // Chain not added, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [BASE_NETWORK_CONFIG],
          });
          return true;
        } catch (addError) {
          console.error("❌ Failed to add Base network:", addError);
          toast.error("Failed to add Base network");
          return false;
        }
      }
      console.error("❌ Failed to switch to Base:", switchError);
      toast.error("Failed to switch to Base network");
      return false;
    }
  }, []);

  // =============================================================================
  // FETCH USDC BALANCE
  // =============================================================================
  const fetchBalance = useCallback(async () => {
    if (!provider || !userAddress) {
      console.log("⏳ Cannot fetch balance: missing provider or address");
      return null;
    }

    if (chainId !== BASE_CHAIN_ID) {
      console.warn("⚠️ Not on Base network. Current chainId:", chainId);
      return null;
    }

    try {
      setIsLoadingBalance(true);
      setError(null);

      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
      const balance = await usdcContract.balanceOf(userAddress);
      const formatted = ethers.utils.formatUnits(balance, USDC_DECIMALS);

      setUsdcBalance(balance);
      setUsdcBalanceFormatted(parseFloat(formatted).toFixed(2));

      console.log("💰 USDC Balance:", {
        raw: balance.toString(),
        formatted: formatted,
        address: userAddress,
      });

      return balance;
    } catch (err) {
      console.error("❌ Failed to fetch USDC balance:", err);
      setError(err.message);
      return null;
    } finally {
      setIsLoadingBalance(false);
    }
  }, [provider, userAddress, chainId]);

  // =============================================================================
  // FETCH CURRENT ALLOWANCE
  // =============================================================================
  const fetchAllowance = useCallback(async () => {
    if (!provider || !userAddress) {
      console.log("⏳ Cannot fetch allowance: missing provider or address");
      return null;
    }

    if (chainId !== BASE_CHAIN_ID) {
      console.warn("⚠️ Not on Base network. Current chainId:", chainId);
      return null;
    }

    try {
      setIsLoadingAllowance(true);
      setError(null);

      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
      const allowance = await usdcContract.allowance(userAddress, PAYROLL_CONTRACT_ADDRESS);
      const formatted = ethers.utils.formatUnits(allowance, USDC_DECIMALS);

      setCurrentAllowance(allowance);
      setCurrentAllowanceFormatted(parseFloat(formatted).toFixed(2));

    //   console.log("✅ USDC Allowance:", {
    //     raw: allowance.toString(),
    //     formatted: formatted,
    //     spender: PAYROLL_CONTRACT_ADDRESS,
    //   });

      return allowance;
    } catch (err) {
      console.error("❌ Failed to fetch USDC allowance:", err);
      setError(err.message);
      return null;
    } finally {
      setIsLoadingAllowance(false);
    }
  }, [provider, userAddress, chainId]);

  // =============================================================================
  // APPROVE USDC
  // =============================================================================
  const approveUsdc = useCallback(
    async (amount) => {
      if (!signer || !userAddress) {
        const err = new Error("Wallet not connected");
        toast.error("Please connect your wallet first");
        throw err;
      }

      if (chainId !== BASE_CHAIN_ID) {
        toast.error("Please switch to Base network");
        const switched = await switchToBase();
        if (!switched) {
          throw new Error("Failed to switch to Base network");
        }
        // Wait for page reload after chain switch
        return;
      }

      try {
        setIsApproving(true);
        setError(null);
        setApprovalTxHash(null);

        // Convert amount to USDC units (6 decimals)
        const amountInUnits = ethers.utils.parseUnits(amount.toString(), USDC_DECIMALS);

        // console.log("📝 Approving USDC:", {
        //   amount: amount,
        //   amountInUnits: amountInUnits.toString(),
        //   spender: PAYROLL_CONTRACT_ADDRESS,
        //   userAddress: userAddress,
        //   network: "Base Mainnet",
        // });

        // Create contract instance with signer
        const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);

        // Send approve transaction
        const tx = await usdcContract.approve(PAYROLL_CONTRACT_ADDRESS, amountInUnits);

        // Log the transaction hash immediately
        // console.log("🔗 USDC Approval Transaction Hash:", tx.hash);
        // console.log("🔗 View on BaseScan:", `https://basescan.org/tx/${tx.hash}`);
        
        setApprovalTxHash(tx.hash);
        toast.success(`Approval submitted! Hash: ${tx.hash.slice(0, 10)}...`);

        // Wait for confirmation
        setIsWaitingConfirmation(true);
        // console.log("⏳ Waiting for transaction confirmation...");

        const receipt = await tx.wait();

        // console.log("✅ USDC Approval Confirmed!", {
        //   hash: tx.hash,
        //   blockNumber: receipt.blockNumber,
        //   gasUsed: receipt.gasUsed.toString(),
        //   status: receipt.status === 1 ? "Success" : "Failed",
        // });

        if (receipt.status === 1) {
          toast.success("USDC approval confirmed!");
          // Refresh allowance after successful approval
          await fetchAllowance();
        } else {
          throw new Error("Transaction failed");
        }

        return tx.hash;
      } catch (err) {
        console.error("❌ USDC Approval Error:", err);
        setError(err.message);

        // Handle user rejection
        if (err.code === 4001 || err.code === "ACTION_REJECTED") {
          toast.error("Transaction rejected by user");
        } else {
          toast.error(err.reason || err.message || "Failed to approve USDC");
        }

        throw err;
      } finally {
        setIsApproving(false);
        setIsWaitingConfirmation(false);
      }
    },
    [signer, userAddress, chainId, switchToBase, fetchAllowance]
  );

  // =============================================================================
  // HELPER: CHECK IF APPROVAL IS NEEDED
  // =============================================================================
  const needsApproval = useCallback(
    (requiredAmount) => {
      if (!currentAllowance) return true;
      if (!requiredAmount || requiredAmount <= 0) return false;

      const requiredInUnits = ethers.utils.parseUnits(requiredAmount.toString(), USDC_DECIMALS);
      const needs = currentAllowance.lt(requiredInUnits);

    //   console.log("🔍 Approval check:", {
    //     currentAllowance: currentAllowance.toString(),
    //     requiredInUnits: requiredInUnits.toString(),
    //     needsApproval: needs,
    //   });

      return needs;
    },
    [currentAllowance]
  );

  // =============================================================================
  // HELPER: CHECK IF USER HAS SUFFICIENT BALANCE
  // =============================================================================
  const hasSufficientBalance = useCallback(
    (requiredAmount) => {
      if (!usdcBalance) {
        console.log("⚠️ No USDC balance loaded");
        return false;
      }
      if (!requiredAmount || requiredAmount <= 0) return true;

      const requiredInUnits = ethers.utils.parseUnits(requiredAmount.toString(), USDC_DECIMALS);
      const hasSufficient = usdcBalance.gte(requiredInUnits);

    //   console.log("💵 Balance check:", {
    //     usdcBalance: usdcBalance.toString(),
    //     usdcBalanceFormatted: ethers.utils.formatUnits(usdcBalance, USDC_DECIMALS),
    //     requiredInUnits: requiredInUnits.toString(),
    //     hasSufficientBalance: hasSufficient,
    //   });

      return hasSufficient;
    },
    [usdcBalance]
  );

  // =============================================================================
  // AUTO-FETCH BALANCE & ALLOWANCE WHEN CONNECTED ON BASE
  // =============================================================================
  useEffect(() => {
    if (isConnected && userAddress && chainId === BASE_CHAIN_ID) {
      fetchBalance();
      fetchAllowance();
    }
  }, [isConnected, userAddress, chainId, fetchBalance, fetchAllowance]);

  // =============================================================================
  // RETURN
  // =============================================================================
  return {
    // Connection state
    isConnected,
    userAddress,
    chainId,
    isOnBase: chainId === BASE_CHAIN_ID,

    // USDC data
    usdcBalance,
    usdcBalanceFormatted,
    currentAllowance,
    currentAllowanceFormatted,

    // Loading states
    isLoadingBalance,
    isLoadingAllowance,
    isApproving,
    isWaitingConfirmation,

    // Transaction state
    approvalTxHash,
    error,

    // Functions
    approveUsdc,
    needsApproval,
    hasSufficientBalance,
    fetchBalance,
    fetchAllowance,
    switchToBase,

    // Constants (for reference)
    USDC_ADDRESS,
    USDC_DECIMALS,
    PAYROLL_CONTRACT_ADDRESS,
    BASE_CHAIN_ID,
  };
}

export default useApproveUsdc;

