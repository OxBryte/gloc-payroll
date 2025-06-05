import React from "react";

export default function ConnectButton({ login }) {
  return (
    <>
      <div
        className="px-5 w-full py-3 flex justify-center rounded-md cursor-pointer transition-colors text-white bg-c-color hover:bg-c-bg"
        onClick={() => login()}
      >
        <span className="text-lg font-semibold">Connect Wallet</span>
      </div>
    </>
  );
}
