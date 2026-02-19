"use client";

import CardStates from "@/components/overview/CardStates";
import MonthlyRevenueChart from "@/components/overview/MonthlyRevenueChart";
import RecentActivity from "@/components/overview/RecentActivity";

export default function Overview() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 px-0">
      {/* Top Stats Cards */}
      <CardStates />

      {/* Bar Chart Section */}
      <MonthlyRevenueChart />

      {/* Activity Feed Section */}
      <RecentActivity />
    </div>
  );
}
