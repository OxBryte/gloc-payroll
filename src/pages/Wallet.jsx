import React from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { truncateAddress } from "../components/lib/utils";
import BottomBar from "../components/layouts/BottomBar";

const Wallet = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <div className="min-h-screen  w-full flex justify-center relative">
      <div className="w-full border-b border-b-gray-200 p-4">
        <div className="w-full max-w-[760px] mx-auto flex items-center justify-center">
          <img src="/gloc-logo.svg" alt="logo" className="w-8" />
        </div>
      </div>
      <div className="w-full max-w-[760px] mx-auto min-h-screen relative flex flex-col"></div>
      <BottomBar />
    </div>
  );
};

export default Wallet;
