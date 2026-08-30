"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVerifyOtpMutation, useForgotPasswordMutation } from "@/features/auth/authApi";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState, Suspense } from "react";
import toast from "react-hot-toast";

function VerifyEmailForm() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeInput, setActiveInput] = useState(0);
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

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
    if (code.length < 6) {
      toast.error("Please enter complete 6-digit code");
      return;
    }

    if (!email) {
      toast.error("Email address missing. Please go back to forgot password.");
      return;
    }

    try {
      const response = await verifyOtp({ email, otp: Number(code) }).unwrap();
      const resetToken = response?.data?.resetToken;

      if (resetToken) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("resetToken", resetToken);
        }
        toast.success(response?.message || "Email verified successfully!");
        router.push(`/auth/reset-password?token=${encodeURIComponent(resetToken)}`);
      } else {
        toast.error(response?.message || "Verification failed. Token not received.");
      }
    } catch (error: unknown) {
      console.error("Verification error:", error);
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Invalid verification code.");
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      if (!email) {
        toast.error("Email address missing.");
        return;
      }
      try {
        const response = await forgotPassword({ email, isResetPassword: true }).unwrap();
        setTimer(59);
        toast.success(response?.message || "New code sent to your email!");
      } catch (error: unknown) {
        console.error("Resend error:", error);
        const err = error as { data?: { message?: string }; message?: string };
        toast.error(err?.data?.message || err?.message || "Failed to resend code.");
      }
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
              Please enter the 6-digit verification code sent to <span className="font-semibold text-[#1A1D2E]">{email || "your email"}</span>.
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
                    "w-12 h-12 sm:w-14 sm:h-12 text-center text-2xl font-medium border-none rounded-2xl bg-[#EBF2FA] outline-none transition-all flex items-center justify-center",
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
              disabled={timer > 0 || isResending}
              className={cn(
                "text-lg font-medium transition-colors text-base",
                timer > 0 || isResending ? "text-[#94A3B8] cursor-not-allowed" : "text-[#1D68D5] hover:underline"
              )}
            >
              {timer > 0 ? `Resend code in ${timer}s` : isResending ? "Sending..." : "Resend code"}
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

export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#EEF2F9]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1D68D5] border-t-transparent" />
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
