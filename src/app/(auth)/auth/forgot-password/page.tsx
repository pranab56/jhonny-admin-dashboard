"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

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

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSent(true);
      toast.success("Reset link sent to your email!");
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
          {isSent ? (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-medium text-[#1A1D2E] mb-4">Check your email</h2>
              <p className="text-lg text-[#64748B] mb-8 leading-relaxed">
                We&apos;ve sent a password reset link to <br /><span className="font-medium text-[#1A1D2E]">{email}</span>.
              </p>
              <Button
                variant="ghost"
                onClick={() => setIsSent(false)}
                className="text-[#1D68D5] hover:text-[#1A5BBF] font-medium text-base"
              >
                Resend link
              </Button>
              <div className="mt-8">
                <Link href="/login" className="text-[#1D68D5] hover:underline font-medium text-base flex items-center justify-center gap-2">
                  <ArrowLeft className="w-5 h-5" /> Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-10 text-center">
                <h1 className="text-[2rem] font-medium text-[#1A1D2E] mb-4">Forget Password</h1>
                <p className="text-[#64748B] text-base max-w-[400px] mx-auto">
                  Enter the email address associated with your account and we will send you a link to reset your password.
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
                      "bg-[#EBF2FA] border-none rounded-2xl focus-visible:ring-1 px-5 transition-all text-lg",
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
                      Send Reset Link <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="text-center mt-10">
                <Link href="/auth/login" className="text-[#1D68D5] hover:underline font-medium text-sm">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
