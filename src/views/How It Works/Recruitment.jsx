import React from 'react';
import { FileText, Users, MessageSquare, BarChart3, ArrowRight } from 'lucide-react';

const pipelineStages = [
  {
    title: "Job Description",
    desc: "AI generates optimized JDs",
    icon: <FileText className="w-6 h-6 text-indigo-600" />,
    bg: "bg-indigo-50"
  },
  {
    title: "Candidate Screening",
    desc: "Automated resume analysis",
    icon: <Users className="w-6 h-6 text-purple-600" />,
    bg: "bg-purple-50"
  },
  {
    title: "AI Interviews",
    desc: "24/7 conversational interviews",
    icon: <MessageSquare className="w-6 h-6 text-indigo-600" />,
    bg: "bg-indigo-50"
  },
  {
    title: "Analytics",
    desc: "Deep insights & reporting",
    icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
    bg: "bg-purple-50"
  }
];

export default function Recruitment() {
  return (
    <section className="py-16 md:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Section Header */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E1B4B] mb-3 md:mb-4">
          The Complete Recruitment Pipeline
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto mb-12 md:mb-16 leading-relaxed text-sm md:text-base px-4">
          RecruterAI handles your entire hiring workflow, from job posting to candidate handoff.
        </p>

      
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
          {pipelineStages.map((stage, index) => (
            <React.Fragment key={index}>
              
              <div className="w-full max-w-[240px] group transition-all duration-300 hover:-translate-y-2">
                <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center text-center h-full group-hover:shadow-xl">
                  <div className={`${stage.bg} p-3 md:p-4 rounded-xl md:rounded-2xl mb-4 md:mb-6 transition-transform duration-300 group-hover:scale-110`}>
                    {stage.icon}
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-slate-900 mb-2">
                    {stage.title}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-500 leading-snug">
                    {stage.desc}
                  </p>
                </div>
              </div>

             
              {index < pipelineStages.length - 1 && (
                <div className="hidden md:flex items-center justify-center px-2">
                  <ArrowRight className="text-emerald-500 w-5 h-5 md:w-6 md:h-6" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}