import React from "react";
import { X, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { truncateAddress } from "../lib/utils";
import toast from "react-hot-toast";

const QRCodeModal = ({ isOpen, onClose, wallet }) => {
  const handleCopyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address).then(() => {
        toast.success("Address copied to clipboard!");
      }).catch((err) => {
        console.error("Failed to copy address:", err);
        toast.error("Failed to copy address");
      });
    }
  };

  if (!isOpen || !wallet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className=" space-y-6">
          {/* Wallet Info */}
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-900">{wallet.name}</p>
            <p className="text-sm text-gray-500">
              {truncateAddress(wallet.address)}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={wallet.address}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          {/* Address with Copy Button */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Wallet Address
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={wallet.address}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
              />
              <button
                onClick={handleCopyAddress}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Copy address"
              >
                <Copy className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Info Text */}
          <p className="text-xs text-gray-500 text-center">
            Scan this QR code to receive payments to this wallet address
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-c-color text-white rounded-lg text-sm font-medium hover:bg-c-color/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
