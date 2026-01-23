import React, { useState } from "react";
import { truncateAddress, truncateTxHash } from "../components/lib/utils";
import BottomBar from "../components/layouts/BottomBar";
import { useAccount } from "wagmi";
import { HiOutlinePlus, HiChevronDown, HiChevronUp } from "react-icons/hi";
import WalletMenu from "../components/ui/WalletMenu";
import AddWalletModal from "../components/ui/AddWalletModal";

// Generate dummy transaction history
const generateDummyTransactions = (count = 5) => {
  const types = ["sent", "received", "swap"];
  const statuses = ["completed", "pending", "failed"];
  const transactions = [];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = (Math.random() * 1000 + 10).toFixed(2);
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    transactions.push({
      id: `tx_${Date.now()}_${i}`,
      hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      type,
      status,
      amount: parseFloat(amount),
      to: `0x${Math.random().toString(16).substring(2, 42)}`,
      from: `0x${Math.random().toString(16).substring(2, 42)}`,
      timestamp: date.toISOString(),
      fee: (Math.random() * 5).toFixed(4),
    });
  }

  return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Initial dummy wallets
const initialWallets = [
  {
    id: "1",
    name: "Main Wallet",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    balance: 1250.75,
    avatar: null,
    transactions: generateDummyTransactions(8),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "Savings Wallet",
    address: "0x8ba1f109551bD432803012645Hac136c22C1779",
    balance: 5432.20,
    avatar: null,
    transactions: generateDummyTransactions(12),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Trading Wallet",
    address: "0x3CdA3272C5C5C5C5C5C5C5C5C5C5C5C5C5C5C5C5C",
    balance: 890.45,
    avatar: null,
    transactions: generateDummyTransactions(6),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const Wallet = () => {
  const [wallets, setWallets] = useState(initialWallets);
  const [expandedWallets, setExpandedWallets] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  const handleMenuOption = (option, walletId) => {
    console.log(`Selected option: ${option} for wallet: ${walletId}`);
    // Handle menu option actions here
    if (option === "copy-address") {
      const wallet = wallets.find((w) => w.id === walletId);
      if (wallet) {
        navigator.clipboard.writeText(wallet.address);
        // You can add a toast notification here
      }
    }
  };

  const handleAddWallet = (newWallet) => {
    setWallets([...wallets, newWallet]);
  };

  const toggleWalletExpansion = (walletId) => {
    setExpandedWallets((prev) => ({
      ...prev,
      [walletId]: !prev[walletId],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "sent":
        return "text-red-600";
      case "received":
        return "text-green-600";
      case "swap":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen w-full relative pb-20">
      <div className="w-full border-b border-b-gray-200 p-4 sticky top-0 z-10 bg-white">
        <div className="w-full max-w-[760px] mx-auto flex items-center justify-center">
          <img src="/gloc-logo.svg" alt="logo" className="w-8" />
        </div>
      </div>
      <div className="mt-10 w-full max-w-[480px] mx-auto relative space-y-6 px-4">
        {/* Wallets List */}
        <div className="w-full h-full bg-white rounded-[20px] border border-gray-100 py-2">
          {wallets.map((wallet, index) => (
            <div key={wallet.id}>
              <div className="w-full px-4 py-3 flex gap-3 items-center justify-between">
                <div className="flex gap-2 items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-c-color flex-shrink-0"></div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="text-[16px] font-medium">{wallet.name}</p>
                    <p className="text-[12px] text-gray-500">
                      {truncateAddress(wallet.address)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[18px] font-medium">
                    ${wallet.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <WalletMenu
                    onOptionSelect={(option) => handleMenuOption(option, wallet.id)}
                  />
                </div>
              </div>

              {/* Transaction History Toggle */}
              {wallet.transactions.length > 0 && (
                <div className="px-4 pb-2">
                  <button
                    onClick={() => toggleWalletExpansion(wallet.id)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-c-color transition-colors"
                  >
                    {expandedWallets[wallet.id] ? (
                      <HiChevronUp size={16} />
                    ) : (
                      <HiChevronDown size={16} />
                    )}
                    <span>
                      {wallet.transactions.length} Transaction
                      {wallet.transactions.length !== 1 ? "s" : ""}
                    </span>
                  </button>
                </div>
              )}

              {/* Expanded Transaction History */}
              {expandedWallets[wallet.id] && wallet.transactions.length > 0 && (
                <div className="px-4 pb-3 space-y-2 max-h-64 overflow-y-auto">
                  {wallet.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="border border-gray-100 rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${getTypeColor(
                              tx.type
                            )} bg-opacity-10 capitalize`}
                          >
                            {tx.type}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(
                              tx.status
                            )} capitalize`}
                          >
                            {tx.status}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-semibold ${getTypeColor(tx.type)}`}
                        >
                          {tx.type === "sent" ? "-" : "+"}${tx.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Hash: {truncateTxHash(tx.hash)}</p>
                        <p>Fee: {tx.fee} USDC</p>
                        <p>{formatDate(tx.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {index < wallets.length - 1 && (
                <div className="border-b border-b-gray-100"></div>
              )}
            </div>
          ))}
        </div>

        {/* New Wallet Button */}
        <div className="w-full space-y-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full bg-c-color text-white rounded-[20px] p-4 flex items-center justify-center gap-3 cursor-pointer hover:bg-c-color/80 hover:scale-98 transition-all duration-300"
          >
            <HiOutlinePlus size={20} className="" />
            <p>Create New Wallet</p>
          </button>
        </div>
      </div>

      {/* Add Wallet Modal */}
      <AddWalletModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddWallet={handleAddWallet}
      />

      <BottomBar />
    </div>
  );
};

export default Wallet;
