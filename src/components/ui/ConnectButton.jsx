import React from "react";
import { useConnect, useDisconnect, useAddress } from "@thirdweb-dev/react";

export default function ConnectButton() {
  // const connect = useConnect();
  // const disconnect = useDisconnect();
  // const address = useAddress();

  const handleConnect = async () => {
    try {
      // await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = () => {
    // disconnect();
  };

  if (address) {
    return (
      <div className="space-y-2">
        <div className="px-5 py-3 flex justify-center rounded-md cursor-pointer transition-colors text-white bg-green-600 hover:bg-green-700">
          <span className="text-lg font-semibold">
            {/* Connected: {address.slice(0, 6)}...{address.slice(-4)} */}
          </span>
        </div>
        <button
          className="px-5 w-full py-2 flex justify-center rounded-md cursor-pointer transition-colors text-white bg-red-600 hover:bg-red-700"
          onClick={handleDisconnect}
        >
          <span className="text-sm font-semibold">Disconnect Wallet</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="px-5 w-full py-3 flex justify-center rounded-md cursor-pointer transition-colors text-white bg-c-color hover:bg-c-bg"
      onClick={handleConnect}
    >
      <span className="text-lg font-semibold">Connect Wallet</span>
    </div>
  );
}
