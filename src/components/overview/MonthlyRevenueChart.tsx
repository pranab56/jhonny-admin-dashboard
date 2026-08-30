"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRevenueChartQuery } from "@/features/overview/overviewApi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueChartItem {
  label?: string;
  month?: string;
  revenue?: number;
  bookings?: number;
  year?: number | string;
}

export default function MonthlyRevenueChart() {
  const [windowWidth, setWindowWidth] = useState(0);
  const { data: apiResponse, isLoading } = useRevenueChartQuery(undefined);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth > 0 && windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const rawData = apiResponse?.data;
  const chartData = Array.isArray(rawData) && rawData.length > 0
    ? rawData.map((item: RevenueChartItem) => ({
        name: item.label || item.month || "N/A",
        revenue: item.revenue ?? 0,
        bookings: item.bookings ?? 0,
        year: item.year ?? "",
      }))

    : [
        { name: "Jan", revenue: 0, bookings: 0 },
        { name: "Feb", revenue: 0, bookings: 0 },
        { name: "Mar", revenue: 0, bookings: 0 },
        { name: "Apr", revenue: 0, bookings: 0 },
        { name: "May", revenue: 0, bookings: 0 },
        { name: "Jun", revenue: 0, bookings: 0 },
        { name: "Jul", revenue: 0, bookings: 0 },
        { name: "Aug", revenue: 0, bookings: 0 },
        { name: "Sep", revenue: 0, bookings: 0 },
        { name: "Oct", revenue: 0, bookings: 0 },
        { name: "Nov", revenue: 0, bookings: 0 },
        { name: "Dec", revenue: 0, bookings: 0 },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-6"
    >
      <Card className="border-none bg-white rounded-2xl overflow-hidden shadow-none p-0">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 sm:py-6 gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">Monthly Revenue Overview</CardTitle>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Revenue performance over time</p>
          </div>
          <Select defaultValue="last-month">
            <SelectTrigger className="w-full sm:w-[130px] bg-[#F8F9FC] p-4 sm:p-6 border-none text-gray-600 rounded-xl h-10 sm:h-11 px-4 cursor-pointer">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-xl bg-white">
              <SelectItem value="last-month" className="cursor-pointer rounded-lg">Last Month</SelectItem>
              <SelectItem value="last-3-months" className="cursor-pointer rounded-lg">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="h-[300px] sm:h-[350px] lg:h-[400px] w-full px-4 sm:px-6 pb-6 mt-2 relative">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4DB6FF] border-t-transparent" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 0,
                  left: isMobile ? -35 : -20,
                  bottom: isMobile ? 10 : 25
                }}
              >
                <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94A3B8",
                    fontSize: isMobile ? 10 : 12,
                    fontWeight: 500
                  }}
                  dy={10}
                  interval={isMobile ? 1 : 0}
                />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const itemData = payload[0].payload;
                      const revValue = payload[0].value as number;
                      return (
                        <div className="relative mb-2 flex flex-col items-center z-50">
                          <div className="bg-[#1A1D1F] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-2xl text-center min-w-[80px]">
                            <p className="text-sm sm:text-base font-bold">${revValue.toLocaleString()}</p>
                            <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">
                              {itemData.name} {itemData.year ? `(${itemData.year})` : ""} - {itemData.bookings} {itemData.bookings === 1 ? 'booking' : 'bookings'}
                            </p>
                          </div>
                          <div className="w-0 h-0 border-l-[5px] sm:border-l-[6px] border-l-transparent border-r-[5px] sm:border-r-[6px] border-r-transparent border-t-[5px] sm:border-t-[6px] border-t-[#1A1D1F]" />
                        </div>
                      );
                    }
                    return null;
                  }}
                  wrapperStyle={{ outline: 'none', zIndex: 1000 }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#4DB6FF"
                  radius={[6, 6, 6, 6]}
                  barSize={isMobile ? 14 : isTablet ? 24 : 32}
                  animationDuration={1500}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

