import type { Metadata } from "next";
import OptimusSidebar from "@/components/appSidebar/AppsideBar";
import Header from "@/components/header/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import "../globals.css";

export const metadata: Metadata = {
  title: "jhonny Admin Dashboard",
  description: "jhonny Admin Dashboard",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <OptimusSidebar />
        <SidebarInset className="bg-gray-100 min-h-svh flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 p-2 md:p-6 overflow-auto min-w-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

