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
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";

const bookings = Array(9).fill({
  id: "BK- 9402",
  seeker: {
    name: "Jane Cooper",
    category: "Elderly Care",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
  },
  caregiver: {
    name: "Jane Cooper",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100",
  },
  date: "Oct 12, 2023",
  amount: "$240",
});

export default function BookingPage() {
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
            className="pl-12 h-14 bg-gray-100 border-none rounded-xl focus-visible:ring-primary shadow-none text-base"
          />
        </div>
        <Select defaultValue="status">
          <SelectTrigger className="w-full sm:w-40 h-14 bg-gray-100 py-[26px] border-none rounded-xl px-6 focus:ring-primary shadow-none text-base">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-none shadow-xl bg-white">
            <SelectItem value="status" className="cursor-pointer">Status</SelectItem>
            <SelectItem value="pending" className="cursor-pointer">Pending</SelectItem>
            <SelectItem value="completed" className="cursor-pointer">Completed</SelectItem>
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
            <Table>
              <TableHeader>
                <TableRow className="border-none bg-[#EBF2FA]/30 hover:bg-[#EBF2FA]/30">
                  <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700">Booking ID</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Services Seeker</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Caregiver</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Amount</TableHead>
                  <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking, index) => (
                  <TableRow key={index} className="border-none hover:bg-gray-50/50 transition-colors">
                    <TableCell className="px-8 py-5 text-primary font-normal text-[15px]">
                      {booking.id}
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 rounded-full overflow-hidden">
                          <AvatarImage src={booking.seeker.image} alt={booking.seeker.name} className="object-cover" />
                          <AvatarFallback>JC</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-[15px] font-semibold text-gray-800 leading-tight">{booking.seeker.name}</span>
                          <span className="text-sm text-gray-500 font-normal">{booking.seeker.category}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 rounded-full overflow-hidden">
                          <AvatarImage src={booking.caregiver.image} alt={booking.caregiver.name} className="object-cover" />
                          <AvatarFallback>JC</AvatarFallback>
                        </Avatar>
                        <span className="text-[15px] font-normal text-gray-800">{booking.caregiver.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-gray-600 font-normal text-[15px]">
                      {booking.date}
                    </TableCell>
                    <TableCell className="px-6 py-5 text-gray-600 font-normal text-[15px]">
                      {booking.amount}
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all cursor-pointer inline-flex items-center justify-center">
                        <Eye size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
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