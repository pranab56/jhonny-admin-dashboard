"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronRight,
  FileText,
  LayoutGrid,
  Loader2,
  LogOut,
  LucideIcon,
  Square,
  User,
  Users,
  Wallet
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import Image from 'next/image';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { removeToken } from "@/utils/storage";
import { logout } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

type MenuItem = {
  name: string;
  path: string;
  icon: LucideIcon;
  children?: { name: string; path: string }[];
};

const clientMenuItems: MenuItem[] = [
  { name: "Overview", path: "/", icon: LayoutGrid },
  {
    name: "User Management", path: "/user-management", icon: Users,
    children: [
      { name: "Service Seekers", path: "/user-management/service-seekers" },
      { name: "Caregivers", path: "/user-management/caregivers" },

    ]
  },
  { name: "Bookings", path: "/booking", icon: Calendar },
  { name: "Payments", path: "/payments", icon: Wallet },
  {
    name: "Content",
    path: "/content",
    icon: FileText,
    children: [
      // { name: "Services Rule", path: "/content/services-rule" },
      { name: "Privacy Policy", path: "/content/privacy-policy" },
      { name: "Terms of Service", path: "/content/terms-of-service" },
    ]
  },
  { name: "Profile", path: "/profile", icon: User },
];

export default function AppSideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  const [openMenus, setOpenMenus] = useState<string[]>(() => {
    const initialOpen: string[] = [];
    clientMenuItems.forEach((item) => {
      if (item.children && (pathname === item.path || pathname.startsWith(item.path))) {
        initialOpen.push(item.name);
      }
    });
    return initialOpen;
  });

  useEffect(() => {
    clientMenuItems.forEach((item) => {
      if (item.children && (pathname === item.path || pathname.startsWith(item.path))) {
        setOpenMenus((prev) => (prev.includes(item.name) ? prev : [...prev, item.name]));
      }
    });
  }, [pathname]);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const handleLogoutTrigger = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (isMobile) setOpenMobile(false);
    removeToken();
    dispatch(logout());
    toast.success("Logged out successfully");
    setIsLoggingOut(false);
    setIsLogoutModalOpen(false);
    router.replace("/auth/login");
  };

  const handleItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleParentToggle = (item: MenuItem, e: React.MouseEvent) => {
    if (item.children) {
      e.preventDefault();
      const isOpen = openMenus.includes(item.name);
      if (isOpen) {
        setOpenMenus((prev) => prev.filter((name) => name !== item.name));
      } else {
        setOpenMenus((prev) => [...prev, item.name]);
        if (item.children.length > 0) {
          router.push(item.children[0].path);
        }
      }
    }
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarContent className="bg-white text-[#213F7D] flex flex-col h-full font-sans overflow-hidden">

        {/* Header / Logo */}
        <SidebarHeader className={cn(
          "p-6 pb-2 pt-8 transition-all duration-300 flex items-center justify-center",
          isCollapsed && "p-2"
        )}>
          <Link href="/" onClick={handleItemClick}>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/icons/logo.png"
                alt="Logo"
                width={120}
                height={80}
                className={cn("w-auto h-auto object-contain", isCollapsed && "w-8")}
                priority
              />
            </div>
          </Link>
        </SidebarHeader>

        <div className="mx-6 border-b border-gray-50 mt-4 mb-6" />

        {/* Navigation */}
        <SidebarGroup className="flex-1 px-3">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {clientMenuItems.map((item) => {
                const active = isActive(item.path);
                const showChildren = !!item.children && openMenus.includes(item.name);

                return (
                  <div key={item.name} className="flex flex-col gap-1">
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        size="lg"
                        tooltip={isCollapsed ? item.name : undefined}
                        onClick={(e) => (item.children ? handleParentToggle(item, e) : handleItemClick())}
                        className={cn(
                          "h-12 transition-all duration-200 rounded-xl px-4 cursor-pointer",
                          active
                            ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                            : "text-[#8E98A8] hover:bg-gray-50 hover:text-[#1A1D2E]",
                          isCollapsed && "!h-12 !w-12 !p-0 justify-center mx-auto"
                        )}
                      >
                        <Link href={item.children ? item.children[0].path : item.path} className={cn(
                          "flex items-center gap-4 w-full",
                          isCollapsed && "justify-center"
                        )}>
                          <item.icon className={cn(
                            "w-6 h-6 shrink-0 transition-transform duration-300",
                          )} />
                          {!isCollapsed && (
                            <>
                              <span className="text-[17px] font-medium flex-1 text-left">
                                {item.name}
                              </span>
                              {item.children && (
                                <ChevronRight
                                  className={cn(
                                    "w-5 h-5 shrink-0 transition-transform duration-200 ml-auto",
                                    showChildren && "rotate-90"
                                  )}
                                />
                              )}
                            </>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Submenu rendering */}
                    <AnimatePresence initial={false}>
                      {!isCollapsed && showChildren && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden flex flex-col gap-1 ml-4 mt-1"
                        >
                          {item.children?.map((child) => {
                            const childActive = pathname === child.path;
                            return (
                              <Link
                                key={child.name}
                                href={child.path}
                                onClick={handleItemClick}
                                className={cn(
                                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[16px] transition-all",
                                  childActive
                                    ? "text-primary font-semibold"
                                    : "text-[#54617A] hover:text-primary hover:bg-gray-50/50"
                                )}
                              >
                                <Square
                                  className={cn(
                                    "w-1.5 h-1.5 shrink-0",
                                    childActive ? "fill-primary stroke-primary" : "stroke-[#54617A]"
                                  )}
                                />
                                <span>{child.name}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer / Logout Button */}
        <SidebarFooter className={cn(
          "p-6 transition-all duration-300",
          isCollapsed && "p-2 items-center mt-auto"
        )}>
          <button
            onClick={handleLogoutTrigger}
            className={cn(
              "w-full h-12 bg-[#E74C3C] hover:bg-[#E74C3C]/90 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-none transition-all active:scale-95 cursor-pointer",
              isCollapsed && "h-12 w-12 rounded-xl p-0"
            )}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-6 h-6" />
            {!isCollapsed && <span className="text-[17px] font-semibold">Logout</span>}
          </button>
        </SidebarFooter>

      </SidebarContent>

      {/* Logout Confirmation Dialog Modal */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl border-none shadow-2xl">
          <DialogHeader className="flex flex-col items-center gap-2 text-center pt-2">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-[#E74C3C] mb-1">
              <LogOut className="w-7 h-7" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 font-medium">
              Are you sure you want to log out from your account?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center gap-3 mt-6 justify-end">
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-5 py-2.5 rounded-sm border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={handleConfirmLogout}
              className="px-6 py-2.5 rounded-sm bg-[#E74C3C] hover:bg-[#E74C3C]/90 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-none disabled:opacity-70 min-w-[110px]"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <span>Log Out</span>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar >
  );
}
