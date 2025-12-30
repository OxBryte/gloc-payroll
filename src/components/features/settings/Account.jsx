import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateUser, useUser } from "../../hooks/useUser";
import { Camera, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

export default function Account() {
  const { user } = useUser();
  const { updateUserFn, isPending } = useUpdateUser();
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    },
  });

  // Reset form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        username: user?.username || "",
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        bio: user?.bio || "",
      });
      setAvatarPreview(user?.avatar || null);
    }
  }, [user, reset]);

  const MAX_SIZE_MB = 3;

  const handleUploadClick = () => {
    setError("");
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const fileType = file.type.toLowerCase();

    if (!allowedTypes.includes(fileType)) {
      setError(
        "Only JPG, JPEG, PNG, and GIF files are allowed."
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const hasValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!hasValidExtension) {
      setError(
        "Invalid file format. Please upload JPG, JPEG, PNG, or GIF files only."
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > MAX_SIZE_MB) {
      setError(`File size exceeds ${MAX_SIZE_MB}MB. Please upload a smaller image.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setAvatarFile(file);
    setError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      if (data.username) formData.append("username", data.username);
      if (data.fullName) formData.append("fullName", data.fullName);
      if (data.email) formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.bio) formData.append("bio", data.bio);

      // Append avatar file if selected
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await updateUserFn(formData);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const currentAvatar = avatarPreview || user?.avatar;

  return (
    <div className="w-full space-y-8">
      {/* Avatar Section */}
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold text-lg text-gray-900">Profile Picture</h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload a new profile picture (JPG, PNG, GIF - Max 3MB)
          </p>
        </div>

        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={user?.fullName || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-2xl font-semibold">
                  {user?.fullName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            {avatarFile && (
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Remove new avatar"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/jpg,image/png,image/gif"
              className="hidden"
            />
            <button
              type="button"
              onClick={handleUploadClick}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Camera className="w-4 h-4" />
              {avatarFile ? "Change Photo" : "Upload Photo"}
            </button>
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Personal Information Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="font-semibold text-lg text-gray-900 mb-1">
            Personal Information
          </h2>
          <p className="text-sm text-gray-500">
            Update your personal details and contact information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Username
            </label>
            <input
              type="text"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
              placeholder="Enter your username"
            />
            {errors.username && (
              <span className="text-xs text-red-500">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Full Name
            </label>
            <input
              type="text"
              {...register("fullName", {
                required: "Full name is required",
              })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <span className="text-xs text-red-500">
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <span className="text-xs text-red-500">
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Bio
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none resize-none"
            placeholder="Tell us about yourself..."
          />
          <p className="text-xs text-gray-500">
            A short description about yourself (optional)
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-c-color text-white rounded-lg hover:bg-c-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
