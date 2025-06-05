// src/lib/usePayrollContract.ts
import { usePublicClient, useWalletClient } from "wagmi";
import { getContract } from "viem";
import { contractABI, contractAddress } from "../constants/contractABI";

export function usePayrollContract() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const readContract = getContract({
    address: contractAddress,
    abi: contractABI,
    client: publicClient,
  });

  const writeContract = walletClient
    ? getContract({
        address: contractAddress,
        abi: contractABI,
        client: walletClient,
      })
    : null;

  return { readContract, writeContract };
}
