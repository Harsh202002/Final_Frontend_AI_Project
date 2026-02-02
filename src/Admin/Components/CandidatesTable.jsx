import React from "react";

export default function CandidatesTable() {
  // Static Dummy Data
  const candidates = [
    {
      id: "1",
      name: "Rahul Sharma",
      phone_no: "9876543210",
      job_title: "Frontend Developer",
      status: "Selected",
      applied_date: "2026-01-20",
      avatar_color: "#4F46E5",
    },
    {
      id: "2",
      name: "Priya Verma",
      phone_no: "9123456780",
      job_title: "UI/UX Designer",
      status: "In Review",
      applied_date: "2026-01-18",
      avatar_color: "#059669",
    },
    {
      id: "3",
      name: "Amit Kumar",
      phone_no: "9988776655",
      job_title: "Backend Developer",
      status: "Rejected",
      applied_date: "2026-01-15",
      avatar_color: "#DC2626",
    },
  ];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Selected":
        return "text-green-700 bg-green-500";
      case "In Review":
        return "text-yellow-700 bg-yellow-500";
      case "Rejected":
        return "text-red-700 bg-red-500";
      default:
        return "text-gray-700 bg-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Candidates</h3>
        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Phone No.
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Job Title
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Applied Date
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => {
              const statusStyles = getStatusColor(candidate.status);

              return (
                <tr
                  key={candidate.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        style={{ backgroundColor: candidate.avatar_color }}
                      >
                        {getInitials(candidate.name)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {candidate.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {candidate.phone_no}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {candidate.job_title}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium">
                      <span
                        className={`w-2 h-2 rounded-full ${statusStyles.split(" ")[1]}`}
                      ></span>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(candidate.applied_date)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
