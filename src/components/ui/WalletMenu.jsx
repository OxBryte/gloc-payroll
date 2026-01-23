import React, { useState, useEffect, useRef } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";

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
        className={`cursor-pointer hover:text-c-bg transition-colors duration-300 ${showMenu ? 'text-c-bg' : 'text-gray-400'}`}
        onClick={handleMenuClick}
      />
      {showMenu && (
        <div className="absolute right-0 top-8 z-50 w-48 bg-c-bg text-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => handleMenuOption("edit-name")}
            className="w-full text-left px-4 py-2.5 text-[12px] text-white hover:bg-c-color/80 transition-colors"
          >
            Edit Name
          </button>
          <button
            onClick={() => handleMenuOption("edit-picture")}
            className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-c-color/80 transition-colors"
          >
            Edit Picture
          </button>
          <button
            onClick={() => handleMenuOption("transactions")}
            className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-c-color/80 transition-colors"
          >
            Transactions
          </button>
          <button
            onClick={() => handleMenuOption("copy-address")}
            className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-c-color/80 transition-colors"
          >
            Copy Address
          </button>
          <button
            onClick={() => handleMenuOption("qr-code")}
            className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-c-color/80 transition-colors"
          >
            QR Code
          </button>
          <button
            onClick={() => handleMenuOption("export-wallet")}
            className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-c-color/80 transition-colors border-t border-gray-100"
          >
            Export Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletMenu;
