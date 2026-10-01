"use client";

import CardStates from "@/components/overview/CardStates";
import MonthlyRevenueChart from "@/components/overview/MonthlyRevenueChart";
import { useGetAllStateQuery, useRevenueChartQuery } from "@/features/overview/overviewApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function Overview() {
  const { isLoading: isStatsLoading } = useGetAllStateQuery(undefined);
  const { isLoading: isChartLoading } = useRevenueChartQuery(undefined);

  const isLoading = isStatsLoading || isChartLoading;

  if (isLoading) {
    return <LoadingSpinner message="Loading overview data..." className="min-h-[60vh]" size={40} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 px-0">
      {/* Top Stats Cards */}
      <CardStates />

      {/* Bar Chart Section */}
      <MonthlyRevenueChart />
    </div>
  );
}
