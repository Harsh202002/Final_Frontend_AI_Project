import React from 'react';

const stats = [
  { label: "Companies Trust Us", value: "500+" },
  { label: "Candidates Processed", value: "2M+" },
  { label: "Countries Served", value: "30+" },
  { label: "Customer Satisfaction", value: "98%" },
];

export default function StatsBar() {
  return (
    <div >
      <div className="bg-white  shadow-xl grid grid-cols-2 md:grid-cols-4 py-6 md:py-8 border border-gray-100">
        {stats.map((stat, i) => (
          <div key={i} className="text-center border-r last:border-0 border-gray-100 px-3 md:px-4">
            <div className="text-2xl md:text-3xl font-bold text-[#243f99]">{stat.value}</div>
            <div className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
