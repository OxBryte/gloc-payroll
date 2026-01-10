import React from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Wallet as WalletIcon, BookUser, ShieldCheck } from "lucide-react";
import { truncateAddress } from "../components/lib/utils";
import BottomBar from "../components/layouts/BottomBar";

const Wallet = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <div className="min-h-screen max-w-[760px] mx-auto bg-gray-50 flex justify-center ">
      <div className="w-full  min-h-screen relative flex flex-col">
        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
          <div className="w-full max-w-sm space-y-8 text-center">

            <div className="space-y-4 pt-4">
              {isConnected ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mb-2 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    <p className="text-green-800 font-semibold">Connected</p>
                    <p className="text-green-600 text-sm mt-1 font-mono bg-green-100/50 px-3 py-1 rounded-full">
                      {truncateAddress(address)}
                    </p>
                  </div>
                  <button
                    onClick={() => open({ view: "Account" })}
                    className="w-full py-4 px-6 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
                  >
                    Manage Wallet
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => open()}
                  className="w-full py-4 px-6 bg-c-color text-white rounded-xl font-semibold hover:bg-c-color/90 transition-all shadow-lg shadow-c-color/20 hover:shadow-xl hover:shadow-c-color/30 active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                >
                  <WalletIcon className="w-5 h-5" />
                  Connect Wallet
                </button>
              )}
            </div>

            <div className="pt-8 text-xs text-gray-400">
              By connecting, you agree to our Terms of Service and Privacy
              Policy.
            </div>
          </div>
        </div>

        {/* Fixed Bottom Navigation Bar */}
        <BottomBar />
      </div>
    </div>
  );
};

export default Wallet;
