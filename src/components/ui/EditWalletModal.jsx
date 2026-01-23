import React, { useState, useRef } from "react";
import { X, MoreHorizontal } from "lucide-react";

// Background gradients (20 gradient options)
const BACKGROUND_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Purple to Purple
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", // Pink to Red
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", // Blue to Cyan
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", // Green to Teal
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", // Pink to Yellow
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", // Cyan to Purple
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", // Light Blue to Pink
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", // Pink to Light Pink
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", // Peach to Orange
  "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)", // Red to Dark Red
  "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)", // Teal to Green
  "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)", // Yellow to Orange
  "linear-gradient(135deg, #81ecec 0%, #74b9ff 100%)", // Light Blue to Blue
  "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)", // Light Purple to Purple
  "linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)", // Pink to Yellow
  "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)", // Purple to Light Purple
  "linear-gradient(135deg, #00b894 0%, #00cec9 100%)", // Green to Cyan
  "linear-gradient(135deg, #e17055 0%, #d63031 100%)", // Orange to Red
  "linear-gradient(135deg, #2d3436 0%, #636e72 100%)", // Dark Gray to Gray
  "linear-gradient(135deg, #000000 0%, #434343 100%)"  // Black to Dark Gray
];

const EditWalletModal = ({ isOpen, onClose, wallet, onSave }) => {
  const [walletName, setWalletName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedGradient, setSelectedGradient] = useState(BACKGROUND_GRADIENTS[0]);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);


  // Initialize form when wallet changes
  React.useEffect(() => {
    if (wallet) {
      setWalletName(wallet.name || "");
      setSelectedImage(wallet.image || null);
      setSelectedGradient(wallet.gradient || BACKGROUND_GRADIENTS[0]);
      setImagePreview(wallet.image || null);
    } else {
      // Reset form when wallet is null
      setWalletName("");
      setSelectedImage(null);
      setSelectedGradient(BACKGROUND_GRADIENTS[0]);
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
      };
      reader.readAsDataURL(file);
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
      gradient: selectedGradient,
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
          <div className="flex items-center justify-between w-full gap-4">
            {/* Wallet Icon Display */}
            <div className="relative">
              <div
                className="w-30 h-30 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200"
                style={{ background: selectedGradient }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Wallet"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full"></div>
                )}
              </div>
              
              {/* Image Upload Button */}
              <div className="relative mt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imagePreview && (
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Background Gradient Picker */}
            <div className="">
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Background Gradient
              </label>
              <div className="grid grid-cols-6 gap-2 w-fit">
                {BACKGROUND_GRADIENTS.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedGradient(gradient)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      selectedGradient === gradient
                        ? "ring-2 ring-gray-900 ring-offset-2"
                        : "hover:scale-110"
                    }`}
                    style={{ background: gradient }}
                    title={`Gradient ${index + 1}`}
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
