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
import { motion } from "framer-motion";
import { Ban, ChevronLeft, ChevronRight, Eye, Mail, MapPin, Phone, Search } from "lucide-react";

const serviceSeekers = Array(9).fill({
  id: "SK 882",
  name: "Jane Cooper",
  image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
  joinDate: "Oct 12, 2023",
  bookings: "24",
  lastActivity: "2 hours ago",
  email: "alex.r@example.com",
  phone: "+1 555-0199",
  location: "New York, NY",
  spent: "$2,450"
});

export default function ServiceSeekersPage() {
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
            placeholder="Search by name, role, or city"
            className="pl-12 h-14 bg-white bg-gray-100 border-none rounded-xl focus-visible:ring-gray-50 shadow-none text-base"
          />
        </div>
        <Select defaultValue="status">
          <SelectTrigger className="w-full border-none sm:w-40 h-14 bg-white bg-gray-100 py-[26px] cursor-pointer rounded-xl px-6 focus:ring-primary shadow-none text-base">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-none shadow-xl bg-white">
            <SelectItem value="status" className="cursor-pointer">Status</SelectItem>
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
                  <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700">Name</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Seeker ID</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Join Date</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Bookings</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Last Activity</TableHead>
                  <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceSeekers.map((seeker, index) => (
                  <TableRow key={index} className="border-none hover:bg-gray-50/50 transition-colors">
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-[15px] font-normal text-gray-800">{seeker.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-primary font-normal text-[15px]">
                      {seeker.id}
                    </TableCell>
                    <TableCell className="px-6 py-5 text-gray-600 font-normal text-[15px]">
                      {seeker.joinDate}
                    </TableCell>
                    <TableCell className="px-6 py-5 text-gray-800 font-normal text-[15px]">
                      {seeker.bookings}
                    </TableCell>
                    <TableCell className="px-6 py-5 text-gray-600 font-normal text-[15px]">
                      {seeker.lastActivity}
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                      <Sheet>
                        <SheetTrigger asChild>
                          <button
                            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all cursor-pointer inline-flex items-center justify-center"
                          >
                            <Eye size={20} />
                          </button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md border-l-0 shadow-2xl p-0 focus:outline-none">
                          <div className="h-full flex flex-col p-8 pt-12 relative overflow-y-auto scrollbar-hide">
                            {/* Profile Header */}
                            <div className="flex flex-col items-center text-center space-y-4 mb-10">
                              <Avatar className="h-28 w-28 rounded-2xl overflow-hidden border-4 border-white shadow-sm">
                                <AvatarImage src={seeker.image} className="object-cover" />
                                <AvatarFallback>AR</AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <h2 className="text-2xl font-normal text-[#1A1D2E]">{seeker.name}</h2>
                                <p className="text-[15px] text-[#6C63FF] font-medium">
                                  {seeker.id} . Joined {seeker.joinDate}
                                </p>
                              </div>
                            </div>

                            {/* Contact Info Box */}
                            <div className="bg-[#F4F9FF] rounded-2xl p-6 space-y-5 mb-8">
                              <div className="flex items-center gap-4 text-[#54617A]">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                  <Mail size={18} className="text-[#6C63FF]" />
                                </div>
                                <span className="text-[15px] font-normal">{seeker.email}</span>
                              </div>
                              <div className="flex items-center gap-4 text-[#54617A]">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                  <Phone size={18} className="text-[#6C63FF]" />
                                </div>
                                <span className="text-[15px] font-normal">{seeker.phone}</span>
                              </div>
                              <div className="flex items-center gap-4 text-[#54617A]">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                  <MapPin size={18} className="text-[#6C63FF]" />
                                </div>
                                <span className="text-[15px] font-normal">{seeker.location}</span>
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-10">
                              <div className="bg-[#F4F9FF] rounded-2xl p-6 text-center">
                                <p className="text-[11px] font-medium text-[#54617A] uppercase tracking-wider mb-2">Spent</p>
                                <p className="text-xl font-normal text-[#1A1D2E]">{seeker.spent}</p>
                              </div>
                              <div className="bg-[#F4F9FF] rounded-2xl p-6 text-center">
                                <p className="text-[11px] font-medium text-[#54617A] uppercase tracking-wider mb-2">Bookings</p>
                                <p className="text-xl font-normal text-[#1A1D2E]">{seeker.bookings}</p>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-auto pt-6">
                              <button className="w-full h-14 bg-[#FFF1F1] text-[#E74C3C] font-medium rounded-2xl flex items-center justify-center gap-3 hover:bg-[#FFEDED] transition-all cursor-pointer">
                                <Ban size={20} />
                                <span>Suspend</span>
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

      {/* Pagination Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-2 pt-4"
      >
        <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 cursor-pointer transition-all">
          <ChevronLeft size={20} />
        </button>
        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-white font-medium text-sm shadow-none cursor-pointer">
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
