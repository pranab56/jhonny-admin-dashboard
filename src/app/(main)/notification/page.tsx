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
import {
  useGetAllNotifactionQuery,
  useReadSingleNotificationMutation,
  useReadNotificationMutation,
  useDeleteNotificationMutation,
} from "@/features/notification/notificationApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2, ChevronLeft, ChevronRight, Info, Loader2, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface NotificationItem {
  _id: string;
  title: string;
  body: string;
  type?: string;
  isRead: boolean;
  createdAt?: string;
}

export default function NotificationPage() {
  const [page, setPage] = useState(1);

  // RTK Query hooks
  const { data: apiResponse, isLoading } = useGetAllNotifactionQuery({ page });
  const [readSingleNotification] = useReadSingleNotificationMutation();
  const [readNotification, { isLoading: isMarkingAll }] = useReadNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notificationsList = apiResponse?.data || [];
  const meta = apiResponse?.meta || { page: 1, limit: 10, total: 0, totalPages: 1, unreadCount: 0 };
  const unreadCount = meta.unreadCount || 0;

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await readSingleNotification(id).unwrap();
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Failed to mark notification as read";
      toast.error(errorMsg);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await readNotification(undefined).unwrap();
      toast.success(res?.message || "All notifications marked as read");
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Failed to mark all as read";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await deleteNotification(id).unwrap();
      toast.success(res?.message || "Notification deleted");
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Failed to delete notification";
      toast.error(errorMsg);
    }
  };

  const getTypeIcon = (type?: string) => {
    const upper = type?.toUpperCase() || "";
    if (upper.includes("SUCCESS") || upper.includes("BOOKING") || upper.includes("VERIFIED")) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
    if (upper.includes("WARNING") || upper.includes("SYSTEM")) {
      return <Bell className="w-5 h-5 text-amber-500" />;
    }
    if (upper.includes("ERROR") || upper.includes("CANCEL")) {
      return <XCircle className="w-5 h-5 text-rose-500" />;
    }
    return <Info className="w-5 h-5 text-primary" />;
  };

  const getTypeStyles = (type?: string) => {
    const upper = type?.toUpperCase() || "";
    if (upper.includes("SUCCESS") || upper.includes("BOOKING") || upper.includes("VERIFIED")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (upper.includes("WARNING") || upper.includes("SYSTEM")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (upper.includes("ERROR") || upper.includes("CANCEL")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-primary/10 text-primary border-primary/20";
  };

  const formatType = (type?: string) => {
    if (!type) return "General";
    return type.replace(/_/g, " ").toLowerCase();
  };

  const formatTimeAgo = (dateString?: string | Date) => {
    if (!dateString) return "";
    try {
      const d = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#1A1D2E]">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-[15px] text-[#54617A] leading-relaxed">Stay updated with the latest alerts and system activities.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll || notificationsList.length === 0}
            className="h-11 px-6 rounded-xl border border-gray-200 text-[#54617A] font-medium hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap bg-white shadow-none disabled:opacity-50 flex items-center gap-2"
          >
            {isMarkingAll && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Mark all as read</span>
          </button>
        </div>
      </motion.div>

      <Card className="border-none bg-white rounded-2xl overflow-hidden shadow-none p-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <LoadingSpinner message="Loading notifications..." />
            ) : (
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
                    {notificationsList.length > 0 ? (
                      notificationsList.map((notification: NotificationItem) => (
                        <TableRow
                          key={notification._id}
                          className={cn(
                            "border-none group transition-colors cursor-pointer",
                            !notification.isRead ? "bg-primary/[0.03] hover:bg-primary/[0.05]" : "bg-transparent hover:bg-gray-50/50"
                          )}
                          onClick={() => handleMarkAsRead(notification._id, notification.isRead)}
                        >
                          <TableCell className="text-center py-5 px-6">
                            <div className="flex justify-center">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center relative",
                                !notification.isRead && "after:content-[''] after:absolute after:top-0 after:right-0 after:w-2.5 after:h-2.5 after:bg-primary after:rounded-full after:border-2 after:border-white"
                              )}>
                                {getTypeIcon(notification.type)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-5 px-6">
                            <div className="flex flex-col gap-1">
                              <span className={cn(
                                "text-[15px] leading-tight",
                                !notification.isRead ? "font-bold text-gray-900" : "font-normal text-gray-600"
                              )}>{notification.title}</span>
                              <span className="text-sm text-gray-500 leading-normal">{notification.body}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell py-5 px-6">
                            <Badge className={cn("capitalize font-semibold rounded-full px-4 py-1 border text-xs shadow-none", getTypeStyles(notification.type))}>
                              {formatType(notification.type)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-right text-sm text-gray-500 py-5 px-6 whitespace-nowrap">
                            {formatTimeAgo(notification.createdAt)}
                          </TableCell>
                          <TableCell className="text-right pr-8 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => handleDelete(notification._id, e)}
                                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all cursor-pointer"
                                title="Delete notification"
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
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 pt-4"
        >
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: meta.totalPages }, (_, index) => index + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "h-10 w-10 flex items-center justify-center rounded-full text-sm font-bold transition-all cursor-pointer",
                p === page
                  ? "bg-primary text-white shadow-none"
                  : "border border-transparent text-gray-500 hover:bg-gray-50"
              )}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page >= meta.totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
            className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
}