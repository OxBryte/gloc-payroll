import React from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { truncateAddress } from "../components/lib/utils";
import BottomBar from "../components/layouts/BottomBar";

const Wallet = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <div className="min-h-screen flex justify-center relative">
      <div className="w-full  min-h-screen relative flex flex-col"></div>
      <BottomBar />
    </div>
  );
};

export default Wallet;
