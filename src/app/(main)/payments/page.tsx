"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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
import { useGetAllPaymentQuery } from "@/features/payment/paymentApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { baseURL } from "@/utils/BaseURL";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

interface EarningCaregiver {
  _id?: string;
  name?: string;
  email?: string;
  profileImage?: string;
}

interface EarningBooking {
  _id?: string;
  serviceCategory?: {
    _id?: string;
    name?: string;
  };
  date?: string;
  slotStartTime?: string;
  slotEndTime?: string;
  status?: string;
}

interface PaymentItem {
  _id: string;
  caregiver?: EarningCaregiver;
  booking?: EarningBooking;
  amount: number;
  status: string;
  createdAt: string;
}

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: apiResponse, isLoading } = useGetAllPaymentQuery({
    page,
    status: statusFilter,
    searchTerm,
  });

  const rawContainer = apiResponse?.data;
  const paymentsList: PaymentItem[] = Array.isArray(rawContainer?.data)
    ? rawContainer.data
    : Array.isArray(rawContainer)
    ? rawContainer
    : [];

  const meta = rawContainer?.meta || { page: 1, totalPages: 1, total: 0 };

  const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${baseURL}/${path.replace(/^\//, "")}`;
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-center bg-white rounded-lg p-3"
      >
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by caregiver name, email or ID"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-12 h-14 bg-gray-100 border-none rounded-xl focus-visible:ring-primary shadow-none text-base"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-44 h-14 bg-gray-100 border-none py-[26px] rounded-xl px-6 focus:ring-primary shadow-none text-base cursor-pointer">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-none shadow-xl bg-white">
            <SelectItem value="all" className="cursor-pointer">All Status</SelectItem>
            <SelectItem value="PENDING" className="cursor-pointer">Pending</SelectItem>
            <SelectItem value="COMPLETED" className="cursor-pointer">Completed</SelectItem>
            <SelectItem value="PAID" className="cursor-pointer">Paid</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Main Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-none bg-white rounded-2xl overflow-hidden shadow-none">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-none bg-[#EBF2FA]/30 hover:bg-[#EBF2FA]/30">
                  <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700">Transaction ID</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Caregiver</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Service Category</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12">
                      <LoadingSpinner message="Loading payments..." className="py-8" />
                    </TableCell>
                  </TableRow>
                ) : paymentsList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-gray-500 font-medium">
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paymentsList.map((payment) => {
                    const dateVal = payment.booking?.date || payment.createdAt;
                    const dateStr = dateVal
                      ? new Date(dateVal).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A";

                    return (
                      <TableRow key={payment._id} className="border-none hover:bg-gray-50/50 transition-colors">
                        <TableCell className="px-8 py-5 text-primary font-mono text-[14px]">
                          {payment._id ? `TRX-${payment._id.slice(-8).toUpperCase()}` : "N/A"}
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 rounded-full border border-gray-100">
                              <AvatarImage
                                src={getImageUrl(payment.caregiver?.profileImage)}
                                alt={payment.caregiver?.name || "Caregiver"}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                {payment.caregiver?.name?.slice(0, 2)?.toUpperCase() || "CG"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-[15px] font-medium text-gray-800 leading-tight">
                                {payment.caregiver?.name || "N/A"}
                              </span>
                              <span className="text-xs text-gray-400">
                                {payment.caregiver?.email || ""}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5 text-gray-700 font-medium text-[15px]">
                          {payment.booking?.serviceCategory?.name || "General Care"}
                        </TableCell>
                        <TableCell className="px-6 py-5 text-gray-600 font-normal text-[15px]">
                          {dateStr}
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                              payment.status === "COMPLETED" || payment.status === "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </TableCell>
                        <TableCell className="px-8 py-5 text-right font-semibold text-gray-800 text-[16px]">
                          ${payment.amount}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
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
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer ${
                page === pageNum
                  ? "bg-primary text-white shadow-none"
                  : "border border-transparent text-gray-500 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
            disabled={page === meta.totalPages}
            className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
}