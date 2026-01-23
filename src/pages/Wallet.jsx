import React from "react";
import { truncateAddress } from "../components/lib/utils";
import BottomBar from "../components/layouts/BottomBar";
import { useAccount } from "wagmi";
import { HiOutlinePlus } from "react-icons/hi";
import WalletMenu from "../components/ui/WalletMenu";

const Wallet = () => {
  // const { open } = useAppKit();
  // const { address, isConnected } = useAppKitAccount();
  const { address } = useAccount();

  const handleMenuOption = (option) => {
    // Handle menu option actions here
    console.log(`Selected option: ${option}`);
  };
  return (
    <div className="min-h-screen w-full relative">
      <div className="w-full border-b border-b-gray-200 p-4 sticky top-0 z-10">
        <div className="w-full max-w-[760px] mx-auto flex items-center justify-center">
          <img src="/gloc-logo.svg" alt="logo" className="w-8" />
        </div>
      </div>
      <div className="mt-10 w-full max-w-[480px] mx-auto relative space-y-6">
        <div className="w-full h-full bg-white rounded-[20px] border border-gray-100 py-2">
          <div className="w-full px-4 py-3 flex gap-3 items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="w-10 h-10 rounded-full bg-c-color"></div>
              <div className="space-y-0.5">
                <p className="text-[16px] font-medium">John Doe</p>
                <p className="text-[12px] text-gray-500">
                  {truncateAddress(address)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 relative">
              <p className="text-[18px] font-medium">$0.00</p>
              <div ref={menuRef} className="relative">
                <HiOutlineDotsVertical
                  size={20}
                  className="text-gray-400 cursor-pointer"
                  onClick={handleMenuClick}
                />
                {showMenu && (
                  <div className="absolute right-0 top-8 z-50 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <button
                      onClick={() => handleMenuOption("edit-name")}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Edit Name
                    </button>
                    <button
                      onClick={() => handleMenuOption("edit-picture")}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Edit Picture
                    </button>
                    <button
                      onClick={() => handleMenuOption("transactions")}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Transactions
                    </button>
                    <button
                      onClick={() => handleMenuOption("copy-address")}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Copy Address
                    </button>
                    <button
                      onClick={() => handleMenuOption("qr-code")}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      QR Code
                    </button>
                    <button
                      onClick={() => handleMenuOption("export-wallet")}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                    >
                      Export Wallet
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="border-b border-b-gray-100"></div>
          <div className="w-full px-4 py-3 flex gap-3 items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="w-10 h-10 rounded-full bg-c-color"></div>
              <div className="space-y-0.5">
                <p className="text-[16px] font-medium">John Doe</p>
                <p className="text-[12px] text-gray-500">
                  {truncateAddress(address)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-[18px] font-medium">$0.00</p>
              <HiOutlineDotsVertical
                size={20}
                className="text-gray-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* New Wallet */}
        <div className="w-full space-y-4">
          <div className="w-full bg-c-color text-white rounded-[20px] p-4 flex items-center justify-center gap-3 cursor-pointer hover:bg-c-color/80 hover:scale-98 transition-all duration-300">
            <HiOutlinePlus size={20} className="" />
            <p>Create New Wallet</p>
          </div>
          {/* <p>Import Wallet</p> */}
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default Wallet;
