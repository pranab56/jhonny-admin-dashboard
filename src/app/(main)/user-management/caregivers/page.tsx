"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useGetAllCareGiversQuery,
  useInviteCaregiverMutation,
  useToggleVerifyCaregiverMutation,
  useVerifyCaregiverMutation,
} from "@/features/userManagement/userApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { baseURL } from "@/utils/BaseURL";
import { motion } from "framer-motion";
import {
  Award,
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  Mail,
  Phone,
  Search,
  Star,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface CaregiverUser {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  role?: string;
  status?: string;
  verified?: boolean;
  verificationStatus?: string;
  intakeCompleted?: boolean;
  isBlocked?: boolean;
  isDeleted?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CaregiverItem {
  _id: string;
  user?: CaregiverUser;
  appliedOn?: string;
  hourlyRate?: number;
  verifiedBadge?: boolean;
  averageRating?: number;
  totalReviews?: number;
  status?: string;
  verificationStatus?: string;
  specialization?: string;
}

export default function CaregiversPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState<CaregiverItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Invite Form state
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSpecialization, setInviteSpecialization] = useState("Dementia Care");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteErrors, setInviteErrors] = useState<{ name?: string; email?: string }>({});

  // Queries & Mutations
  const { data: apiResponse, isLoading, refetch } = useGetAllCareGiversQuery({
    page,
    searchTerm,
  });

  const [verifyCaregiver, { isLoading: isVerifying }] = useVerifyCaregiverMutation();
  const [toggleVerifyCaregiver, { isLoading: isTogglingBadge }] = useToggleVerifyCaregiverMutation();
  const [inviteCaregiver, { isLoading: isInviting }] = useInviteCaregiverMutation();

  const caregiversList: CaregiverItem[] = apiResponse?.data || [];
  const meta = apiResponse?.meta || { page: 1, totalPages: 1, total: 0 };

  const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
    return `${baseURL}/api/v1/uploads/${path.replace(/^\//, "")}`;
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const getVerificationBadgeClass = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "rejected":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  const handleVerify = async (id: string, status: "verified" | "rejected") => {
    try {
      const res = await verifyCaregiver({ id, status }).unwrap();
      toast.success(
        res?.message || (status === "verified" ? "Caregiver verified successfully!" : "Caregiver rejected.")
      );
      refetch();
    } catch (err: unknown) {
      console.error("Verify caregiver error:", err);
      const error = err as { data?: { message?: string }; message?: string };
      toast.error(error?.data?.message || error?.message || "Failed to update verification status.");
    }
  };

  const handleToggleBadge = async (id: string) => {
    try {
      const res = await toggleVerifyCaregiver({ id }).unwrap();
      toast.success(res?.message || "Verified badge status updated successfully!");
      refetch();
    } catch (err: unknown) {
      console.error("Toggle caregiver badge error:", err);
      const error = err as { data?: { message?: string }; message?: string };
      toast.error(error?.data?.message || error?.message || "Failed to update verified badge.");
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; email?: string } = {};

    if (!inviteName.trim()) {
      errors.name = "Full name is required";
    }

    if (!inviteEmail.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      errors.email = "Please enter a valid email address";
    }

    if (Object.keys(errors).length > 0) {
      setInviteErrors(errors);
      return;
    }

    setInviteErrors({});

    try {
      const res = await inviteCaregiver({
        name: inviteName,
        email: inviteEmail,
        specialization: inviteSpecialization,
        personalMessage: inviteMessage,
      }).unwrap();

      toast.success(res?.message || "Invitation sent successfully!");
      setInviteName("");
      setInviteEmail("");
      setInviteMessage("");
      setInviteErrors({});
      setIsInviteOpen(false);
      refetch();
    } catch (err: unknown) {
      console.error("Invite caregiver error:", err);
      const error = err as { data?: { message?: string }; message?: string };
      toast.error(error?.data?.message || error?.message || "Failed to send invitation.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-3 rounded-lg"
      >
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-12 h-14 bg-gray-100 border-none rounded-xl focus-visible:ring-primary shadow-none text-base"
          />
        </div>

        {/* Invite Dialog */}
        <Dialog open={isInviteOpen} onOpenChange={(open) => {
          setIsInviteOpen(open);
          if (!open) {
            setInviteErrors({});
          }
        }}>
          <DialogTrigger asChild>
            <button className="h-12 bg-primary text-white font-medium px-8 rounded-lg hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap shadow-none w-full sm:w-auto">
              Invite Caregiver
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] border-none rounded-3xl p-8 bg-white shadow-2xl">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-semibold text-[#1A1D2E]">Invite Caregiver</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSendInvite} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium text-gray-700">Full Name <span className="text-rose-500">*</span></Label>
                <Input
                  placeholder="e.g., Sarah Jenkins"
                  value={inviteName}
                  onChange={(e) => {
                    setInviteName(e.target.value);
                    if (inviteErrors.name) setInviteErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className={cn(
                    "h-13 bg-[#F5F6FF]/50 border-none rounded-xl px-5 focus-visible:ring-primary shadow-none",
                    inviteErrors.name && "border border-rose-500 focus-visible:ring-rose-500 bg-rose-50/20"
                  )}
                />
                {inviteErrors.name && (
                  <p className="text-xs text-rose-500 font-medium px-1 flex items-center gap-1">
                    {inviteErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[15px] font-medium text-gray-700">Email Address <span className="text-rose-500">*</span></Label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    if (inviteErrors.email) setInviteErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={cn(
                    "h-13 bg-[#F5F6FF]/50 border-none rounded-xl px-5 focus-visible:ring-primary shadow-none",
                    inviteErrors.email && "border border-rose-500 focus-visible:ring-rose-500 bg-rose-50/20"
                  )}
                />
                {inviteErrors.email && (
                  <p className="text-xs text-rose-500 font-medium px-1 flex items-center gap-1">
                    {inviteErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label className="text-[15px] font-medium text-gray-700">Specialization</Label>
                <Select value={inviteSpecialization} onValueChange={setInviteSpecialization}>
                  <SelectTrigger className="h-13 bg-[#F5F6FF]/50 py-6 w-full border-none rounded-xl px-5 focus:ring-primary shadow-none text-gray-700 cursor-pointer">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl bg-white">
                    <SelectItem value="Dementia Care" className="cursor-pointer">Dementia Care</SelectItem>
                    <SelectItem value="Elderly Care" className="cursor-pointer">Elderly Care</SelectItem>
                    <SelectItem value="CNA Certified" className="cursor-pointer">CNA Certified</SelectItem>
                    <SelectItem value="Registered Nurse" className="cursor-pointer">Registered Nurse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[15px] font-medium text-gray-700">
                  Personal Message <span className="text-gray-400 font-normal">(Optional)</span>
                </Label>
                <Textarea
                  placeholder="Add a brief note..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="min-h-[100px] bg-[#F5F6FF]/50 border-none rounded-xl p-5 focus-visible:ring-primary shadow-none resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="flex-1 h-12 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="flex-1 h-12 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isInviting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Invitation</span>
                  )}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                  <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700">Name</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700 text-center">Email</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700 text-center">Verification Status</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700 text-center">Verified Badge</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700 text-center">Applied On</TableHead>
                  <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12">
                      <LoadingSpinner message="Loading caregivers..." className="py-8" />
                    </TableCell>
                  </TableRow>
                ) : caregiversList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-gray-500 font-medium">
                      No caregivers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  caregiversList.map((cg) => {
                    const profileId = cg._id;
                    const name = cg.user?.name || "N/A";
                    const email = cg.user?.email || "";
                    const verificationStatus = cg.user?.verificationStatus || cg.verificationStatus || "pending";
                    const isVerifiedBadge = cg.verifiedBadge ?? cg.user?.verified ?? false;
                    const dateStr = cg.appliedOn
                      ? new Date(cg.appliedOn).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                      : "N/A";

                    return (
                      <TableRow key={profileId} className="border-none hover:bg-gray-50/50 transition-colors">
                        <TableCell className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-11 w-11 rounded-xl border border-gray-100">
                              <AvatarImage src={getImageUrl(cg.user?.profileImage)} alt={name} className="object-cover" />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {name?.slice(0, 2)?.toUpperCase() || "CG"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-[15px] font-medium text-gray-800">{name}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-5 text-gray-700 font-mono text-[14px] text-center">
                          {email}
                        </TableCell>

                        <TableCell className="px-6 py-5 text-center">
                          <span className={cn("px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider", getVerificationBadgeClass(verificationStatus))}>
                            {verificationStatus}
                          </span>
                        </TableCell>

                        <TableCell className="px-6 py-5 text-center">
                          {isVerifiedBadge ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
                              <CheckCircle2 size={13} className="text-blue-600" /> Badge On
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                              No Badge
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="px-6 py-5 text-gray-600 font-normal text-[15px] text-center">
                          {dateStr}
                        </TableCell>

                        <TableCell className="px-8 py-5 text-right">
                          <button
                            title="View Details"
                            onClick={() => {
                              setSelectedCaregiver(cg);
                              setIsSheetOpen(true);
                            }}
                            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all cursor-pointer inline-flex items-center justify-center"
                          >
                            <Eye size={20} />
                          </button>
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

      {/* Single Caregiver Details Drawer (Sheet) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md bg-white border-l-0 p-0 focus:outline-none">
          <SheetHeader className="sr-only">
            <SheetTitle>Caregiver Profile Details</SheetTitle>
          </SheetHeader>
          <div className="h-full flex flex-col p-8 relative overflow-y-auto scrollbar-hide">
            {selectedCaregiver ? (
              <>
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative">
                    <Avatar className="h-28 w-28 rounded-3xl overflow-hidden border-4 border-white shadow-sm mb-4">
                      <AvatarImage src={getImageUrl(selectedCaregiver.user?.profileImage)} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                        {selectedCaregiver.user?.name?.slice(0, 2)?.toUpperCase() || "CG"}
                      </AvatarFallback>
                    </Avatar>
                    {(selectedCaregiver.verifiedBadge || selectedCaregiver.user?.verified) && (
                      <span className="absolute bottom-4 right-0 p-1.5 bg-emerald-500 text-white rounded-full shadow-md" title="Verified Caregiver">
                        <CheckCircle2 size={16} />
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-[#1A1D2E] flex items-center justify-center gap-1.5">
                      <span>{selectedCaregiver.user?.name || "Caregiver Details"}</span>
                    </h2>
                    <p className="text-xs text-primary font-mono font-medium">
                      ID: {selectedCaregiver._id}
                    </p>
                  </div>
                </div>

                {/* Rates & Ratings Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#F4F9FF] rounded-2xl p-4 flex flex-col items-center text-center">
                    <div className="p-2 bg-white rounded-xl shadow-xs mb-1.5 text-emerald-600">
                      <DollarSign size={18} />
                    </div>
                    <p className="text-[11px] font-medium text-[#54617A] uppercase tracking-wider">Hourly Rate</p>
                    <p className="text-base font-bold text-[#1A1D2E] mt-0.5">
                      ${selectedCaregiver.hourlyRate || 0}/hr
                    </p>
                  </div>
                  <div className="bg-[#F4F9FF] rounded-2xl p-4 flex flex-col items-center text-center">
                    <div className="p-2 bg-white rounded-xl shadow-xs mb-1.5 text-amber-500">
                      <Star size={18} fill="#F59E0B" />
                    </div>
                    <p className="text-[11px] font-medium text-[#54617A] uppercase tracking-wider">Rating</p>
                    <p className="text-base font-bold text-[#1A1D2E] mt-0.5">
                      {selectedCaregiver.averageRating ?? 0} ({selectedCaregiver.totalReviews ?? 0})
                    </p>
                  </div>
                </div>

                {/* Contact Info Box */}
                <div className="bg-[#F4F9FF] rounded-2xl p-6 space-y-4 mb-6">
                  <div className="flex items-center gap-4 text-[#54617A]">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <span className="text-[15px] font-medium break-all">
                      {selectedCaregiver.user?.email || "N/A"}
                    </span>
                  </div>
                  {selectedCaregiver.user?.phone && (
                    <div className="flex items-center gap-4 text-[#54617A]">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Phone size={18} className="text-primary" />
                      </div>
                      <span className="text-[15px] font-medium">{selectedCaregiver.user.phone}</span>
                    </div>
                  )}
                </div>

                {/* Applied On Stats */}
                <div className="bg-[#F4F9FF] rounded-2xl p-4 text-center mb-6">
                  <p className="text-[11px] font-medium text-[#54617A] uppercase tracking-wider mb-1">Applied Date</p>
                  <p className="text-base font-semibold text-[#1A1D2E]">
                    {selectedCaregiver.appliedOn
                      ? new Date(selectedCaregiver.appliedOn).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : "N/A"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-3 pt-6">
                  {/* 1. Approve & Verify Button (Hits useVerifyCaregiverMutation with body { status: "verified" }) */}
                  <button
                    onClick={() => handleVerify(selectedCaregiver._id, "verified")}
                    disabled={isVerifying}
                    className="w-full h-13 bg-primary text-white font-medium rounded-2xl hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}
                    <span>Approve & Verify</span>
                  </button>

                  {/* 2. Toggle Verified Badge Button (Hits useToggleVerifyCaregiverMutation to toggle verifiedBadge) */}
                  <button
                    onClick={() => handleToggleBadge(selectedCaregiver._id)}
                    disabled={isTogglingBadge}
                    className="w-full h-13 bg-blue-50 text-blue-700 border border-blue-200 font-medium rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isTogglingBadge ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-700 border-t-transparent" />
                    ) : (
                      <Award size={18} />
                    )}
                    <span>
                      {selectedCaregiver.verifiedBadge ? "Remove Verified Badge" : "Assign Verified Badge"}
                    </span>
                  </button>

                  {/* 3. Reject Verification Button (Hits useVerifyCaregiverMutation with body { status: "rejected" }) */}
                  <button
                    onClick={() => handleVerify(selectedCaregiver._id, "rejected")}
                    disabled={isVerifying}
                    className="w-full h-12 bg-[#FFF1F1] text-[#E74C3C] font-medium rounded-2xl flex items-center justify-center gap-2 hover:bg-[#FFEDED] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Ban size={18} />
                    <span>Reject Verification</span>
                  </button>
                </div>
              </>
            ) : null}
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