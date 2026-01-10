import React from "react";
import { Wallet as WalletIcon, BookUser, ShieldCheck } from "lucide-react";

export default function BottomBar() {
  const navItems = [
    { icon: WalletIcon, label: "Wallet", active: true },
    { icon: BookUser, label: "Address Book", active: false },
    { icon: ShieldCheck, label: "Security", active: false },
  ];

  return (
    <>
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full bg-white border-t border-gray-100 px-3 py-2 rounded-full  z-50 max-w-fit mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-1 group"
            >
              <div
                className={`p-2 rounded-full transition-colors ${
                  item.active
                    ? "bg-c-color text-white"
                    : "text-gray-400 group-hover:bg-gray-50 group-hover:text-gray-600"
                }`}
              >
                <item.icon className={`w-6 h-6 ${item.active ? "" : ""}`} />{" "}
                <span> {item.label} </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
