import React from "react";
import { Wallet as WalletIcon, BookUser, ShieldCheck } from "lucide-react";

export default function BottomBar() {
  const navItems = [
    { icon: WalletIcon, label: "Wallet", active: false },
    { icon: BookUser, label: "Address Book", active: false },
    { icon: ShieldCheck, label: "Security", active: true },
  ];

  return (
    <>
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full bg-white px-3 py-2 rounded-full shadow-md  z-50 max-w-fit mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item, index) => (
            <div
              key={index}
              className={`p-2 rounded-full flex items-center gap-2 transition-colors ${
                item.active ? "bg-c-color text-white" : "text-gray-400"
              }`}
            >
              <item.icon className={`w-6 h-6 ${item.active ? "" : ""}`} />
              {item.active && (
                <span className="text-xs font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
