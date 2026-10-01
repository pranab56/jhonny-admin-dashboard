"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  size?: number;
}

export default function LoadingSpinner({
  message = "Loading data...",
  className = "py-20",
  size = 32,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 w-full", className)}>
      <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />
      {message && <p className="text-sm font-medium text-gray-500">{message}</p>}
    </div>
  );
}
