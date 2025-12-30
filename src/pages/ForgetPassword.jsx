import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useForget } from "../components/hooks/useReset";

export default function ForgetPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { forgetFn, isPending } = useForget();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data) => {
    try {
      await forgetFn(data);
      setIsSubmitted(true);
    } catch (error) {
      // Error handled in hook
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-6 md:p-10 bg-gray-50">
        <div className="flex flex-col items-center gap-6 bg-white w-full max-w-md p-8 md:p-10 rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
            <p className="text-gray-600 text-sm">
              We've sent a password reset link to your email address. Please check
              your inbox and follow the instructions to reset your password.
            </p>
            <p className="text-gray-500 text-xs mt-4">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full mt-4">
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Resend Email
            </button>
            <Link
              to="/login"
              className="w-full px-4 py-2.5 bg-c-color text-white rounded-lg hover:bg-c-bg transition-colors text-center font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 md:p-10 bg-gray-50">
      <div className="flex flex-col items-center gap-6 bg-white w-full max-w-md p-8 md:p-10 rounded-xl shadow-sm border border-gray-200">
        <div className="w-full flex justify-center">
          <img src="/gloc-logo.svg" alt="logo" className="w-32 mb-2" />
        </div>

        <div className="text-center space-y-2 w-full">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-600 text-sm">
            No worries! Enter your email address and we'll send you a link to reset
            your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-c-color text-white px-4 py-2.5 rounded-lg hover:bg-c-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Send Reset Link</span>
              </>
            )}
          </button>
        </form>

        <div className="w-full pt-4 border-t border-gray-200">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-c-color transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> If you don't receive the email within a few
            minutes, please check your spam folder. The reset link will expire
            after 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
