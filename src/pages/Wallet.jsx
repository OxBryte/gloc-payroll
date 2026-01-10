import React from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Wallet as WalletIcon, BookUser, ShieldCheck } from "lucide-react";
import BottomBar from "../components/layouts/BottomBar";

const Wallet = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <div className="min-h-screen max-w-[760px] mx-auto bg-gray-50 flex justify-center ">
      <div className="w-full  min-h-screen relative flex flex-col">
        <BottomBar />
      </div>
    </div>
  );
};

export default Wallet;
