"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export default function MyNavber() {
  const pathname = usePathname();
  const isProvider = pathname.startsWith("/provider");
  const router = useRouter();

  // Helper to get page title based on path
  const getPageTitle = () => {
    if (pathname === "/") return "Overview";
    if (pathname.includes("verification-list")) return "Verification List";
    if (pathname.includes("user-management")) return "User Management";
    if (pathname.includes("profile")) return "Settings & Profile";
    if (pathname.includes("notification")) return "Notifications";
    return "My Dashboard";
  };

  return (
    <header className="flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-4 bg-white/80 backdrop-blur-md px-4 sm:px-8 w-full sticky top-0 z-40 border-b border-border">

      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <SidebarTrigger className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 cursor-pointer hover:bg-primary/20 text-primary rounded-xl shadow-none border-0 [&_svg]:h-5 sm:[&_svg]:h-6 [&_svg]:w-5 sm:[&_svg]:w-6 shrink-0 transition-colors" />
        <div className="flex flex-col min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-[10px] sm:text-xs text-[#64748B] font-medium hidden xs:block">
            Dashboard / {getPageTitle()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6 shrink-0">



        <Button
          onClick={() => router.push("/notification")}
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-accent hover:bg-accent/80 text-foreground cursor-pointer border border-border transition-all"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-white ring-0" />
        </Button>

        <div onClick={() => router.push("/profile")} className="flex items-center gap-2 sm:gap-4 cursor-pointer group pl-2 sm:pl-4 border-l border-border">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-foreground leading-none mb-1.5 group-hover:text-primary transition-colors">Rasel Parvez</p>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              {isProvider ? "Provider" : "Admin"}
            </span>
          </div>
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl border-2 border-transparent group-hover:border-primary/20 shadow-sm transition-all overflow-hidden bg-accent">
            <AvatarImage src="https://www.perfocal.com/blog/content/images/size/w960/2021/01/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg" alt="Rasel Parvez" className="object-cover" />
            <AvatarFallback className="rounded-xl bg-primary text-white text-xs sm:text-base font-bold">RP</AvatarFallback>
          </Avatar>
        </div>

      </div>
    </header>
  )
}