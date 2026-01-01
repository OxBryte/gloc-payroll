import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Get all icon names from Lucide (filter out non-icon exports)
const getAvailableIcons = () => {
  return Object.keys(LucideIcons).filter(
    (key) =>
      isNaN(Number(key)) &&
      typeof LucideIcons[key] === "function" &&
      key[0] === key[0].toUpperCase() &&
      !["createLucideIcon", "Icon", "default", "lucideReactNative"].includes(key)
  );
};

const AVAILABLE_ICONS = getAvailableIcons();

export default function IconPicker({ selectedIcon, onSelectIcon, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return AVAILABLE_ICONS;
    }
    const query = searchQuery.toLowerCase();
    return AVAILABLE_ICONS.filter((iconName) =>
      iconName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleIconSelect = (iconName) => {
    onSelectIcon(iconName);
    onClose();
  };

  const SelectedIcon = LucideIcons[selectedIcon] || LucideIcons.HelpCircle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Select Icon</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredIcons.length > 0 ? (
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-3">
              {filteredIcons.map((iconName) => {
                const IconComponent = LucideIcons[iconName];
                if (!IconComponent) return null;

                const isSelected = selectedIcon === iconName;

                return (
                  <button
                    key={iconName}
                    onClick={() => handleIconSelect(iconName)}
                    className={`
                      p-3 rounded-lg border-2 transition-all
                      flex items-center justify-center
                      hover:bg-gray-50 hover:border-c-color
                      ${
                        isSelected
                          ? "bg-c-color/10 border-c-color"
                          : "border-gray-200"
                      }
                    `}
                    title={iconName}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        isSelected ? "text-c-color" : "text-gray-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No icons found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            {filteredIcons.length} icon{filteredIcons.length !== 1 ? "s" : ""}{" "}
            available
          </p>
        </div>
      </div>
    </div>
  );
}
