"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForgotPasswordMutation } from "@/features/auth/authApi";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const validate = () => {
    const newErrors: { email?: string } = {};
    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await forgotPassword({ email, isResetPassword: true }).unwrap();
      toast.success(response?.message || "OTP sent successfully. It expires in 3 minutes.");
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error: unknown) {
      console.error("Forgot password error:", error);
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Failed to send OTP. Please try again.");
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EEF2F9] p-4 font-sans">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[2rem] font-medium text-[#1A1D2E] mb-4">Forget Password</h1>
            <p className="text-[#64748B] text-base max-w-[400px] mx-auto">
              Enter the email address associated with your account and we will send you an OTP to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#1A1D2E] ml-1">Email Address</Label>
              <Input
                type="email"
                placeholder="Enter your email address here..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({});
                }}
                className={cn(
                  "bg-[#EBF2FA] border-none h-12 rounded-2xl focus-visible:ring-1 px-5 transition-all text-lg",
                  errors.email ? "focus-visible:ring-red-500 bg-red-50/50" : "focus-visible:ring-[#1D68D5]"
                )}
              />
              {errors.email && (
                <p className="text-xs font-medium text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                  {errors.email}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#1D68D5] hover:bg-[#1A5BBF] text-white rounded-2xl text-lg font-medium transition-all shadow group"
            >
              {isLoading ? 'Sending...' : (
                <span className="flex items-center gap-2">
                  Send OTP Code <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center mt-10">
            <Link href="/auth/login" className="text-[#1D68D5] hover:underline font-medium text-sm">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

