import React from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Loader2 } from "lucide-react";
import { truncateAddress } from "../components/lib/utils";

const Wallet = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-c-bg2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8 text-center border border-gray-100">
        <div className="space-y-2">
          <div className="mx-auto w-16 h-16 bg-c-color/10 rounded-full flex items-center justify-center mb-4">
            <img src="/gloc-logo.svg" alt="Gloc Logo" className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Connect Wallet</h1>
          <p className="text-gray-500">
            Connect your wallet to access the platform securely.
          </p>
        </div>

        <div className="space-y-4">
          {isConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-green-800 font-medium">Wallet Connected</p>
                <p className="text-green-600 text-sm mt-1 font-mono">
                  {truncateAddress(address)}
                </p>
              </div>
              <button
                onClick={() => open({ view: "Account" })}
                className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors focus:ring-4 focus:ring-gray-100"
              >
                Manage Wallet
              </button>
            </div>
          ) : (
            <button
              onClick={() => open()}
              className="w-full py-3 px-4 bg-c-color text-white rounded-xl font-medium hover:bg-c-color/90 transition-all shadow-lg shadow-c-color/20 hover:shadow-xl hover:shadow-c-color/30 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Connect Wallet
            </button>
          )}
        </div>

        <div className="pt-4 text-xs text-gray-400">
          By connecting, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default Wallet;
