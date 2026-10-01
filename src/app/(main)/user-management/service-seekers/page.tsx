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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAllServiceSeekerQuery,
  useGetSingleServiceSeekerQuery,
  useBlockAndUnblockUserMutation,
  useUpdateStatusMutation,
} from "@/features/userManagement/userApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { baseURL } from "@/utils/BaseURL";
import { motion } from "framer-motion";
import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  Search,
  ShieldAlert,
  User,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ServiceSeeker {
  _id: string;
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  profileImage?: string;
  status: string;
  verificationStatus?: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

export default function ServiceSeekersPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSeekerId, setSelectedSeekerId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Pass page, status, and searchTerm to API query
  const { data: apiResponse, isLoading, refetch } = useGetAllServiceSeekerQuery({
    page,
    status: statusFilter,
    searchTerm,
  });

  const {
    data: singleResponse,
    isLoading: isSingleLoading,
    refetch: refetchSingle,
  } = useGetSingleServiceSeekerQuery(selectedSeekerId, { skip: !selectedSeekerId });

  const [blockAndUnblockUser, { isLoading: isBlocking }] = useBlockAndUnblockUserMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateStatusMutation();

  const seekersList: ServiceSeeker[] = apiResponse?.data || [];
  const meta = apiResponse?.meta || { page: 1, totalPages: 1, total: 0 };
  const singleSeeker: ServiceSeeker | undefined = singleResponse?.data;

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

  const handleToggleBlock = async (id: string, currentIsBlocked: boolean) => {
    try {
      const targetBlockedState = !currentIsBlocked;
      const res = await blockAndUnblockUser({ id, isBlocked: targetBlockedState }).unwrap();
      toast.success(
        res?.message || (targetBlockedState ? "User blocked successfully" : "User unblocked successfully")
      );
      refetch();
      if (selectedSeekerId) {
        refetchSingle();
      }
    } catch (err: unknown) {
      console.error("Block user error:", err);
      const error = err as { data?: { message?: string }; message?: string };
      toast.error(error?.data?.message || error?.message || "Failed to update block status");
    }
  };

  const handleSetStatus = async (id: string, newStatus: string) => {
    try {
      const res = await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(res?.message || `User status updated to ${newStatus}`);
      refetch();
      if (selectedSeekerId) {
        refetchSingle();
      }
    } catch (err: unknown) {
      console.error("Update status error:", err);
      const error = err as { data?: { message?: string }; message?: string };
      toast.error(error?.data?.message || error?.message || "Failed to update status");
    }
  };

  const currentDrawerSeeker = singleSeeker || seekersList.find(s => (s._id || s.id) === selectedSeekerId);
  const activeDrawerId = currentDrawerSeeker ? (currentDrawerSeeker._id || currentDrawerSeeker.id) : null;
  const isCurrentDrawerBlocked = currentDrawerSeeker?.isBlocked ?? false;
  const currentDrawerStatus = currentDrawerSeeker?.status || "active";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-center bg-white p-3 rounded-lg"
      >
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name, email, or ID"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-12 h-14 bg-gray-100 border-none rounded-xl focus-visible:ring-gray-50 shadow-none text-base"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-44 h-14 bg-gray-100 border-none py-[26px] cursor-pointer rounded-xl px-6 focus:ring-primary shadow-none text-base">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-none shadow-xl bg-white">
            <SelectItem value="all" className="cursor-pointer">All Status</SelectItem>
            <SelectItem value="active" className="cursor-pointer">Active</SelectItem>
            <SelectItem value="inactive" className="cursor-pointer">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Main Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-none bg-white rounded-2xl overflow-hidden shadow-none p-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-none bg-[#EBF2FA]/30 hover:bg-[#EBF2FA]/30">
                  <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700">User</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Seeker ID</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Join Date</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Account State</TableHead>
                  <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12">
                      <LoadingSpinner message="Loading service seekers..." className="py-8" />
                    </TableCell>
                  </TableRow>
                ) : seekersList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-gray-500 font-medium">
                      No service seekers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  seekersList.map((seeker) => {
                    const seekerId = seeker._id || seeker.id;
                    const currentStatus = seeker.status || "active";
                    const isStatusActive = currentStatus.toLowerCase() === "active";

                    const dateStr = seeker.createdAt
                      ? new Date(seeker.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                      : "N/A";

                    return (
                      <TableRow key={seekerId} className="border-none hover:bg-gray-50/50 transition-colors">
                        <TableCell className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 rounded-full border border-gray-100">
                              <AvatarImage src={getImageUrl(seeker.profileImage)} alt={seeker.name} className="object-cover" />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {seeker.name?.slice(0, 2)?.toUpperCase() || "US"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-[15px] font-medium text-gray-800">{seeker.name || "N/A"}</span>
                              <span className="text-xs text-gray-400">{seeker.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5 text-primary font-mono text-[14px]">
                          {seekerId.slice(-8)}
                        </TableCell>
                        <TableCell className="px-6 py-5 text-gray-600 font-normal text-[15px]">
                          {dateStr}
                        </TableCell>

                        {/* Status Select Dropdown */}
                        <TableCell className="px-6 py-5">
                          <Select
                            value={currentStatus.toLowerCase()}
                            onValueChange={(val) => handleSetStatus(seekerId, val)}
                            disabled={isUpdatingStatus}
                          >
                            <SelectTrigger
                              className={`w-28 h-8 rounded-full text-xs font-semibold uppercase tracking-wider border-none shadow-none focus:ring-0 cursor-pointer ${isStatusActive
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                              <SelectValue placeholder={currentStatus} />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl shadow-xl border-none">
                              <SelectItem value="active" className="text-xs font-medium cursor-pointer text-green-700">
                                Active
                              </SelectItem>
                              <SelectItem value="inactive" className="text-xs font-medium cursor-pointer text-gray-600">
                                Inactive
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* Account State (Blocked / Active) */}
                        <TableCell className="px-6 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${seeker.isBlocked
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                              }`}
                          >
                            {seeker.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </TableCell>

                        {/* Action Buttons */}
                        <TableCell className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Block / Unblock Button */}
                            <button
                              onClick={() => handleToggleBlock(seekerId, seeker.isBlocked)}
                              disabled={isBlocking}
                              title={seeker.isBlocked ? "Unblock User" : "Block User"}
                              className={`p-2 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center ${seeker.isBlocked
                                  ? "bg-green-50 text-green-600 hover:bg-green-100"
                                  : "bg-red-50 text-red-600 hover:bg-red-100"
                                }`}
                            >
                              <Ban size={18} />
                            </button>

                            {/* Open Details Drawer Button */}
                            <button
                              title="View Details"
                              onClick={() => {
                                setSelectedSeekerId(seekerId);
                                setIsSheetOpen(true);
                              }}
                              className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all cursor-pointer inline-flex items-center justify-center"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
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

      {/* Controlled Details Sheet Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md border-l-0 shadow-2xl p-0 focus:outline-none">
          <SheetHeader className="sr-only">
            <SheetTitle>Service Seeker Details</SheetTitle>
          </SheetHeader>
          <div className="h-full flex flex-col p-8 pt-12 relative overflow-y-auto scrollbar-hide">
            {isSingleLoading || !currentDrawerSeeker || !activeDrawerId ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm font-medium text-gray-500">Loading seeker details...</p>
              </div>
            ) : (
              <>
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center space-y-4 mb-8">
                  <Avatar className="h-28 w-28 rounded-2xl overflow-hidden border-4 border-white shadow-sm">
                    <AvatarImage src={getImageUrl(currentDrawerSeeker.profileImage)} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                      {currentDrawerSeeker.name?.slice(0, 2)?.toUpperCase() || "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold text-[#1A1D2E]">
                      {currentDrawerSeeker.name}
                    </h2>
                    <p className="text-[14px] text-[#6C63FF] font-medium font-mono">
                      ID: {activeDrawerId}
                    </p>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-[#F4F9FF] rounded-2xl p-6 space-y-4 mb-6">
                  <div className="flex items-center gap-4 text-[#54617A]">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Mail size={18} className="text-[#6C63FF]" />
                    </div>
                    <span className="text-[15px] font-normal break-all">
                      {currentDrawerSeeker.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[#54617A]">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Phone size={18} className="text-[#6C63FF]" />
                    </div>
                    <span className="text-[15px] font-normal">
                      {currentDrawerSeeker.phone || "No phone provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[#54617A]">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <User size={18} className="text-[#6C63FF]" />
                    </div>
                    <span className="text-[15px] font-normal uppercase">
                      Role: {currentDrawerSeeker.role}
                    </span>
                  </div>
                </div>

                {/* Account Status Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#F4F9FF] rounded-2xl p-4 text-center">
                    <p className="text-[11px] font-medium text-[#54617A] uppercase tracking-wider mb-1">Status</p>
                    <p className="text-base font-semibold text-[#1A1D2E] capitalize">
                      {currentDrawerStatus}
                    </p>
                  </div>
                  <div className="bg-[#F4F9FF] rounded-2xl p-4 text-center">
                    <p className="text-[11px] font-medium text-[#54617A] uppercase tracking-wider mb-1">Verification</p>
                    <p className="text-base font-semibold text-green-600 capitalize flex items-center justify-center gap-1">
                      <CheckCircle2 size={16} />
                      {currentDrawerSeeker.verificationStatus || "Verified"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons inside Drawer */}
                <div className="mt-auto pt-6 space-y-3">
                  {isCurrentDrawerBlocked ? (
                    <button
                      type="button"
                      onClick={() => handleToggleBlock(activeDrawerId, true)}
                      disabled={isBlocking}
                      className="w-full h-13 font-medium rounded-2xl flex items-center justify-center gap-3 bg-green-100 text-green-700 hover:bg-green-200 transition-all cursor-pointer"
                    >
                      <ShieldAlert size={20} />
                      <span>{isBlocking ? "Unblocking..." : "Unblock User"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleBlock(activeDrawerId, false)}
                      disabled={isBlocking}
                      className="w-full h-13 font-medium rounded-2xl flex items-center justify-center gap-3 bg-[#FFF1F1] text-[#E74C3C] hover:bg-[#FFEDED] transition-all cursor-pointer"
                    >
                      <Ban size={20} />
                      <span>{isBlocking ? "Blocking..." : "Block User"}</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Pagination Footer */}
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
              className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer ${page === pageNum
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
