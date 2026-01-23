import React from "react";
import { truncateAddress } from "../components/lib/utils";
import BottomBar from "../components/layouts/BottomBar";
import { useAccount } from "wagmi";

const Wallet = () => {
  // const { open } = useAppKit();
  // const { address, isConnected } = useAppKitAccount();
  const { address } = useAccount();
  return (
    <div className="min-h-screen w-full relative">
      <div className="w-full border-b border-b-gray-200 p-4 sticky top-0 z-10">
        <div className="w-full max-w-[760px] mx-auto flex items-center justify-center">
          <img src="/gloc-logo.svg" alt="logo" className="w-8" />
        </div>
      </div>
      <div className="mt-10 w-full max-w-[560px] mx-auto relative">
        <div className="w-full h-full bg-white rounded-lg border border-gray-100 py-2">
          <div className="w-full px-4 py-3 flex gap-3 items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="w-10 h-10 rounded-full bg-c-color"></div>
              <div className="space-y-0.5">
                <p className="text-[16px] font-medium">John Doe</p>
                <p className="text-xs text-gray-500">
                  {truncateAddress(address)}
                </p>
              </div>
            </div>
          </div>
          <div className="border-b border-b-gray-100"></div>
          <div className="w-full px-4 py-3 flex gap-3 items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="w-12 h-12 rounded-full bg-c-color"></div>
              <div className="space-y-0.5">
                <p className="text-lg font-medium">John Doe</p>
                <p className="text-xs text-gray-500">
                  {truncateAddress(address)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default Wallet;
