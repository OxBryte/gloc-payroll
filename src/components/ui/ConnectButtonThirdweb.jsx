import React from "react";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import { client } from "../../client";
import { baseSepolia } from "thirdweb/chains";
import { usePayrollContractThirdweb } from "../hooks/usePayrollContractThirdweb";
import { useUSDCApprovalThirdweb } from "../hooks/useUSDCApprovalThirdweb";
import { createPaymentArray, convertTaxToUSDC } from "../lib/utils";

export default function ConnectButtonThirdweb({
  selectedEmployees = [],
  totalTax = 0,
}) {
  // Thirdweb wallet connection
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  // Smart contract interactions (Thirdweb)
  const {
    usdcAddress,
    usdtAddress,
    owner,
    isPaused,
    isPending,
    isConfirming,
    isSuccess,
    txHash,
    error: contractError,
    pause,
    unpause,
    withdrawTax,
    distributePayrollUSDC,
    isLoadingUSDC,
    isLoadingUSDT,
    isLoadingOwner,
    isLoadingPaused,
    validateContract,
  } = usePayrollContractThirdweb();

  // USDC approval functionality (Thirdweb)
  const {
    currentAllowance,
    usdcBalance,
    isApproving,
    isApprovalConfirming,
    isApprovalSuccess,
    approveUSDCSpending,
    needsApproval,
    error: approvalError,
    isLoadingAllowance,
    isLoadingBalance,
  } = useUSDCApprovalThirdweb();

  // Create payment array and convert tax for smart contract
  const handleDistributePayroll = async () => {
    if (selectedEmployees.length === 0) {
      alert("Please select employees first");
      return;
    }

    try {
      // Create payment array with only address and salary (converted to USDC)
      const paymentArray = createPaymentArray(selectedEmployees);

      // Convert tax to USDC BigNumber
      const taxAmountUSDC = convertTaxToUSDC(totalTax);

      // Calculate total amount needed (salaries + tax)
      const totalSalaryUSDC = paymentArray.reduce(
        (sum, payment) => sum + payment.amount,
        0n
      );
      const totalAmountNeeded = totalSalaryUSDC + taxAmountUSDC;

      // console.log("Selected Employees:", selectedEmployees);
      // console.log("Payment Array:", paymentArray);
      // console.log("Tax Amount (USDC):", taxAmountUSDC.toString());
      // console.log("Total Amount Needed:", totalAmountNeeded.toString());
      // console.log("Current Allowance:", currentAllowance?.toString() || "0");
      // console.log("USDC Balance:", usdcBalance?.toString() || "0");

      // Check if approval is needed
      if (needsApproval(totalAmountNeeded)) {
        console.log(
          "Approval needed. Current allowance:",
          currentAllowance?.toString()
        );
        console.log("Required amount:", totalAmountNeeded.toString());
        await approveUSDCSpending(totalAmountNeeded);
        return;
      }

      // Check if user has enough USDC balance
      if (usdcBalance && usdcBalance < totalAmountNeeded) {
        alert(
          `Insufficient USDC balance. You have ${usdcBalance.toString()} wei, but need ${totalAmountNeeded.toString()} wei.`
        );
        return;
      }
      
      // Format for contract (array of arrays)
      // const formattedPayments = paymentArray.map((payment) => [
      //   payment.recipient,
      //   payment.amount,
      // ]);
      // console.log("Formatted for Contract:", formattedPayments);
      console.log("Payment Array", paymentArray)

      // Call the smart contract function
      await distributePayrollUSDC(paymentArray, taxAmountUSDC);
    } catch (error) {
      console.error("Error distributing payroll:", error);
      alert("Error distributing payroll. Please try again.");
    }
  };

  if (address) {
    return (
      <div className="space-y-4 p-4 border rounded-lg">
        {/* Connection Status */}
        <div className="space-y-2">
          <p className="w-full px-5 py-3 rounded-xl bg-c-color text-white">
            Connected address: <br /> {address}
          </p>
          <button
            onClick={() => disconnect(wallet)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Disconnect
          </button>
        </div>

        {/* Error Display */}
        {(contractError || approvalError) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              Error: {contractError || approvalError}
            </p>
          </div>
        )}

        {/* Contract Information */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Smart Contract Info</h3>

          {/* Debug Information */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Debug Info:</h4>
            <div className="text-xs space-y-1">
              <p>
                <strong>Contract Status:</strong>{" "}
                {isLoadingUSDC ||
                isLoadingUSDT ||
                isLoadingOwner ||
                isLoadingPaused
                  ? "⏳ Loading..."
                  : "✅ Ready"}
              </p>
              <p>
                <strong>USDC Data:</strong>{" "}
                {isLoadingAllowance || isLoadingBalance
                  ? "⏳ Loading..."
                  : "✅ Loaded"}
              </p>
              <p>
                <strong>Owner:</strong>{" "}
                {owner
                  ? `${owner.slice(0, 6)}...${owner.slice(-4)}`
                  : "Loading..."}
              </p>
              <p>
                <strong>Chain:</strong> Base Sepolia (84532)
              </p>
            </div>
            <button
              onClick={async () => {
                const isValid = await validateContract();
                console.log("Contract validation result:", isValid);
                alert(`Contract validation: ${isValid ? "SUCCESS" : "FAILED"}`);
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Test Contract
            </button>
          </div>

          <div className="text-sm space-y-1">
            <p>
              <strong>Contract Owner:</strong>{" "}
              {owner
                ? `${owner.slice(0, 6)}...${owner.slice(-4)}`
                : "Loading..."}
            </p>
            <p>
              <strong>USDC Address:</strong>{" "}
              {usdcAddress
                ? `${usdcAddress.slice(0, 6)}...${usdcAddress.slice(-4)}`
                : "Loading..."}
            </p>
            <p>
              <strong>USDT Address:</strong>{" "}
              {usdtAddress
                ? `${usdtAddress.slice(0, 6)}...${usdtAddress.slice(-4)}`
                : "Loading..."}
            </p>
            <p>
              <strong>Contract Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  isPaused
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {isPaused ? "Paused" : "Active"}
              </span>
            </p>
          </div>

          {/* Payroll Distribution */}
          {selectedEmployees.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="font-medium">Payroll Distribution</h4>

              <div className="text-sm space-y-1">
                <p>
                  <strong>Selected Employees:</strong>{" "}
                  {selectedEmployees.length}
                </p>
                <p>
                  <strong>Total Tax:</strong> ${totalTax.toLocaleString()}
                </p>
                <p>
                  <strong>Tax (USDC):</strong>{" "}
                  {convertTaxToUSDC(totalTax).toString()} wei
                </p>

                {/* USDC Balance and Allowance Info */}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <h5 className="text-sm font-medium mb-2">USDC Status:</h5>
                  <div className="text-xs space-y-1">
                    <p>
                      <strong>Balance:</strong>{" "}
                      {usdcBalance
                        ? `${usdcBalance?.toString()} wei`
                        : "Loading..."}
                    </p>
                    <p>
                      <strong>Allowance:</strong>{" "}
                      {currentAllowance
                        ? `${currentAllowance.toString()} wei`
                        : "Loading..."}
                    </p>
                    {selectedEmployees.length > 0 && (
                      <p>
                        <strong>Required:</strong>{" "}
                        {(() => {
                          const paymentArray =
                            createPaymentArray(selectedEmployees);
                          const totalSalaryUSDC = paymentArray.reduce(
                            (sum, payment) => sum + payment.amount,
                            0n
                          );
                          const totalAmountNeeded =
                            totalSalaryUSDC + convertTaxToUSDC(totalTax);
                          return `${totalAmountNeeded.toString()} wei`;
                        })()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  className="flex-1 py-4 px-6 bg-c-color text-white cursor-pointer rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={handleDistributePayroll}
                  disabled={
                    isPending ||
                    isConfirming ||
                    isPaused ||
                    isApproving ||
                    isApprovalConfirming
                  }
                >
                  {isApproving || isApprovalConfirming
                    ? "Approving..."
                    : isPending || isConfirming
                    ? "Processing..."
                    : "Distribute Payroll"}
                </button>

                {/* Manual Approval Button */}
                {selectedEmployees.length > 0 && (
                  <button
                    onClick={async () => {
                      const paymentArray =
                        createPaymentArray(selectedEmployees);
                      const totalSalaryUSDC = paymentArray.reduce(
                        (sum, payment) => sum + payment.amount,
                        0n
                      );
                      const totalAmountNeeded =
                        totalSalaryUSDC + convertTaxToUSDC(totalTax);
                      await approveUSDCSpending(totalAmountNeeded);
                    }}
                    disabled={
                      isApproving ||
                      isApprovalConfirming ||
                      isPending ||
                      isConfirming
                    }
                    className="px-4 py-4 bg-blue-600 text-white cursor-pointer rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Approve USDC
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Contract Actions (only for owner) */}
          {owner &&
            address &&
            owner.toLowerCase() === address.toLowerCase() && (
              <div className="space-y-2 pt-2">
                <h4 className="font-medium">Owner Actions</h4>
                <div className="flex gap-2">
                  <button
                    onClick={isPaused ? unpause : pause}
                    disabled={isPending || isConfirming}
                    className={`px-3 py-1 rounded text-sm ${
                      isPaused
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    } disabled:opacity-50`}
                  >
                    {isPending || isConfirming
                      ? "Processing..."
                      : isPaused
                      ? "Unpause"
                      : "Pause"}
                  </button>

                  {usdcAddress && (
                    <button
                      onClick={() => withdrawTax(usdcAddress)}
                      disabled={isPending || isConfirming}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:opacity-50"
                    >
                      Withdraw USDC Tax
                    </button>
                  )}

                  {usdtAddress && (
                    <button
                      onClick={() => withdrawTax(usdtAddress)}
                      disabled={isPending || isConfirming}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:opacity-50"
                    >
                      Withdraw USDT Tax
                    </button>
                  )}
                </div>
              </div>
            )}

          {/* Transaction Status */}
          {(isPending ||
            isConfirming ||
            isSuccess ||
            isApproving ||
            isApprovalConfirming ||
            isApprovalSuccess) && (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              {isApproving && (
                <p className="text-sm text-blue-600">
                  Approving USDC spending...
                </p>
              )}
              {isApprovalConfirming && (
                <p className="text-sm text-yellow-600">
                  Confirming USDC approval...
                </p>
              )}
              {isApprovalSuccess && (
                <p className="text-sm text-green-600">
                  USDC approval successful!
                </p>
              )}
              {isPending && (
                <p className="text-sm text-blue-600">Transaction pending...</p>
              )}
              {isConfirming && (
                <p className="text-sm text-yellow-600">
                  Confirming transaction...
                </p>
              )}
              {isSuccess && (
                <p className="text-sm text-green-600">
                  Transaction successful!
                </p>
              )}
              {txHash && (
                <p className="text-xs text-gray-600">Tx Hash: {txHash}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <ConnectButton client={client} chain={baseSepolia} />;
}
