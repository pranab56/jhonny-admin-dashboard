"use client";

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Email verified successfully!');

      // Redirect to Reset Password
      setTimeout(() => {
        router.push('/auth/reset-password');
      }, 1000);
    }, 1500);
  };

  const handleResend = () => {
    setIsResending(true);
    // Simulate resend
    setTimeout(() => {
      setIsResending(false);
      toast.success('Verification code resent!');
    }, 2000);
  }

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Panel - Feature Showcase (Match Login) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F9FAFB] relative flex-col justify-between p-12 overflow-hidden items-center justify-center">
        <div className='w-10/12 h-12/12 relative'>
          <Image src="/images/auth/image.png" alt="VerifyEmail Background" fill className="" />
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white">
        <div className="w-full max-w-[480px] p-6 sm:p-10 bg-white rounded-3xl shadow-none sm:shadow-xl border border-gray-100 sm:border-none">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
            <p className="text-sm sm:text-base text-gray-500">
              We have sent a verification code to <span className="font-semibold text-gray-700">{email || "your email"}</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 flex flex-col items-center">

            <div className="w-full flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-1 sm:gap-2">
                  <InputOTPSlot index={0} className="w-10 h-10 sm:w-12 sm:h-12 border-gray-300 rounded-lg text-base sm:text-lg bg-[#F9FAFB] focus:ring-1 focus:ring-[#9B85C1]" />
                  <InputOTPSlot index={1} className="w-10 h-10 sm:w-12 sm:h-12 border-gray-300 rounded-lg text-base sm:text-lg bg-[#F9FAFB] focus:ring-1 focus:ring-[#9B85C1]" />
                  <InputOTPSlot index={2} className="w-10 h-10 sm:w-12 sm:h-12 border-gray-300 rounded-lg text-base sm:text-lg bg-[#F9FAFB] focus:ring-1 focus:ring-[#9B85C1]" />
                  <InputOTPSlot index={3} className="w-10 h-10 sm:w-12 sm:h-12 border-gray-300 rounded-lg text-base sm:text-lg bg-[#F9FAFB] focus:ring-1 focus:ring-[#9B85C1]" />
                  <InputOTPSlot index={4} className="w-10 h-10 sm:w-12 sm:h-12 border-gray-300 rounded-lg text-base sm:text-lg bg-[#F9FAFB] focus:ring-1 focus:ring-[#9B85C1]" />
                  <InputOTPSlot index={5} className="w-10 h-10 sm:w-12 sm:h-12 border-gray-300 rounded-lg text-base sm:text-lg bg-[#F9FAFB] focus:ring-1 focus:ring-[#9B85C1]" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full h-12 bg-[#9B85C1] hover:bg-[#8A74B0] text-white rounded-xl text-base font-medium transition-all shadow-md group"
            >
              {isLoading ? 'Verifying...' : (
                <span className="flex items-center gap-2">
                  Verify Code <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-[#5aa8a9] font-semibold hover:text-[#4a8a8b] hover:underline disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <Link
              href="/auth/login"
              className="text-gray-500 hover:text-gray-700 font-medium inline-flex items-center gap-2 group transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
