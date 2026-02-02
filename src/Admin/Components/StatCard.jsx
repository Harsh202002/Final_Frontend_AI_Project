import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

function StatCard({ title, value, trend, trendDirection, sparklineData = [] }) {
  const isPositive = trendDirection === "up" || (typeof trend === "number" && trend > 0);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
        </div>

        <div className={`text-xs font-semibold py-1 px-3 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {isPositive ? '↗' : '↘'} {isPositive && typeof trend === 'number' ? `+${trend}%` : (!isPositive && typeof trend === 'number' ? `${Math.abs(trend)}%` : trend)}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <h3 className="text-4xl font-extrabold text-gray-900">{value}</h3>

        <div className="w-24 h-12 flex items-end gap-1">
          {sparklineData.slice(0, 6).map((h, i) => (
            <div key={i} className={`flex-1 rounded-t ${isPositive ? 'bg-green-100' : 'bg-red-100'}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Named export: small wrapper used elsewhere if needed
export function StatsSection() {
  const statsData = [
    {
      title: "Total Jobs Created",
      value: 121,
      trend: 30,
      trendDirection: "up",
      sparklineData: [30, 45, 35, 55, 50, 65],
    },
    {
      title: "Total Applicants",
      value: 121,
      trend: -30,
      trendDirection: "down",
      sparklineData: [45, 35, 30, 25, 20, 15],
    },
    {
      title: "Hired Candidates",
      value: 121,
      trend: -30,
      trendDirection: "down",
      sparklineData: [15, 25, 20, 35, 30, 45],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

export default StatCard;
