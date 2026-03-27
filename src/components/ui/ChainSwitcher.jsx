import React from "react";
import { useChain } from "../hooks/useChain";

//  Added props interface
interface ChainSwitcherProps {
  // Configuration for which chains to show
  showMainnet?: boolean;
  showTestnet?: boolean;
  
  // Disable specific chains
  disableMainnet?: boolean;
  disableTestnet?: boolean;
  
  // Callback when chain switches
  onChainSwitch?: (chainId: number, chainName: string) => void;
  
  // Custom styling
  className?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  disabledButtonClassName?: string;
}

export default function ChainSwitcher({
  // Default props
  showMainnet = true,
  showTestnet = true,
  disableMainnet = false,
  disableTestnet = false,
  onChainSwitch,
  className = "",
  buttonClassName = "px-3 py-2 text-xs font-medium rounded-md transition-colors",
  activeButtonClassName = "text-white cursor-not-allowed",
  disabledButtonClassName = "bg-gray-200 text-gray-700 hover:bg-gray-300"
}: ChainSwitcherProps) {
  const {
    chainId,
    currentChainName,
    isMainnet,
    isTestnet,
    switchToBaseMainnet,
    switchToBaseTestnet,
    isPending,
  } = useChain();

  //  Handle chain switch with callback
  const handleSwitchToTestnet = async () => {
    if (!disableTestnet) {
      await switchToBaseTestnet();
      if (onChainSwitch && chainId) {
        onChainSwitch(chainId, "Base Testnet");
      }
    }
  };

  const handleSwitchToMainnet = async () => {
    if (!disableMainnet) {
      await switchToBaseMainnet();
      if (onChainSwitch && chainId) {
        onChainSwitch(chainId, "Base Mainnet");
      }
    }
  };

  // Add safety check for when chainId is not available
  if (!chainId) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-sm font-medium text-gray-500">
              Connecting...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isMainnet ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span className="text-sm font-medium text-gray-700">
            {currentChainName}
          </span>
        </div>
      </div>

      <div className="flex gap-1">
        {/*  Conditionally render Testnet button */}
        {showTestnet && (
          <button
            onClick={handleSwitchToTestnet}
            disabled={isTestnet || isPending || disableTestnet}
            className={`${buttonClassName} ${
              isTestnet
                ? `bg-blue-500 ${activeButtonClassName}`
                : `${disabledButtonClassName}`
            } ${
              disableTestnet ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Switch to Base Testnet"
          >
            {isPending ? "Switching..." : "Testnet"}
          </button>
        )}

        {/*  Conditionally render Mainnet button */}
        {showMainnet && (
          <button
            onClick={handleSwitchToMainnet}
            disabled={isMainnet || isPending || disableMainnet}
            className={`${buttonClassName} ${
              isMainnet
                ? `bg-green-500 ${activeButtonClassName}`
                : `${disabledButtonClassName}`
            } ${
              disableMainnet ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Switch to Base Mainnet"
          >
            {isPending ? "Switching..." : "Mainnet"}
          </button>
        )}
      </div>
    </div>
  );
}
