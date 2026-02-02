import React from "react";

export default function JDGenerationHeatmap() {
  // Static Data
  const data = [
    { role: "Front-end Developer", month: "Jan", percentage: 85 },
    { role: "Front-end Developer", month: "Feb", percentage: 72 },
    { role: "Front-end Developer", month: "Mar", percentage: 90 },
    { role: "Back-end Developer", month: "Jan", percentage: 65 },
    { role: "Back-end Developer", month: "Feb", percentage: 78 },
    { role: "Back-end Developer", month: "Mar", percentage: 88 },
    { role: "UI-UX Designer", month: "Jan", percentage: 55 },
    { role: "UI-UX Designer", month: "Feb", percentage: 60 },
    { role: "UI-UX Designer", month: "Mar", percentage: 75 },
    { role: "Product Designer", month: "Jan", percentage: 40 },
    { role: "Product Designer", month: "Feb", percentage: 68 },
    { role: "Product Designer", month: "Mar", percentage: 82 },
    { role: "Python Developer", month: "Jan", percentage: 92 },
    { role: "Python Developer", month: "Feb", percentage: 87 },
    { role: "Python Developer", month: "Mar", percentage: 95 },
  ];

  const roles = [
    "Front-end Developer",
    "Back-end Developer",
    "UI-UX Designer",
    "Product Designer",
    "Python Developer",
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const getColor = (percentage) => {
    if (percentage >= 95) return "bg-cyan-600";
    if (percentage >= 80) return "bg-cyan-500";
    if (percentage >= 60) return "bg-cyan-400";
    if (percentage >= 40) return "bg-cyan-300";
    if (percentage >= 20) return "bg-cyan-200";
    return "bg-cyan-100";
  };

  const getPercentage = (role, month) => {
    const item = data.find((d) => d.role === role && d.month === month);
    return item ? item.percentage : Math.floor(Math.random() * 100);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          JD Generation
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>0%</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-cyan-100"></div>
            <div className="w-3 h-3 bg-cyan-300"></div>
            <div className="w-3 h-3 bg-cyan-500"></div>
            <div className="w-3 h-3 bg-cyan-600"></div>
          </div>
          <span>100%</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-2">
            {/* Role Labels */}
            <div className="flex flex-col gap-2 pt-8">
              {roles.map((role, index) => (
                <div
                  key={index}
                  className="h-12 flex items-center text-xs text-gray-600 pr-4"
                  style={{ minWidth: "150px" }}
                >
                  {role}
                </div>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div>
              {/* Month Labels */}
              <div className="flex gap-2 mb-2">
                {months.map((month, index) => (
                  <div
                    key={index}
                    className="w-12 text-center text-xs text-gray-600 font-medium"
                  >
                    {month}
                  </div>
                ))}
              </div>

              {/* Data Cells */}
              {roles.map((role, roleIndex) => (
                <div key={roleIndex} className="flex gap-2 mb-2">
                  {months.map((month, monthIndex) => {
                    const percentage = getPercentage(role, month);

                    return (
                      <div
                        key={monthIndex}
                        className={`w-12 h-12 ${getColor(
                          percentage
                        )} rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity relative group`}
                      >
                        <span className="text-xs font-semibold text-white opacity-0 group-hover:opacity-100">
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
