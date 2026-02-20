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
  SheetTrigger,
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
import { motion } from "framer-motion";
import {
  Award,
  Ban,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  Search
} from "lucide-react";
import React from "react";

const caregivers = [
  { name: "Sarah Jenkins", id: "D: CG-99421", date: "Oct 12, 2023", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" },
  { name: "Wade Warren", id: "D: CG-99421", date: "Oct 12, 2023", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100" },
  { name: "Esther Howard", id: "D: CG-99421", date: "Oct 12, 2023", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" },
  { name: "Jenny Wilson", id: "D: CG-99421", date: "Oct 12, 2023", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100" },
  { name: "Guy Hawkins", id: "D: CG-99421", date: "Oct 12, 2023", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100" },
  { name: "Robert Fox", id: "D: CG-99421", date: "Oct 12, 2023", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100&h=100" },
  { name: "Jacob Jones", id: "D: CG-99421", date: "Oct 12, 2023", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100" },
  { name: "Bessie Cooper", id: "D: CG-99421", date: "Oct 12, 2023", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100" },
  { name: "Albert Flores", id: "D: CG-99421", date: "Oct 12, 2023", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100" },
];

export default function CaregiversPage() {
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-center bg-white p-3 rounded-lg"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, role, or city"
              className="pl-12 h-14 bg-gray-100 border-none rounded-xl focus-visible:ring-primary shadow-none text-base"
            />
          </div>
          <Select defaultValue="status">
            <SelectTrigger className="w-full sm:w-40 h-14 py-[25px] bg-gray-100 border-none rounded-xl px-6 focus:ring-primary shadow-none text-base">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-xl bg-white">
              <SelectItem value="status" className="cursor-pointer">Status</SelectItem>
              <SelectItem value="active" className="cursor-pointer">Active</SelectItem>
              <SelectItem value="pending" className="cursor-pointer">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <button className="h-12 bg-primary text-white font-medium px-8 rounded-lg hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap shadow-none">
              Invite Caregiver
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] border-none rounded-3xl p-8 bg-white shadow-2xl">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-medium text-[#1A1D2E]">Invite Caregiver</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2.5">
                <Label className="text-[15px] font-medium text-gray-700">Full Name</Label>
                <Input placeholder="e.g., Jane Doe" className="h-14 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus-visible:ring-primary shadow-none" />
              </div>
              <div className="space-y-2.5">
                <Label className="text-[15px] font-medium text-gray-700">Email Address</Label>
                <Input placeholder="name@example.com" className="h-14 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus-visible:ring-primary shadow-none" />
              </div>
              <div className="space-y-2.5 w-full">
                <Label className="text-[15px] font-medium text-gray-700">Specialization</Label>
                <Select>
                  <SelectTrigger className="h-14 bg-[#F5F6FF]/50 py-7 w-full border-none rounded-xl px-6 focus:ring-primary shadow-none text-gray-500">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl bg-white">
                    <SelectItem value="cna">CNA Certified</SelectItem>
                    <SelectItem value="rn">Registered Nurse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[15px] font-medium text-gray-700">Personal Message <span className="text-gray-400 font-medium">(Optional)</span></Label>
                <Textarea placeholder="Add a brief note ..." className="min-h-[120px] bg-[#F5F6FF]/50 border-none rounded-xl p-6 focus-visible:ring-primary shadow-none resize-none" />
              </div>
              <div className="flex items-center gap-4 pt-4">
                <button onClick={() => setIsInviteOpen(false)} className="flex-1 h-12 bg-gray-100/80 text-gray-600 font-medium rounded-lg hover:bg-gray-200/80 transition-all cursor-pointer">
                  Cancel and Close
                </button>
                <button className="flex-1 h-12 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all cursor-pointer">
                  Send Invitation
                </button>
              </div>
            </div>
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
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700 text-center">Caregiver ID</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700 text-center">Applied ON</TableHead>
                  <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caregivers.map((cg, index) => (
                  <TableRow key={index} className="border-none hover:bg-gray-50/50 transition-colors">
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 rounded-xl border-none">
                          <AvatarImage src={cg.image} className="object-cover" />
                          <AvatarFallback>CG</AvatarFallback>
                        </Avatar>
                        <span className="text-[15px] font-normal text-gray-800">{cg.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-primary font-normal text-[15px] text-center">
                      {cg.id}
                    </TableCell>
                    <TableCell className="px-6 py-5 text-gray-600 font-normal text-[15px] text-center">
                      {cg.date}
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                      <Sheet>
                        <SheetTrigger asChild>
                          <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all cursor-pointer inline-flex items-center justify-center">
                            <Eye size={20} />
                          </button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md bg-white border-l-0 p-0 focus:outline-none">
                          <div className="h-full flex flex-col p-6 relative overflow-y-auto scrollbar-hide">
                            {/* Profile Header */}
                            <div className="flex flex-col items-center text-center">
                              <Avatar className="h-32 w-32 rounded-3xl overflow-hidden border-4 border-white shadow-sm">
                                <AvatarImage src={cg.image} className="object-cover" />
                                <AvatarFallback>MC</AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-[#1A1D2E]">Michael Chen</h2>
                                <p className="text-[15px] text-primary font-medium uppercase tracking-tight">CNA Certified Caregiver</p>
                              </div>
                            </div>

                            {/* Contact Info Box */}
                            <div className="bg-[#F4F9FF] rounded-2xl p-6 space-y-5 mb-10">
                              <div className="flex items-center gap-4 text-[#54617A]">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                  <Mail size={18} className="text-primary" />
                                </div>
                                <span className="text-[15px] font-medium">alex.r@example.com</span>
                              </div>
                              <div className="flex items-center gap-4 text-[#54617A]">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                  <Phone size={18} className="text-primary" />
                                </div>
                                <span className="text-[15px] font-medium">+1 555-0199</span>
                              </div>
                              <div className="flex items-center gap-4 text-[#54617A]">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                  <MapPin size={18} className="text-primary" />
                                </div>
                                <span className="text-[15px] font-medium">New York, NY</span>
                              </div>
                            </div>

                            {/* Document Verification Section */}
                            <div className="space-y-4 mb-10">
                              <h3 className="text-lg font-bold text-[#1A1D2E] mb-6">Document Verification</h3>

                              <div className="flex items-center justify-between p-4 bg-[#E6F9F1] rounded-2xl">
                                <div className="flex items-center gap-4">
                                  <div className="p-2 bg-[#D1F2E3] rounded-lg">
                                    <CreditCard size={20} className="text-[#2ECC71]" />
                                  </div>
                                  <div>
                                    <p className="text-[14px] font-bold text-gray-800">State ID / Driver&apos;s License</p>
                                    <p className="text-[12px] font-medium text-[#2ECC71]">Verified Oct 16, 2023</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-4 bg-[#E6F9F1] rounded-2xl">
                                <div className="flex items-center gap-4">
                                  <div className="p-2 bg-[#D1F2E3] rounded-lg">
                                    <Award size={20} className="text-[#2ECC71]" />
                                  </div>
                                  <div>
                                    <p className="text-[14px] font-bold text-gray-800">CNA Certification</p>
                                    <p className="text-[12px] font-medium text-[#2ECC71]">Valid through 2025</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                                <div className="flex items-center gap-4">
                                  <div className="p-2 bg-[#F5F6FF] rounded-lg">
                                    <FileText size={20} className="text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-[14px] font-bold text-gray-800">Immunization Records</p>
                                    <p className="text-[12px] font-medium text-gray-400">Uploaded PDF (2.4MB)</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto space-y-4">
                              <button className="w-full h-12 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all cursor-pointer">
                                Approve & Assign Badge
                              </button>
                              <button className="w-full h-12 bg-[#FFF1F1] text-[#E74C3C] font-medium rounded-lg flex items-center justify-center gap-3 hover:bg-[#FFEDED] transition-all cursor-pointer">
                                <Ban size={20} />
                                <span>Reject</span>
                              </button>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-2 pt-4"
      >
        <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 cursor-pointer transition-all">
          <ChevronLeft size={20} />
        </button>
        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-white font-bold text-sm shadow-none cursor-pointer">
          1
        </button>
        <button className="h-10 w-10 flex items-center justify-center rounded-full border border-transparent text-gray-500 font-medium text-sm hover:bg-gray-50 cursor-pointer">
          2
        </button>
        <button className="h-10 w-10 flex items-center justify-center rounded-full border border-transparent text-gray-500 font-medium text-sm hover:bg-gray-50 cursor-pointer">
          3
        </button>
        <span className="px-2 text-gray-400">...</span>
        <button className="h-10 w-10 flex items-center justify-center rounded-full border border-transparent text-gray-500 font-medium text-sm hover:bg-gray-50 cursor-pointer">
          12
        </button>
        <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 cursor-pointer transition-all">
          <ChevronRight size={20} />
        </button>
      </motion.div>
    </div>
  );
}