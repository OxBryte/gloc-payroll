import React, { useState } from "react";
import { X } from "lucide-react";

const AddWalletModal = ({ isOpen, onClose, onAddWallet }) => {
  const [walletName, setWalletName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (walletName.trim() && walletAddress.trim()) {
      onAddWallet({
        id: Date.now().toString(),
        name: walletName.trim(),
        address: walletAddress.trim(),
        balance: 0,
        avatar: null,
        transactions: [],
        createdAt: new Date().toISOString(),
      });
      setWalletName("");
      setWalletAddress("");
      onClose();
    }
  };

  const generateRandomAddress = () => {
    const chars = "0123456789abcdef";
    let address = "0x";
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    setWalletAddress(address);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Wallet
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Wallet Name
            </label>
            <input
              type="text"
              placeholder="Enter wallet name"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Wallet Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent outline-none"
                required
              />
              <button
                type="button"
                onClick={generateRandomAddress}
                className="px-4 py-2 text-sm text-c-color hover:bg-c-color/10 rounded-lg transition-colors border border-c-color"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-c-color text-white rounded-lg text-sm font-medium hover:bg-c-color/90 transition-colors"
            >
              Create Wallet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWalletModal;
