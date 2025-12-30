import React, { useState } from "react";
import { Shield, CheckCircle, XCircle, Loader2, QrCode } from "lucide-react";
import {
  use2FAStatus,
  useEnable2FA,
  useVerify2FASetup,
  useDisable2FA,
} from "../../hooks/use2FA";
import toast from "react-hot-toast";

export default function Security() {
  const { is2FAEnabled, isLoading: isLoadingStatus } = use2FAStatus();
  const { enable2FAFn, isPending: isEnabling } = useEnable2FA();
  const { verify2FASetupFn, isPending: isVerifying } = useVerify2FASetup();
  const { disable2FAFn, isPending: isDisabling } = useDisable2FA();

  const [setupStep, setSetupStep] = useState("idle"); // idle, qr, verify
  const [qrCodeData, setQrCodeData] = useState(null);
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [disableCode, setDisableCode] = useState("");

  const handleEnable2FA = async () => {
    try {
      const response = await enable2FAFn();
      // Assuming the API returns { qrCode: "...", secret: "..." }
      setQrCodeData(response?.data?.qrCode || response?.qrCode);
      setSecret(response?.data?.secret || response?.secret || "");
      setSetupStep("qr");
    } catch (error) {
      console.error("Error enabling 2FA:", error);
    }
  };

  const handleVerifySetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      await verify2FASetupFn(verificationCode);
      setSetupStep("idle");
      setQrCodeData(null);
      setSecret("");
      setVerificationCode("");
    } catch (error) {
      console.error("Error verifying 2FA:", error);
    }
  };

  const handleDisable2FA = async () => {
    if (!disableCode || disableCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      await disable2FAFn(disableCode);
      setDisableCode("");
    } catch (error) {
      console.error("Error disabling 2FA:", error);
    }
  };

  const handleOtpChange = (value, setter) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setter(numericValue);
  };

  if (isLoadingStatus) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-c-color" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Two-Factor Authentication Section */}
      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Two-Factor Authentication
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Add an extra layer of security to your account
          </p>
        </div>

        {/* 2FA Status */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {is2FAEnabled ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">2FA is Enabled</p>
                    <p className="text-sm text-gray-500">
                      Your account is protected with two-factor authentication
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">2FA is Disabled</p>
                    <p className="text-sm text-gray-500">
                      Enable 2FA to secure your account
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Enable 2FA Flow */}
        {!is2FAEnabled && setupStep === "idle" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>How it works:</strong> Scan the QR code with an authenticator
                app (Google Authenticator, Authy, etc.) and enter the verification code
                to enable 2FA.
              </p>
            </div>
            <button
              onClick={handleEnable2FA}
              disabled={isEnabling}
              className="px-6 py-2.5 bg-c-color text-white rounded-lg hover:bg-c-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {isEnabling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Setting up...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Enable 2FA</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* QR Code Display */}
        {setupStep === "qr" && qrCodeData && (
          <div className="space-y-4 border border-gray-200 rounded-lg p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Scan QR Code
              </h3>
              <button
                onClick={() => {
                  setSetupStep("idle");
                  setQrCodeData(null);
                  setSecret("");
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <img
                  src={qrCodeData}
                  alt="2FA QR Code"
                  className="w-48 h-48"
                />
              </div>

              {secret && (
                <div className="w-full max-w-md">
                  <p className="text-xs text-gray-500 mb-2 text-center">
                    Can't scan? Enter this code manually:
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <code className="text-sm font-mono text-gray-800 break-all">
                      {secret}
                    </code>
                  </div>
                </div>
              )}

              <div className="w-full max-w-md space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, setVerificationCode)
                  }
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none text-center text-2xl tracking-widest font-mono"
                />
                <p className="text-xs text-gray-500 text-center">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <button
                onClick={handleVerifySetup}
                disabled={isVerifying || verificationCode.length !== 6}
                className="w-full max-w-md px-6 py-2.5 bg-c-color text-white rounded-lg hover:bg-c-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  "Verify & Enable 2FA"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Disable 2FA */}
        {is2FAEnabled && (
          <div className="space-y-4 border border-red-200 rounded-lg p-6 bg-red-50">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Disable 2FA</h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter your current 2FA code to disable two-factor authentication.
                This will make your account less secure.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Enter Current 2FA Code
              </label>
              <input
                type="text"
                value={disableCode}
                onChange={(e) => handleOtpChange(e.target.value, setDisableCode)}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none text-center text-2xl tracking-widest font-mono"
              />
            </div>

            <button
              onClick={handleDisable2FA}
              disabled={isDisabling || disableCode.length !== 6}
              className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {isDisabling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Disabling...</span>
                </>
              ) : (
                "Disable 2FA"
              )}
            </button>
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Password Management Section */}
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold text-lg text-gray-900">
            Password Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Change or reset your password
          </p>
        </div>
        <button className="px-6 py-2.5 bg-c-color text-white rounded-lg hover:bg-c-bg transition-colors font-medium">
          Change Password
        </button>
      </div>
    </div>
  );
}
