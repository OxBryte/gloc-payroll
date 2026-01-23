import React from "react";
import { X, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { truncateAddress } from "../lib/utils";
import toast from "react-hot-toast";

const QRCodeModal = ({ isOpen, onClose, wallet }) => {
  const handleCopyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard
        .writeText(wallet.address)
        .then(() => {
          toast.success("Address copied to clipboard!");
        })
        .catch((err) => {
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

          <QRCodeSVG
            value={wallet.address}
            size={200}
            level="H"
            bgColor="#ffffff"
includeMargin={true}
          />

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
