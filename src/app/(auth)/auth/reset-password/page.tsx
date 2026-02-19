"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      toast.success("Password reset successful!");
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EEF2F9] p-4 font-sans">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-8 md:p-12">
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-medium text-[#1A1D2E] mb-4">Success!</h2>
              <p className="text-base text-[#64748B] mb-8 leading-relaxed">
                Your password has been updated successfully. You can now log in with your new password.
              </p>
              <Link href="/login">
                <Button className="w-full h-12 bg-[#1D68D5] hover:bg-[#1A5BBF] text-white rounded-2xl text-lg font-medium shadow-lg transition-all">
                  Proceed to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-10">
                <h1 className="text-[2rem] font-medium text-[#1A1D2E] mb-4 text-center">Create New Password</h1>
                <p className="text-[#64748B] text-base leading-relaxed max-w-[420px] mx-auto">
                  Please enter a new password for your account. Make sure it&apos;s at least 8 characters long and includes a mix of characters.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 text-left">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#1A1D2E] ml-1">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password here..."
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: undefined });
                      }}
                      className={cn(
                        "h-12 bg-[#EBF2FA] border-none rounded-2xl focus-visible:ring-1 px-5 transition-all pr-12 text-lg",
                        errors.password ? "focus-visible:ring-red-500 bg-red-50/50" : "focus-visible:ring-[#1D68D5]"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1A1D2E] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-medium text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#1A1D2E] ml-1">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                      }}
                      className={cn(
                        "h-12 bg-[#EBF2FA] border-none rounded-2xl focus-visible:ring-1 px-5 transition-all pr-12 text-lg",
                        errors.confirmPassword ? "focus-visible:ring-red-500 bg-red-50/50" : "focus-visible:ring-[#1D68D5]"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1A1D2E] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs font-medium text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#1D68D5] hover:bg-[#1A5BBF] text-white rounded-2xl text-lg font-medium transition-all shadow-lg group"
                >
                  {isLoading ? 'Updating...' : (
                    <span className="flex items-center gap-2">
                      Update Password <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </>
          )}

          <div className="mt-10 pt-4 text-center">
            <Link href="/auth/login" className="text-[#1D68D5] text-base hover:underline font-medium text-lg inline-flex items-center gap-2 text-sm">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
