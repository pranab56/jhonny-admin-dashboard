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
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const barChartData = [
  { name: "Monday", value: 2.5, day: "Monday" },
  { name: "Tuesday", value: 4.8, day: "Tuesday" },
  { name: "Wednesday", value: 6.2, day: "Wednesday" },
  { name: "Thursday", value: 8.0, day: "Thursday" },
  { name: "Friday", value: 11.2, day: "Friday" },
  { name: "Saturday", value: 7.1, day: "Saturday" },
  { name: "Sunday", value: 6.5, day: "Sunday" },
];

export default function BarChart() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-6"
    >
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-gray-500">Appointments Trend</CardTitle>
            <p className="text-3xl font-bold text-gray-800">12.8k</p>
          </div>
          <Select defaultValue="last-week">
            <SelectTrigger className="w-[124px] bg-[#F9FAFB] border-[#E5E7EB] text-gray-600 rounded-lg">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="h-[320px] w-full pt-6 pr-4 pl-4 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={barChartData}
              margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
              barGap={0}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 13, fontWeight: 500 }}
                dy={15}
                interval={0}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis hide domain={[0, 14]} />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="relative mb-2">
                        <div className="bg-[#1F1F1F] text-white px-4 py-2 rounded-lg shadow-2xl text-center min-w-[90px]">
                          <p className="text-sm font-bold">{payload[0].value}k</p>
                          <p className="text-[10px] opacity-60 font-medium">
                            {payload[0].payload.day}
                          </p>
                        </div>
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1F1F1F] mx-auto" />
                      </div>
                    );
                  }
                  return null;
                }}
                position={{ y: 0 }}
              />
              <Bar
                dataKey="value"
                fill="#6C63FF"
                radius={[12, 12, 0, 0]}
                barSize={70}
                animationDuration={1500}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
