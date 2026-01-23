import React, { useState } from "react";
import { truncateAddress } from "../components/lib/utils";
import BottomBar from "../components/layouts/BottomBar";
// import { useAccount } from "wagmi";
import { HiOutlinePlus } from "react-icons/hi";
import WalletMenu from "../components/ui/WalletMenu";
import EditWalletModal from "../components/ui/EditWalletModal";

const Wallet = () => {
  // const { open } = useAppKit();
  // const { address, isConnected } = useAppKitAccount();
  const address = "0x1234567890123456789012345678901234567890";
  
  // Sample wallet data - in a real app, this would come from state/context
  const [wallets, setWallets] = useState([
    {
      id: "1",
      name: "John Doe",
      address: address,
      balance: 0,
      image: null,
      emoji: null,
      bgColor: "#000000",
    },
    {
      id: "2",
      name: "John Doe",
      address: address,
      balance: 0,
      image: null,
      emoji: null,
      bgColor: "#000000",
    },
  ]);
  
  const [editingWallet, setEditingWallet] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleMenuOption = (option, walletId) => {
    // Handle menu option actions here
    console.log(`Selected option: ${option} for wallet: ${walletId}`);
    
    if (option === "edit-wallet") {
      const wallet = wallets.find((w) => w.id === walletId);
      if (wallet) {
        setEditingWallet(wallet);
        setShowEditModal(true);
      }
    }
  };

  const handleSaveWallet = (updatedWallet) => {
    setWallets((prevWallets) =>
      prevWallets.map((w) =>
        w.id === updatedWallet.id ? updatedWallet : w
      )
    );
    setShowEditModal(false);
    setEditingWallet(null);
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
          {wallets.map((wallet, index) => (
            <div key={wallet.id}>
              <div className="w-full px-4 py-3 flex gap-3 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: wallet.bgColor }}
                  >
                    {wallet.image ? (
                      <img
                        src={wallet.image}
                        alt={wallet.name}
                        className="w-full h-full object-cover"
                      />
                    ) : wallet.emoji ? (
                      <span className="text-xl">{wallet.emoji}</span>
                    ) : (
                      <div className="w-full h-full bg-c-color"></div>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[16px] font-medium">{wallet.name}</p>
                    <p className="text-[12px] text-gray-500">
                      {truncateAddress(wallet.address)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 relative">
                  <p className="text-[18px] font-medium">
                    ${wallet.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <WalletMenu
                    onOptionSelect={(option) => handleMenuOption(option, wallet.id)}
                  />
                </div>
              </div>
              {index < wallets.length - 1 && (
                <div className="border-b border-b-gray-100"></div>
              )}
            </div>
          ))}
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

      {/* Edit Wallet Modal */}
      {editingWallet && (
        <EditWalletModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingWallet(null);
          }}
          wallet={editingWallet}
          onSave={handleSaveWallet}
        />
      )}

      <BottomBar />
    </div>
  );
};

export default Wallet;
