"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeInput, setActiveInput] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    // Take only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // If a value was entered, move to the next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setActiveInput(index - 1);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Verifying OTP:", code);
      toast.success("Email verified successfully!");
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Invalid verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(59);
      console.log("Resending OTP...");
      toast.success("New code sent to your email!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EEF2F9] p-4 font-sans">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[2rem] font-medium text-[#1A1D2E] mb-4">Verify Email</h1>
            <p className="text-[#64748B] text-base max-w-[400px] mx-auto">
              Please enter the 6-digit verification code sent to your email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="flex justify-between gap-2 max-w-[400px] mx-auto">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  value={data}
                  onFocus={() => setActiveInput(index)}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={cn(
                    "w-12 h-12 sm:w-14 sm:h-16 text-center text-2xl font-medium border-none rounded-2xl bg-[#EBF2FA] outline-none transition-all flex items-center justify-center",
                    activeInput === index ? "ring-2 ring-[#1D68D5] bg-white transition-shadow" : "focus:ring-2 focus:ring-[#1D68D5]",
                    data ? "bg-white ring-1 ring-[#1D68D5]" : ""
                  )}
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.join("").length < 6}
              className="w-full h-12 bg-[#1D68D5] hover:bg-[#1A5BBF] text-white rounded-2xl text-lg font-medium transition-all shadow-lg group"
            >
              {isLoading ? 'Verifying...' : (
                <span className="flex items-center gap-2">
                  Verify & Proceed <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[#64748B] text-base mb-2 text-base font-medium">Didn&apos;t receive the code?</p>
            <button
              onClick={handleResend}
              disabled={timer > 0}
              className={cn(
                "text-lg font-medium transition-colors text-base",
                timer > 0 ? "text-[#94A3B8] cursor-not-allowed" : "text-[#1D68D5] hover:underline"
              )}
            >
              {timer > 0 ? `Resend code in ${timer}s` : "Resend code"}
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-[#F1F5F9] text-center">
            <Link href="/auth/login" className="text-[#1D68D5] hover:underline font-medium text-base inline-flex items-center gap-2 text-sm">
              <ArrowLeft className="w-5 h-5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
