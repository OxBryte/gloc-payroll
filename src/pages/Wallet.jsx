import React from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { truncateAddress } from "../components/lib/utils";
import BottomBar from "../components/layouts/BottomBar";

const Wallet = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <div className="min-h-screen  w-full flex flex-col justify-center relative">
      <div className="w-full border-b border-b-gray-200 p-4">
        <div className="w-full mx-auto flex items-center justify-between">

        <img src="/gloc-logo.svg" alt="logo" className="w-8" />
        </div>
        {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f0f0f] to-c-color-sec cursor-pointer hover:opacity-90 transition-opacity shadow-sm"></div> */}
      </div>
      <div className="w-full max-w-[760px] mx-auto min-h-screen relative flex flex-col"></div>
      <BottomBar />
    </div>
  );
};

export default Wallet;
