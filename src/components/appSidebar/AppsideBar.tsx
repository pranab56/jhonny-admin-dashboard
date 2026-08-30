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
  FileText,
  LayoutGrid,
  LogOut,
  LucideIcon,
  Square,
  User,
  Users,
  Wallet
} from "lucide-react";
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
      { name: "Services Rule", path: "/content/services-rule" },
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

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    if (isMobile) setOpenMobile(false);
    removeToken();
    dispatch(logout());
    toast.success("Logged out successfully");
    router.replace("/auth/login");
  };


  const handleItemClick = () => {
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
                const showChildren = active && item.children;

                return (
                  <div key={item.name} className="flex flex-col gap-1">
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        size="lg"
                        tooltip={isCollapsed ? item.name : undefined}
                        onClick={handleItemClick}
                        className={cn(
                          "h-12 transition-all duration-200 rounded-xl px-4",
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
                            <span className="text-[17px] font-medium">
                              {item.name}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Submenu rendering */}
                    {!isCollapsed && showChildren && (
                      <div className="flex flex-col gap-1 ml-4 mt-1">
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
                      </div>
                    )}
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
            onClick={handleLogout}
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
    </Sidebar >
  );
}
