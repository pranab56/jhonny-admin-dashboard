"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CalendarDays, ClipboardList, Users } from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "1,525",
    icon: Users,
    iconBg: "bg-[#F3F0FF]",
    iconColor: "text-[#6C63FF]"
  },
  {
    title: "Active Bookings",
    value: "85",
    icon: CalendarDays,
    iconBg: "bg-[#E6F6FF]",
    iconColor: "text-[#4DB6FF]"
  },
  {
    title: "Pending Approvals",
    value: "12",
    icon: ClipboardList,
    iconBg: "bg-[#FFF4E6]",
    iconColor: "text-[#FFA500]"
  },
];

export default function CardStates() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-none bg-white rounded-2xl h-full flex flex-col justify-center shadow-none p-0">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={cn("p-4 rounded-xl", stat.iconBg)}>
                <stat.icon className={cn("w-6 h-6", stat.iconColor)} />
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
