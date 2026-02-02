import React from "react";

export default function JDPriority() {
  // Static Data
  const data = [
    { priority_level: "low", count: 25 },
    { priority_level: "medium", count: 60 },
    { priority_level: "high", count: 45 },
    { priority_level: "critical", count: 80 },
  ];

  const maxCount = Math.max(...data.map((d) => d.count), 100);

  const getBarColor = (level) => {
    switch (level.toLowerCase()) {
      case "low":
        return "bg-indigo-300";
      case "medium":
        return "bg-indigo-500";
      case "high":
        return "bg-indigo-400";
      case "critical":
        return "bg-indigo-600";
      default:
        return "bg-indigo-400";
    }
  };

  const formatLabel = (level) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <div className="bg-white rounded-xl p-6  shadow-sm border border-gray-100 ">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          JD Priority
        </h3>

        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600">
          <option>Yearly</option>
          <option>Monthly</option>
          <option>Weekly</option>
        </select>
      </div>

      <div className="h-64 flex items-end justify-around gap-4 px-4">
        {data.map((item, index) => {
          const height = (item.count / maxCount) * 100;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-3"
            >
              <div
                className="w-full flex items-end justify-center"
                style={{ height: "200px" }}
              >
                <div
                  className={`w-full ${getBarColor(
                    item.priority_level
                  )} rounded-t-2xl transition-all duration-300 hover:opacity-80 relative group`}
                  style={{ height: height + "%", maxWidth: "80px" }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold text-gray-700">
                      {item.count}
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-sm text-gray-600 font-medium">
                {formatLabel(item.priority_level)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          Most Active: Medium
        </div>
      </div>
    </div>
  );
}
