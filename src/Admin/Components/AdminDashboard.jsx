import { useState } from "react";
import StatCard from "./StatCard";
import HeroBanner from "./HeroBanner";
import SystemOverview from "./SystemOverview";
import JDPriority from "./JDPriority";
import CandidatesTable from "./CandidatesTable";
import JDGenerationHeatmap from "./JDGenerationHeatmap";
import MonthlyTrends from "./MonthlyTrends";

function App() {
  // ✅ Static Dashboard Stats
  const stats = [
    {
      metric_name: "total_jobs",
      current_value: 121,
      trend_percentage: 30,
      trend_direction: "up",
    },
    {
      metric_name: "total_applicants",
      current_value: 542,
      trend_percentage: -12,
      trend_direction: "down",
    },
    {
      metric_name: "hired_candidates",
      current_value: 89,
      trend_percentage: 8,
      trend_direction: "up",
    },
    {
      metric_name: "total_hrs",
      current_value: 24,
      trend_percentage: 15,
      trend_direction: "up",
    },
  ];

  // ✅ Static System Overview
  const systemData = [
    { category: "AI Screening", percentage: 40, color: "#8B5CF6" },
    { category: "Manual Review", percentage: 30, color: "#3B82F6" },
    { category: "Interview Stage", percentage: 20, color: "#10B981" },
    { category: "Offer Sent", percentage: 10, color: "#F59E0B" },
  ];

  // ✅ Static JD Priorities
  const priorities = [
    { priority_level: "High", count: 12 },
    { priority_level: "Medium", count: 20 },
    { priority_level: "Low", count: 8 },
  ];

  // ✅ Static Candidates
  const candidates = [
    {
      id: "1",
      name: "Rahul Sharma",
      phone_no: "9876543210",
      job_title: "Frontend Developer",
      status: "Shortlisted",
      applied_date: "2026-01-10",
      avatar_color: "#8B5CF6",
    },
    {
      id: "2",
      name: "Priya Singh",
      phone_no: "9123456780",
      job_title: "Backend Developer",
      status: "Interview",
      applied_date: "2026-01-12",
      avatar_color: "#3B82F6",
    },
    {
      id: "3",
      name: "Amit Kumar",
      phone_no: "9988776655",
      job_title: "UI/UX Designer",
      status: "Hired",
      applied_date: "2026-01-15",
      avatar_color: "#10B981",
    },
  ];

  // ✅ Static Heatmap Data
  const heatmapData = [
    { role: "Frontend", month: "Jan", percentage: 70 },
    { role: "Backend", month: "Jan", percentage: 60 },
    { role: "HR", month: "Jan", percentage: 50 },
    { role: "Frontend", month: "Feb", percentage: 80 },
    { role: "Backend", month: "Feb", percentage: 65 },
    { role: "HR", month: "Feb", percentage: 55 },
  ];

  // ✅ Static Monthly Trends
  const trendsData = [
    { month: "Jan", candidates: 50, job_descriptions: 20, offers: 10 },
    { month: "Feb", candidates: 70, job_descriptions: 25, offers: 15 },
    { month: "Mar", candidates: 65, job_descriptions: 30, offers: 12 },
    { month: "Apr", candidates: 80, job_descriptions: 40, offers: 20 },
  ];


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: 2x2 stat cards taking 50% width */}
          <div className="lg:col-span-1 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Candidates</p>
                  <h3 className="text-2xl font-bold text-gray-900">124</h3>
                </div>
                <div className="text-green-600 text-xs font-medium">↗ +12%</div>
              </div>
              <div className="h-8 flex items-end gap-0.5">
                {[40, 50, 35, 60, 45, 70].map((height, i) => (
                  <div key={i} className="flex-1 bg-green-100 rounded-t" style={{ height: height + "%" }} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Active JDs</p>
                  <h3 className="text-2xl font-bold text-gray-900">48</h3>
                </div>
                <div className="text-red-600 text-xs font-medium">↘ 5%</div>
              </div>
              <div className="h-8 flex items-end gap-0.5">
                {[70, 60, 65, 55, 50, 45].map((height, i) => (
                  <div key={i} className="flex-1 bg-red-100 rounded-t" style={{ height: height + "%" }} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Offers Released</p>
                  <h3 className="text-2xl font-bold text-gray-900">32</h3>
                </div>
                <div className="text-green-600 text-xs font-medium">↗ +18%</div>
              </div>
              <div className="h-8 flex items-end gap-0.5">
                {[30, 45, 50, 60, 55, 70].map((height, i) => (
                  <div key={i} className="flex-1 bg-green-100 rounded-t" style={{ height: height + "%" }} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Candidates</p>
                  <h3 className="text-2xl font-bold text-gray-900">124</h3>
                </div>
                <div className="text-green-600 text-xs font-medium">↗ +12%</div>
              </div>
              <div className="h-8 flex items-end gap-0.5">
                {[40, 50, 35, 60, 45, 70].map((height, i) => (
                  <div key={i} className="flex-1 bg-green-100 rounded-t" style={{ height: height + "%" }} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Hero banner occupying remaining 50% */}
          <div className="lg:col-span-1">
            <HeroBanner />
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 gap-0 lg:flex lg:gap-0">
          <div className="lg:w-[38%]">
            <SystemOverview data={systemData} />
          </div>
          <div className="lg:w-[60%]">
            <JDPriority data={priorities} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6 lg:flex lg:gap-6 lg:items-stretch">
          <div className="lg:w-[60%]">
            <CandidatesTable candidates={candidates} />
          </div>
          <div className="lg:w-[40%]">
            <JDGenerationHeatmap data={heatmapData} />
          </div>
        </div>

        <MonthlyTrends data={trendsData} />
      </div>
    </div>
  );
}

export default App;
