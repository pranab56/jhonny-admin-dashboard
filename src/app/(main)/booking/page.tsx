"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllBookingQuery } from "@/features/booking/bookingApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { cn } from "@/lib/utils";
import { baseURL } from "@/utils/BaseURL";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Clock, Eye, Search, User, Wallet } from "lucide-react";
import { useState } from "react";

interface BookingItem {
  _id: string;
  client?: {
    _id?: string;
    name?: string;
    email?: string;
    profileImage?: string;
  };
  caregiver?: {
    _id?: string;
    name?: string;
    email?: string;
    profileImage?: string;
  };
  serviceCategory?: {
    _id?: string;
    name?: string;
  };
  date?: string;
  shift?: string;
  slotStartTime?: string;
  slotEndTime?: string;
  instructions?: string;
  status?: string;
  basePrice?: number;
  serviceFee?: number;
  totalAmount?: number;
  paymentStatus?: string;
  paymentIntentId?: string;
  createdAt?: string;
}

export default function BookingPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const limit = 10;

  // RTK Query hook
  const { data: apiResponse, isLoading } = useGetAllBookingQuery({
    page,
    limit,
    paymentStatus: paymentStatusFilter === "all" ? "" : paymentStatusFilter,
    searchTerm,
  });

  const bookingsList = apiResponse?.data?.data || [];
  const meta = apiResponse?.data?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
    return `${baseURL}/api/v1/uploads/${path}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "COMPLETED":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "AUTO_RELEASED":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "CANCELLED":
      case "DECLINED":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getPaymentBadge = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return "bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full text-xs";
      case "UNPAID":
        return "bg-amber-100 text-amber-700 font-semibold px-2.5 py-0.5 rounded-full text-xs";
      default:
        return "bg-gray-100 text-gray-700 font-semibold px-2.5 py-0.5 rounded-full text-xs";
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setPaymentStatusFilter(value);
    setPage(1);
  };

  const handleViewDetails = (booking: BookingItem) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Top Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-center bg-white p-3 rounded-lg"
      >
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by client or caregiver name..."
            className="pl-12 h-14 bg-gray-100 border-none rounded-xl focus-visible:ring-primary shadow-none text-base"
          />
        </div>
        <Select value={paymentStatusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-60 h-14 bg-gray-100 py-[26px] border-none rounded-xl px-6 focus:ring-primary shadow-none text-base">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-none shadow-xl bg-white">
            <SelectItem value="all" className="cursor-pointer">All Payment Status</SelectItem>
            <SelectItem value="PAID" className="cursor-pointer">Paid</SelectItem>
            <SelectItem value="UNPAID" className="cursor-pointer">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Main Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-none bg-white rounded-xl overflow-hidden shadow-none p-0">
          <CardContent className="p-0">
            {isLoading ? (
              <LoadingSpinner message="Loading bookings..." />
            ) : bookingsList.length === 0 ? (
              <div className="text-center py-16 text-gray-500 font-medium">
                No bookings found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-none bg-[#EBF2FA]/30 hover:bg-[#EBF2FA]/30">
                    <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700">Booking ID</TableHead>
                    <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Services Seeker</TableHead>
                    <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Caregiver</TableHead>
                    <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Date & Shift</TableHead>
                    <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Amount</TableHead>
                    <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingsList.map((booking: BookingItem) => {
                    const bookingId = booking._id ? `BK-${booking._id.slice(-6).toUpperCase()}` : "BK-N/A";
                    const clientName = booking.client?.name || "Unknown Client";
                    const caregiverName = booking.caregiver?.name || "Unknown Caregiver";
                    const categoryName = booking.serviceCategory?.name || "Care Service";

                    const clientAvatar = getImageUrl(booking.client?.profileImage);
                    const caregiverAvatar = getImageUrl(booking.caregiver?.profileImage);

                    return (
                      <TableRow key={booking._id} className="border-none hover:bg-gray-50/50 transition-colors">
                        <TableCell className="px-8 py-5 text-primary font-semibold text-[15px]">
                          {bookingId}
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-11 w-11 rounded-full overflow-hidden">
                              <AvatarImage src={clientAvatar} alt={clientName} className="object-cover" />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {clientName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-[15px] font-semibold text-gray-800 leading-tight">{clientName}</span>
                              <span className="text-sm text-gray-500 font-normal">{categoryName}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-11 w-11 rounded-full overflow-hidden">
                              <AvatarImage src={caregiverAvatar} alt={caregiverName} className="object-cover" />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {caregiverName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-[15px] font-medium text-gray-800 leading-tight">{caregiverName}</span>
                              <span className="text-xs text-gray-400">{booking.caregiver?.email || ""}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5 text-gray-600 font-normal text-[15px]">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800">{formatDate(booking.date)}</span>
                            <span className="text-xs text-gray-400 capitalize">{booking.shift?.toLowerCase()} ({booking.slotStartTime} - {booking.slotEndTime})</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5 text-gray-700 font-medium text-[15px]">
                          <div className="flex flex-col gap-1 items-start">
                            <span>${booking.totalAmount?.toFixed(2) || "0.00"}</span>
                            <span className={getPaymentBadge(booking.paymentStatus)}>
                              {booking.paymentStatus || "UNPAID"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <span className={cn("px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider", getStatusBadge(booking.status))}>
                            {booking.status || "PENDING"}
                          </span>
                        </TableCell>
                        <TableCell className="px-8 py-5 text-right">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all cursor-pointer inline-flex items-center justify-center"
                            title="View Details"
                          >
                            <Eye size={20} />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

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

      {/* Booking Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg bg-white p-6 rounded-2xl border-none shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
              <span>Booking Details</span>
              <span className="text-sm font-semibold text-primary px-3 py-1 rounded-full bg-primary/10">
                {selectedBooking?._id ? `BK-${selectedBooking._id.slice(-6).toUpperCase()}` : ""}
              </span>
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-5 pt-3 text-gray-700 text-sm">
              {/* Status Summary */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Booking Status</p>
                  <span className={cn("inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase", getStatusBadge(selectedBooking.status))}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium">Payment Status</p>
                  <span className={cn("inline-block mt-1", getPaymentBadge(selectedBooking.paymentStatus))}>
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Service Category & Date */}
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Date & Shift</p>
                    <p className="font-semibold text-gray-800">{formatDate(selectedBooking.date)}</p>
                    <p className="text-xs text-gray-500 capitalize">{selectedBooking.shift?.toLowerCase()} ({selectedBooking.slotStartTime} - {selectedBooking.slotEndTime})</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Service Category</p>
                    <p className="font-semibold text-gray-800">{selectedBooking.serviceCategory?.name || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Client & Caregiver Section */}
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1">
                    <User size={13} /> Service Seeker (Client)
                  </p>
                  <p className="font-bold text-gray-800">{selectedBooking.client?.name || "N/A"}</p>
                  <p className="text-xs text-gray-500">{selectedBooking.client?.email || ""}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1">
                    <User size={13} /> Caregiver
                  </p>
                  <p className="font-bold text-gray-800">{selectedBooking.caregiver?.name || "N/A"}</p>
                  <p className="text-xs text-gray-500">{selectedBooking.caregiver?.email || ""}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-b pb-4 space-y-2">
                <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Wallet size={13} /> Payment Breakdown
                </p>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Base Price</span>
                  <span className="font-semibold">${selectedBooking.basePrice?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Service Fee</span>
                  <span className="font-semibold">${selectedBooking.serviceFee?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm pt-1 border-t font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-primary">${selectedBooking.totalAmount?.toFixed(2) || "0.00"}</span>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedBooking.instructions && (
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Special Instructions</p>
                  <p className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 italic">
                    &quot;{selectedBooking.instructions}&quot;
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}