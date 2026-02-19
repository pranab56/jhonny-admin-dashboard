"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 6000 },
  { name: "Mar", revenue: 9000 },
  { name: "Apr", revenue: 10000 },
  { name: "May", revenue: 11000 },
  { name: "Jun", revenue: 8500 },
  { name: "Jul", revenue: 10500 },
  { name: "Aug", revenue: 9500 },
  { name: "Sep", revenue: 8000 },
  { name: "Oct", revenue: 6500 },
  { name: "Nov", revenue: 7500 },
  { name: "Dec", revenue: 10000 },
];

export default function MonthlyRevenueChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-6"
    >
      <Card className="border-none bg-white rounded-2xl overflow-hidden shadow-none p-0">
        <CardHeader className="flex flex-row items-center justify-between px-6 py-6">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-gray-800">Monthly Revenue Overview</CardTitle>
            <p className="text-sm text-gray-500 font-medium">Revenue performance over the last 30 days</p>
          </div>
          <Select defaultValue="last-month">
            <SelectTrigger className="w-[130px] bg-[#F8F9FC] p-6 border-none text-gray-600 rounded-xl h-11 px-4 cursor-pointer">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-xl bg-white">
              <SelectItem value="last-month" className="cursor-pointer rounded-lg">Last Month</SelectItem>
              <SelectItem value="last-3-months" className="cursor-pointer rounded-lg">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="h-[400px] w-full px-6 pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              margin={{ top: 20, right: 0, left: -20, bottom: 25 }}
            >
              <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
                dy={10}
                interval={0}
              />
              <YAxis
                hide
                domain={[0, 12000]}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="relative mb-2 flex flex-col items-center">
                        <div className="bg-[#1A1D1F] text-white px-4 py-2 rounded-xl shadow-2xl text-center min-w-[70px]">
                          <p className="text-base font-bold">{(payload[0].value as number / 1000).toFixed(0)}k</p>
                          <p className="text-[11px] text-gray-400 font-medium">
                            {payload[0].payload.name}
                          </p>
                        </div>
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1A1D1F]" />
                      </div>
                    );
                  }
                  return null;
                }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Bar
                dataKey="revenue"
                fill="#4DB6FF"
                radius={[8, 8, 8, 8]}
                barSize={32}
                animationDuration={1500}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
