"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { getToken, removeToken, isTokenValid } from "@/utils/storage";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getToken();

    if (!token || !isTokenValid(token)) {
      removeToken();
      setIsAuthenticated(false);
      toast.error("Session expired, please login again", { id: "session-expired" });
      router.replace("/auth/login?reason=expired");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1D68D5] border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">
            {isAuthenticated === false ? "Redirecting to Login..." : "Authenticating..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


