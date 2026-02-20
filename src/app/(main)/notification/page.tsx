"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2, Info, Trash2, XCircle } from "lucide-react";
import { useState } from "react";

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Appointment Confirmed",
    message: "Your appointment with Dr. Rasel has been confirmed for tomorrow at 10:00 AM.",
    time: "2 hours ago",
    type: "success",
    read: false,
  },
  {
    id: "2",
    title: "New Message",
    message: "You have a new message from the lab department regarding your results.",
    time: "5 hours ago",
    type: "info",
    read: false,
  },
  {
    id: "3",
    title: "Prescription Renewal",
    message: "Your prescription for 'Amoxicillin' is ready for renewal.",
    time: "1 day ago",
    type: "warning",
    read: true,
  },
  {
    id: "4",
    title: "System Update",
    message: "The dashboard will be undergoing maintenance tonight from 2:00 AM to 4:00 AM.",
    time: "2 days ago",
    type: "error",
    read: true,
  },
  {
    id: "5",
    title: "Profile Verified",
    message: "Your professional credentials have been successfully verified.",
    time: "3 days ago",
    type: "success",
    read: true,
  },
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-secondary" />;
      case "info":
        return <Info className="w-5 h-5 text-primary" />;
      case "warning":
        return <Bell className="w-5 h-5 text-orange-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-destructive" />;
    }
  };

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "info":
        return "bg-primary/10 text-primary border-primary/20";
      case "warning":
        return "bg-orange-50 text-orange-600 border-orange-100";
      case "error":
        return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-medium text-[#1A1D2E]">Notifications</h1>
          <p className="text-[15px] text-[#54617A] leading-relaxed">Stay updated with the latest alerts and system activities.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
            className="h-11 px-6 rounded-lg border border-gray-200 text-[#54617A] font-medium hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap bg-white shadow-none"
          >
            Mark all as read
          </button>
          <button
            onClick={clearAll}
            className="h-11 px-6 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap shadow-none"
          >
            Clear All
          </button>
        </div>
      </motion.div>

      <Card className="border-none bg-white rounded-2xl overflow-hidden shadow-none p-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#EBF2FA]/30">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="w-[80px] text-center px-6 py-5 text-[15px] font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="py-5 px-6 text-[15px] font-semibold text-gray-700">Message</TableHead>
                  <TableHead className="hidden md:table-cell py-5 px-6 text-[15px] font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="hidden sm:table-cell text-right py-5 px-6 text-[15px] font-semibold text-gray-700">Time</TableHead>
                  <TableHead className="w-[100px] text-right pr-8 py-5 text-[15px] font-semibold text-gray-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence initial={false}>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <TableRow
                        key={notification.id}
                        className={cn(
                          "border-none group transition-colors cursor-pointer",
                          !notification.read ? "bg-primary/[0.03] hover:bg-primary/[0.05]" : "bg-transparent hover:bg-gray-50/50"
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <TableCell className="text-center py-5 px-6">
                          <div className="flex justify-center">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center relative",
                              !notification.read && "after:content-[''] after:absolute after:top-0 after:right-0 after:w-2.5 after:h-2.5 after:bg-primary after:rounded-full after:border-2 after:border-white"
                            )}>
                              {getTypeIcon(notification.type)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 px-6">
                          <div className="flex flex-col gap-1">
                            <span className={cn(
                              "text-[15px] leading-tight",
                              !notification.read ? "font-semibold text-gray-900" : "font-normal text-gray-600"
                            )}>{notification.title}</span>
                            <span className="text-sm text-gray-500 leading-normal line-clamp-1">{notification.message}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell py-5 px-6">
                          <Badge className={cn("capitalize font-normal rounded-full px-4 py-1 border text-xs shadow-none", getTypeStyles(notification.type))}>
                            {notification.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-right text-sm text-gray-500 py-5 px-6">
                          {notification.time}
                        </TableCell>
                        <TableCell className="text-right pr-8 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all cursor-pointer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="border-none">
                      <TableCell colSpan={5} className="h-96 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                            <Bell className="w-10 h-10 text-gray-300" />
                          </div>
                          <p className="text-lg font-medium text-gray-800">No notifications found</p>
                          <p className="text-[15px] text-gray-500 mt-1">You&apos;re all caught up for now!</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}