"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, CreditCard, UserPlus } from "lucide-react";
import Link from "next/link";

const activities = [
  {
    id: 1,
    title: "New Caregiver Registration",
    description: "Sarah Miller has submitted documents for verification. Pending approval.",
    time: "2 mins ago",
    icon: UserPlus,
    iconBg: "bg-[#E6F9F1]",
    iconColor: "text-[#2ECC71]"
  },
  {
    id: 2,
    title: "Payment Processed Successfully",
    description: "Booking #8842 payment of $145.00 has been received and confirmed.",
    time: "15 mins ago",
    icon: CreditCard,
    iconBg: "bg-[#F0F2FF]",
    iconColor: "text-[#6C63FF]"
  },
  {
    id: 3,
    title: "Dispute Opened",
    description: "Seeker 'John Doe' opened a dispute for Booking #9012. Reason: Service not as described.",
    time: "45 mins ago",
    icon: AlertCircle,
    iconBg: "bg-[#FFF1F1]",
    iconColor: "text-[#E74C3C]"
  },
];

export default function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-6"
    >
      <Card className="border-none bg-white rounded-2xl overflow-hidden shadow-none p-0">
        <CardContent className="p-0">
          <div className="p-6 sm:p-8 flex flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activity Feed</h2>
            <Link href="/all-logs" className="text-sm font-normal text-[#6C63FF] hover:underline transition-all whitespace-nowrap">
              View All Log
            </Link>
          </div>

          <div className="px-6 sm:px-8 pb-8 space-y-8">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={cn("p-3 rounded-full flex-shrink-0", activity.iconBg)}>
                  <activity.icon className={cn("w-5 h-5", activity.iconColor)} />
                </div>
                <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-start gap-2 sm:gap-4">
                  <div className="space-y-1">
                    <h4 className="text-[15px] font-semibold text-gray-800 leading-tight">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-500 font-medium leading-normal">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400 font-medium whitespace-nowrap pt-0.5">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
