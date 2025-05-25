import React, { useState } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  MoreHorizontal,
  Check,
  AlertCircle,
  Clock,
} from "lucide-react";

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    domains: true,
    integrations: false,
    webhooks: false,
  });
  const [storeName, setStoreName] = useState("Premium Pixels");
  const [contactEmail, setContactEmail] = useState("premiumpixels@email.com");

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const domains = [
    {
      id: 1,
      url: "premiumpixels.lemonsqueezy.com",
      addedDate: "1 Oct 2021",
      status: "connected",
      isPrimary: true,
    },
    {
      id: 2,
      url: "www.premiumpixels.com",
      addedDate: "23 Nov 2021",
      status: "failed",
    },
    {
      id: 3,
      url: "premiumpixels.com",
      addedDate: "23 Nov 2021",
      status: "verifying",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected":
        return <Check className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "verifying":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "failed":
        return "Verification failed";
      case "verifying":
        return "Verifying";
      default:
        return "";
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        Open Store Settings
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black bg-opacity-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Store Settings
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your store settings and integrations.
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* General Section */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection("general")}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-base font-medium text-gray-900">General</h3>
              {expandedSections.general ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.general && (
              <div className="space-y-6 pl-0">
                {/* Avatar */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Avatar
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">PP</span>
                    </div>
                    <div className="flex-1">
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                        Change
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, GIF or PNG. 1MB Max.
                      </p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Store Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Store name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Will appear on receipts, invoices, and other communication.
                  </p>
                </div>

                {/* Contact Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Contact email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Shown in email receipts, and product updates.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Domains Section */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection("domains")}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-medium text-gray-900">Domains</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  (3)
                </span>
              </div>
              {expandedSections.domains ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.domains && (
              <div className="space-y-4 pl-0">
                <p className="text-sm text-gray-600">
                  Manage the domains for your online store.
                </p>

                <div className="space-y-3">
                  {domains.map((domain, index) => (
                    <div
                      key={domain.id}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-white rounded border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {domain.status === "connected" && (
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-green-600" />
                            </div>
                          )}
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {domain.url}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">
                            Added {domain.addedDate}
                          </p>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(domain.status)}
                            <span
                              className={`text-xs ${
                                domain.status === "connected"
                                  ? "text-green-600"
                                  : domain.status === "failed"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {getStatusText(domain.status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {domain.isPrimary ? (
                          <div className="relative">
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        ) : (
                          <div className="relative">
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Connect new domain
                </button>
              </div>
            )}
          </div>

          {/* Integrations Section */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection("integrations")}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-medium text-gray-900">
                  Integrations
                </h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  (3)
                </span>
              </div>
              {expandedSections.integrations ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.integrations && (
              <div className="pl-0">
                <p className="text-sm text-gray-600">
                  No integrations configured yet.
                </p>
              </div>
            )}
          </div>

          {/* Webhooks Section */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection("webhooks")}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-medium text-gray-900">
                  Webhooks
                </h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  (2)
                </span>
              </div>
              {expandedSections.webhooks ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.webhooks && (
              <div className="pl-0">
                <p className="text-sm text-gray-600">
                  No webhooks configured yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
