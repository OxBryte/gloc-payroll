import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { LuSend, LuArrowRight, LuArrowLeft } from "react-icons/lu";
import toast from "react-hot-toast";

const SendModal = ({ isOpen, onClose, wallet }) => {
  const [step, setStep] = useState(1);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setRecipientAddress("");
      setAmount("");
      setIsSending(false);
    }
  }, [isOpen]);

  if (!isOpen || !wallet) return null;

  const handleNextStep = () => {
    if (!recipientAddress.trim()) {
      toast.error("Please enter a recipient address");
      return;
    }
    // Basic ETH address validation (simple check)
    if (!recipientAddress.startsWith("0x") || recipientAddress.length !== 42) {
      toast.error("Please enter a valid wallet address");
      return;
    }
    setStep(2);
  };

  const handleSend = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSending(true);
    // Simulate transaction delay
    setTimeout(() => {
      toast.success(`Successfully sent ${amount} ETH to ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`);
      setIsSending(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#121212] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button 
                onClick={() => setStep(1)}
                className="p-1 hover:bg-white/5 rounded-full transition-colors text-gray-400"
              >
                <LuArrowLeft size={20} />
              </button>
            )}
            <h3 className="text-xl font-semibold text-white">Send Assets</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Wallet Source Info */}
          <div className="mb-6 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border border-white/20"
              style={{ background: wallet.gradient }}
            >
              {wallet.image ? (
                <img src={wallet.image} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold text-xs">{wallet.name[0]}</span>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400">Sending from</p>
              <p className="text-sm font-medium text-white">{wallet.name} ({wallet.balance} ETH)</p>
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-c-bg transition-colors"
                />
              </div>
              <button
                onClick={handleNextStep}
                className="w-full bg-c-bg hover:opacity-90 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
              >
                Continue
                <LuArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">Recipient</p>
                <p className="text-white bg-[#1A1A1A] px-4 py-3 rounded-xl border border-white/5 font-mono text-sm break-all">
                  {recipientAddress}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Amount (ETH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-c-bg transition-colors text-2xl font-semibold"
                  />
                  <button 
                    onClick={() => setAmount(wallet.balance.toString())}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] text-white uppercase font-bold transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={isSending}
                className="w-full bg-c-bg disabled:opacity-50 hover:opacity-90 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <LuSend size={18} />
                    Send Now
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendModal;
