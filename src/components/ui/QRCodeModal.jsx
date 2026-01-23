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
      <div className="relative w-full max-w-md mx-auto overflow-hidden space-y-4 place-items-center">
        <div className="text-center space-y-2">
          <p className="text-sm text-white">
            {truncateAddress(wallet.address)}
          </p>
        </div>
        <div className="flex items-center justify-center w-fit rounded-[48px] overflow-hidden">
          <QRCodeSVG
            value={wallet.address}
            size={300}
            round={true}
            bgColor="#ffffff"
            level="L"
            marginSize={5}
            // imageSettings={{
            //   src: "/gloc-logo.svg",
            //   x: undefined,
            //   y: undefined,
            //   height: 40,
            //   width: 40,
            //   opacity: 1,
            //   excavate: true,
            // }}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={onClose}
            className="w-fit py-3 px-6 bg-c-color text-white rounded-lg text-sm font-medium hover:bg-c-color/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
