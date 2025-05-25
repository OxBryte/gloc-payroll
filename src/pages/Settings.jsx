import React, { useState } from "react";

const settingsData = [
  {
    id: 1,
    name: "Account",
    component: "",
  },
  {
    id: 2,
    name: "Verify",
    component: "",
  },
  {
    id: 3,
    name: "Security",
    component: "",
  },
  {
    id: 4,
    name: "Preferences",
    component: "",
  },
  {
    id: 5,
    name: "Wallets",
    component: "",
  },
];

export default function Settings() {
  const [activeTabId, setActiveTabId] = useState(settingsData[0].id);
  const activeTab = settingsData.find((tab) => tab.id === activeTabId);

  return (
    <div className="w-full space-y-5">
      <p className="text-white font-bold text-xl">Settings</p>
      <div className="flex gap-5 w-full items-top">
        <div className="flex flex-col w-[15rem] p-4 bg-c-bg rounded-lg">
          {settingsData.map((item) => {
            const isActive = item.id === activeTabId;
            return (
              <div key={item.id} className="flex">
                <button
                  onClick={() => setActiveTabId(item.id)}
                  className={`flex items-center w-full h-[50px] px-3 ml-2 text-sm font-light rounded-lg hover:opacity-70 cursor-pointer transition ${
                    isActive ? "bg-c-bg-2 text-white" : "text-gray-300"
                  }`}
                >
                  <span className="ml-2">{item.name}</span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex-1 p-4 bg-c-bg rounded-lg">
          {activeTab?.component}
        </div>
      </div>
    </div>
  );
}
