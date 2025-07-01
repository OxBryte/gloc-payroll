import React from "react";
import {
  AutoConnect,
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import { client } from "../../client";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";

export default function ConnectButtons() {
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;

  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  return address ? (
    <div className="space-y-1">
      <p className="w-full px-5 py-3 rounded-xl bg-c-color text-white">
        Connected address: <br /> {address}
      </p>
      <button onClick={() => disconnect(wallet)}>Disconnect</button>
    </div>
  ) : (
    <ConnectButton client={client} chain={BaseSepoliaTestnet} />
    // <AutoConnect client={client} />
  );
}
