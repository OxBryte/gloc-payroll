import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

// Base Mainnet RPC URLs
const BASE_MAINNET_RPC = "https://mainnet.base.org";
const BASE_MAINNET_RPC_ALCHEMY =
  "https://base-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"; // Replace with your Alchemy key
const BASE_MAINNET_RPC_INFURA =
  "https://base-mainnet.infura.io/v3/YOUR_INFURA_KEY"; // Replace with your Infura key

// Base Sepolia Testnet RPC URLs
const BASE_SEPOLIA_RPC = "https://sepolia.base.org";
const BASE_SEPOLIA_RPC_ALCHEMY =
  "https://base-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"; // Replace with your Alchemy key
const BASE_SEPOLIA_RPC_INFURA =
  "https://base-sepolia.infura.io/v3/YOUR_INFURA_KEY"; // Replace with your Infura key

// WalletConnect Project ID - Get this from https://cloud.walletconnect.com/
const PROJECT_ID = "YOUR_WALLETCONNECT_PROJECT_ID"; // Replace with your WalletConnect Project ID

// Create custom Base chains with additional RPC URLs
const baseMainnet = {
  ...base,
  rpcUrls: {
    ...base.rpcUrls,
    default: {
      http: [BASE_MAINNET_RPC],
    },
    public: {
      http: [BASE_MAINNET_RPC],
    },
    // Add additional RPC providers for redundancy
    alchemy: {
      http: [BASE_MAINNET_RPC_ALCHEMY],
    },
    infura: {
      http: [BASE_MAINNET_RPC_INFURA],
    },
  },
};

const baseSepoliaTestnet = {
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: {
      http: [BASE_SEPOLIA_RPC],
    },
    public: {
      http: [BASE_SEPOLIA_RPC],
    },
    // Add additional RPC providers for redundancy
    alchemy: {
      http: [BASE_SEPOLIA_RPC_ALCHEMY],
    },
    infura: {
      http: [BASE_SEPOLIA_RPC_INFURA],
    },
  },
};

// Create Wagmi configuration
export const config = createConfig({
  chains: [baseMainnet, baseSepoliaTestnet],
  connectors: [
    // MetaMask and other injected wallets
    injected({
      target: "metaMask",
    }),
    // WalletConnect
    walletConnect({
      projectId: PROJECT_ID,
      showQrModal: true,
      metadata: {
        name: "Payroll Project",
        description: "Decentralized payroll management system",
        url: "https://your-app-url.com", // Replace with your app URL
        icons: ["https://your-app-url.com/icon.png"], // Replace with your app icon
      },
    }),
    // Coinbase Wallet
    coinbaseWallet({
      appName: "Payroll Project",
      appLogoUrl: "https://your-app-url.com/logo.png", // Replace with your app logo
    }),
  ],
  transports: {
    // Base Mainnet
    [baseMainnet.id]: http(BASE_MAINNET_RPC),
    // Base Sepolia Testnet
    [baseSepoliaTestnet.id]: http(BASE_SEPOLIA_RPC),
  },
  ssr: true, // Enable SSR support
});

// Export chain configurations for use in other parts of the app
export const chains = {
  baseMainnet,
  baseSepoliaTestnet,
};

// Helper function to get RPC URL for a specific chain
export const getRpcUrl = (chainId) => {
  if (!chainId) return BASE_SEPOLIA_RPC; // Default to testnet

  switch (chainId) {
    case baseMainnet.id:
      return BASE_MAINNET_RPC;
    case baseSepoliaTestnet.id:
      return BASE_SEPOLIA_RPC;
    default:
      return BASE_SEPOLIA_RPC; // Default to testnet
  }
};

// Helper function to check if a chain is Base
export const isBaseChain = (chainId) => {
  if (!chainId) return false;
  return chainId === baseMainnet.id || chainId === baseSepoliaTestnet.id;
};

// Helper function to get chain name
export const getChainName = (chainId) => {
  if (!chainId) return "Unknown Chain";

  switch (chainId) {
    case baseMainnet.id:
      return "Base Mainnet";
    case baseSepoliaTestnet.id:
      return "Base Sepolia Testnet";
    default:
      return "Unknown Chain";
  }
};
