import React, { useState, useEffect, useRef } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { LuPen, LuUser } from "react-icons/lu";

const WalletMenu = ({ onOptionSelect }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleMenuOption = (option) => {
    setShowMenu(false);
    if (onOptionSelect) {
      onOptionSelect(option);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <HiOutlineDotsVertical
        size={20}
        className={`cursor-pointer hover:text-c-bg transition-colors duration-300 ${showMenu ? "text-c-bg" : "text-gray-400"}`}
        onClick={handleMenuClick}
      />
      {showMenu && (
        <div className="absolute right-0 top-8 z-50 w-48 p-2 bg-c-bg text-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => handleMenuOption("edit-name")}
            className="w-full text-left px-2.5 py-1.5 flex items-center gap-2 text-[14px] font-light text-white/80 hover:bg-[#1F1F1F] rounded-lg transition-colors"
          >
            <LuPen size={14} />
            Edit Name
          </button>
          <button
            onClick={() => handleMenuOption("edit-picture")}
            className="w-full text-left px-2.5 py-1.5 flex items-center gap-2 text-[14px] font-light text-white/80 hover:bg-[#1F1F1F] rounded-lg transition-colors"
          >
            <LuUser size={14} />
            Edit Picture
          </button>
          <button
            onClick={() => handleMenuOption("transactions")}
            className="w-full text-left px-2.5 py-1.5 flex items-center gap-2 text-[14px] font-light text-white/80 hover:bg-[#1F1F1F] rounded-lg transition-colors"
          >
            Transactions
          </button>
          <button
            onClick={() => handleMenuOption("copy-address")}
            className="w-full text-left px-2.5 py-1.5 flex items-center gap-2 text-[14px] font-light text-white hover:bg-c-color/80 transition-colors"
          >
            Copy Address
          </button>
          <button
            onClick={() => handleMenuOption("qr-code")}
            className="w-full text-left px-2.5 py-1.5 flex items-center gap-2 text-[14px] font-light text-white hover:bg-c-color/80 transition-colors"
          >
            QR Code
          </button>
          <button
            onClick={() => handleMenuOption("export-wallet")}
            className="w-full text-left px-2.5 py-1.5 flex items-center gap-2 text-[14px] font-light text-white hover:bg-c-color/80 transition-colors"
          >
            Export Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletMenu;
