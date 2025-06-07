import React from 'react'

export default function Security() {
    return <div className="w-full space-y-6">
        <div className="space-y-3">
            <p className="font-semibold text-lg">Security Settings</p>
            <p className="text-xs font-light">Manage your security settings</p>
            <div className="space-y-2">
                <p className="text-sm font-light">Two-Factor Authentication</p>
                <button className="px-4 py-2 bg-c-color text-white rounded-lg hover:bg-c-color-dark transition">
                    Enable 2FA
                </button>
            </div>
        </div>
        <hr className="border-black/10" />
        <div className="space-y-3">
            <p className="font-semibold text-lg">Password Management</p>
            <p className="text-xs font-light">Change or reset your password</p>
            <button className="px-4 py-2 bg-c-color text-white rounded-lg hover:bg-c-color-dark transition">
                Change Password
            </button>
        </div>
        <hr className="border-black/10" />
        <div className="space-y-3">
            <p className="font-semibold text-lg">Login History</p>
            <p className="text-xs font-light">View your recent login activity</p>
            <button className="px-4 py-2 bg-c-color text-white rounded-lg hover:bg-c-color-dark transition">
                View Login History
            </button>
        </div>
        <hr className="border-black/10" />
        <div className="space-y-3">
            <p className="font-semibold text-lg">Account Recovery</p>
            <p className="text-xs font-light">Set up account recovery options</p>
            <button className="px-4 py-2 bg-c-color text-white rounded-lg hover:bg-c-color-dark transition">
                Set Up Recovery Options
            </button>
        </div>
  </div>;
}
