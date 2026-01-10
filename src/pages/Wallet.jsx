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
