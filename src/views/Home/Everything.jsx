import React from 'react';
import { FileText, Users, MessageSquare, BarChart3 } from 'lucide-react';

const features = [
  {
    title: "AI JD Generation",
    desc: "Generate compelling, bias-free job descriptions in seconds with our advanced AI engine.",
    icon: <FileText className="w-6 h-6 text-white" />,
    gradient: "from-[#6366F1] to-[#2DD4BF]", // Teal-Blue gradient from Figma
  },
  {
    title: "Smart Screening",
    desc: "Automatically screen and rank candidates based on skills, experience, and cultural fit.",
    icon: <Users className="w-6 h-6 text-white" />,
    gradient: "from-[#4F46E5] to-[#06B6D4]", // Indigo-Cyan gradient
  },
  {
    title: "AI Interviews",
    desc: "Conduct intelligent preliminary interviews with natural language processing.",
    icon: <MessageSquare className="w-6 h-6 text-white" />,
    gradient: "from-[#6366F1] to-[#2DD4BF]", // Matching teal-blue
  },
  {
    title: "Advanced Analytics",
    desc: "Get deep insights into your hiring pipeline with real-time analytics and reporting.",
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    gradient: "from-[#4F46E5] to-[#06B6D4]", // Matching indigo-cyan
  }
];

export default function Everything() {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Header Section */}
        <h2 className="text-3xl font-bold tracking-tight text-[#1E1B4B] md:text-5xl">
          Everything You Need to Hire Better
        </h2>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Our comprehensive AI-powered platform handles every step of the recruitment process.
        </p>

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="group relative rounded-3xl border border-slate-100 bg-white p-10 text-left shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)]"
            >
             
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg ${feature.gradient}`}>
                {feature.icon}
              </div>

              <h3 className="mt-8 text-2xl font-bold text-[#1E1B4B]">
                {feature.title}
              </h3>
              <p className="mt-4 text-slate-500 text-base leading-relaxed">
                {feature.desc}
              </p>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500 group-hover:w-full rounded-b-3xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}