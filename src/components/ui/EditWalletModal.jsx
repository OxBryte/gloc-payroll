import React, { useState, useRef } from "react";
import { X, MoreHorizontal } from "lucide-react";

// Popular emojis for wallet icons
const POPULAR_EMOJIS = [
  "💰", "💳", "💵", "💴", "💶", "💷", "💸", "💊", "💎", "🏦",
  "🎯", "🚀", "⭐", "🌟", "💫", "🔥", "💪", "🎨", "🎭", "🎪",
  "🏝️", "🌴", "🌊", "⛰️", "🏔️", "🌅", "🌄", "🌈", "☀️", "🌙",
  "🦄", "🐉", "🦁", "🐯", "🐻", "🐼", "🐨", "🦊", "🐰", "🐶",
  "🎮", "🎲", "🃏", "🎴", "🀄", "🎰", "🎸", "🎺", "🎻", "🎹",
  "🍕", "🍔", "🍟", "🌮", "🌯", "🍜", "🍱", "🍣", "🍙", "🍘",
  "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸",
  "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐",
  "🎁", "🎀", "🎂", "🎃", "🎄", "🎅", "🤶", "🧑‍🎄", "🎆", "🎇"
];

// Background colors (12 major colors)
const BACKGROUND_COLORS = [
  "#FF6B9D", // Hot Pink
  "#DC143C", // Crimson
  "#4169E1", // Royal Blue
  "#00CED1", // Dark Turquoise
  "#9370DB", // Medium Slate Blue
  "#32CD32", // Lime Green
  "#228B22", // Forest Green
  "#FFD700", // Gold
  "#FF8C00", // Dark Orange
  "#8B4513", // Saddle Brown
  "#708090", // Slate Gray
  "#000000"  // Black
];

const EditWalletModal = ({ isOpen, onClose, wallet, onSave }) => {
  const [walletName, setWalletName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedBgColor, setSelectedBgColor] = useState("#000000");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Close emoji picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Initialize form when wallet changes
  React.useEffect(() => {
    if (wallet) {
      setWalletName(wallet.name || "");
      setSelectedImage(wallet.image || null);
      setSelectedEmoji(wallet.emoji || null);
      setSelectedBgColor(wallet.bgColor || "#000000");
      setImagePreview(wallet.image || null);
    } else {
      // Reset form when wallet is null
      setWalletName("");
      setSelectedImage(null);
      setSelectedEmoji(null);
      setSelectedBgColor("#000000");
      setImagePreview(null);
    }
  }, [wallet]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result;
        setImagePreview(imageDataUrl);
        setSelectedImage(imageDataUrl);
        setSelectedEmoji(null); // Clear emoji when image is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    setSelectedImage(null); // Clear image when emoji is selected
    setImagePreview(null);
    setShowEmojiPicker(false);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (!walletName.trim()) {
      alert("Please enter a wallet name");
      return;
    }

    if (!wallet) {
      console.error("No wallet provided to edit");
      return;
    }

    onSave({
      ...wallet,
      name: walletName.trim(),
      image: selectedImage,
      emoji: selectedEmoji,
      bgColor: selectedBgColor,
    });
    onClose();
  };

  if (!isOpen || !wallet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 ">Edit Wallet</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Wallet Icon Section */}
          <div className="flex items-start gap-4">
            {/* Wallet Icon Display */}
            <div className="relative">
              <div
                className="w-30 h-30 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200"
                style={{ backgroundColor: selectedBgColor }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Wallet"
                    className="w-full h-full object-cover"
                  />
                ) : selectedEmoji ? (
                  <span className="text-4xl">{selectedEmoji}</span>
                ) : (
                  <div className="w-full h-full bg-gray-300"></div>
                )}
              </div>
              
              {/* Options Button */}
              <div className="relative mt-2">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                </button>

                {/* Emoji/Image Picker Dropdown */}
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-64 max-h-80 overflow-y-auto"
                  >
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">
                          Upload Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => {
                            fileInputRef.current?.click();
                            setShowEmojiPicker(false);
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Choose Image
                        </button>
                      </div>
                      {imagePreview && (
                        <button
                          onClick={() => {
                            handleRemoveImage();
                            setShowEmojiPicker(false);
                          }}
                          className="w-full px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Remove Image
                        </button>
                      )}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">
                          Select Emoji
                        </label>
                        <div className="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto">
                          {POPULAR_EMOJIS.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                handleEmojiSelect(emoji);
                                setShowEmojiPicker(false);
                              }}
                              className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors text-xl ${
                                selectedEmoji === emoji ? "bg-c-color/20 ring-2 ring-c-color" : ""
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Background Color Picker */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Background Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUND_COLORS.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedBgColor(color)}
                    className={`w-10 h-10 rounded-full transition-all ${
                      selectedBgColor === color
                        ? "ring-2 ring-gray-900 ring-offset-2"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Wallet Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Wallet Name
            </label>
            <input
              type="text"
              placeholder="Enter wallet name"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="w-full py-3 px-6 bg-c-color text-white rounded-lg text-sm font-medium hover:bg-c-color/90 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditWalletModal;
