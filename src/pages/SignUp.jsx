import { Trash2, Eye, EyeOff, Check, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_SIZE_MB = 3;

  const handleUploadClick = () => {
    setError("");
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > MAX_SIZE_MB) {
      setError("File size exceeds 3MB. Please upload a smaller image.");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setImageFile(null);
    setImageSrc(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Enhanced password validation with individual checks
  const passwordValidation = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&#]/.test(password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      alert("Please ensure your password meets all requirements.");
      return;
    }

    alert("Form submitted successfully!");
  };

  const ValidationItem = ({ isValid, text }) => (
    <div
      className={`flex items-center gap-2 text-xs ${
        isValid ? "text-green-600" : "text-gray-500"
      }`}
    >
      {isValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="w-full max-w-[36rem] space-y-6 p-20">
      <div className="space-y-2 place-items-center">
        <div className="">
          <p>Logo</p>
        </div>
        <p className="font-semibold text-2xl ">Create a free account</p>
        <p className="font-light text-sm">
          Provide your details and choose a password
        </p>
      </div>
      <div className="space-y-7 w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex items-end space-x-4 justify-between">
            <div className="h-24 w-24 rounded-lg border border-dashed overflow-hidden relative">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1">
              <button
                type="button"
                className="text-c-color hover:text-c-color/50 font-medium text-sm"
                onClick={handleUploadClick}
              >
                Upload
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                JPG, GIF or PNG. 2MB Max.
              </p>
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              {imageSrc && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 flex gap-2 items-center text-sm text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 w-full">
            <p className="text-sm">Email*</p>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="p-3 w-full rounded-md border border-black/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2 w-full">
            <p className="text-sm">Full name*</p>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              className="p-3 w-full rounded-md border border-black/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2 w-full">
            <p className="text-sm">Username*</p>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="p-3 w-full rounded-md border border-black/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2 w-full">
            <p className="text-sm">Password*</p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="Enter your password"
                className={`p-3 w-full pr-12 rounded-md border ${
                  password && isPasswordValid
                    ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                    : "border-black/10 focus:border-blue-500 focus:ring-blue-500"
                } focus:outline-none focus:ring-1`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password requirements - show when password field is focused or has content */}
            {(passwordFocused || password) && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Password must contain:
                </p>
                <ValidationItem
                  isValid={passwordValidation.minLength}
                  text="At least 8 characters"
                />
                <ValidationItem
                  isValid={passwordValidation.hasUpperCase}
                  text="One uppercase letter (A-Z)"
                />
                <ValidationItem
                  isValid={passwordValidation.hasLowerCase}
                  text="One lowercase letter (a-z)"
                />
                <ValidationItem
                  isValid={passwordValidation.hasNumber}
                  text="One number (0-9)"
                />
                <ValidationItem
                  isValid={passwordValidation.hasSpecialChar}
                  text="One special character (@$!%*?&)"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`px-5 py-3 rounded-md font-bold cursor-pointer transition-colors ${
              isPasswordValid
                ? "bg-c-color hover:bg-c-bg-2"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!isPasswordValid}
          >
            Sign Up
          </button>
        </form>

        <div className="text-center w-full">
          <p className="text-sm font-light ">
            Already have an account?{" "}
            <Link to="/login">
              <span className="text-c-color font-bold cursor-pointer">
                Login
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
