import React from "react";
import { Lock } from "lucide-react";

export default function Security() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-700" />
          <p className="font-semibold text-lg">Security Settings</p>
        </div>
        <p className="text-xs font-light text-gray-600">
          Manage your security settings and password
        </p>
      </div>
      <hr className="border-gray-200" />
      <div className="space-y-3">
        <p className="font-semibold text-lg">Password Management</p>
        <p className="text-xs font-light text-gray-600">
          Change or reset your password
        </p>
        <button className="px-4 py-2 bg-c-color text-white rounded-lg hover:bg-c-bg transition-colors font-medium">
          Change Password
        </button>
      </div>
    </div>
  );
}
