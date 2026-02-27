import React from 'react';
import ChooseRecruterAI from './ChooseRecruterAI';
import Everything from './Everything';
import PowerfulInsights from './PowerfulInsights';
import Transform from './Transform';
import WatchAI from './WatchAI';
import HomeBanner from './HomeBanner';

// Dynamic Data Objects
const statistics = [
  { label: "Reduction in Time-to-Hire", value: "85%" },
  { label: "More Qualified Candidates", value: "3x" },
  { label: "Cost Savings", value: "60%" },
  { label: "Companies Trust Us", value: "500+" },
];

const features = [
  {
    title: "AI JD Generation",
    desc: "Generate compelling, bias-free job descriptions in seconds with our advanced AI engine.",
    icon: "📄", // Replace with Lucide-react icons if available
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Smart Screening",
    desc: "Automatically screen and rank candidates based on skills, experience, and cultural fit.",
    icon: "👥",
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    title: "AI Interviews",
    desc: "Conduct intelligent preliminary interviews with natural language processing.",
    icon: "💬",
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Advanced Analytics",
    desc: "Get deep insights into your hiring pipeline with real-time analytics and reporting.",
    icon: "📊",
    color: "bg-cyan-50 text-cyan-600"
  }
];

const workflowSteps = [
  { id: 1, title: "Create JD", desc: "AI generates optimized job descriptions", metric: "2 min avg", icon: "📄" },
  { id: 2, title: "Screen", desc: "Smart filtering and ranking of candidates", metric: "95% accuracy", icon: "🎯" },
  { id: 3, title: "Interview", desc: "AI conducts initial candidate assessments", metric: "24/7 available", icon: "💬" },
  { id: 4, title: "Hire", desc: "Make data-driven hiring decisions", metric: "3x faster", icon: "🏆" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <HomeBanner />
      
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
            {statistics.map((stat, i) => (
              <div key={i} className="text-center transform hover:scale-105 transition-transform duration-200">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-700 md:text-5xl">{stat.value}</div>
                <div className="mt-2 text-xs sm:text-sm text-slate-500 md:text-base px-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Insights/Dashboard Section */}
      <PowerfulInsights />

      {/* 3. "Everything You Need" Feature Cards */}
      <Everything />

      {/* 4. Transform Workflow Section (Dark Section) */}
      <WatchAI/>

      {/* 5. Bottom Section: Side-by-Side Content */}
      <ChooseRecruterAI />

      {/* 6. Transform Section (Placeholder for Figma Design) */}
      <Transform />
    </div>
  );
}