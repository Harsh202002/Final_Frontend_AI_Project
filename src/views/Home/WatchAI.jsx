import React from 'react';
import { FileText, Target, MessageSquare, Briefcase, Zap } from 'lucide-react';

const workflowSteps = [
  { 
    id: 1, 
    title: "Create JD", 
    desc: "AI generates optimized job descriptions", 
    metric: "2 min avg", 
    icon: <FileText size={20} /> 
  },
  { 
    id: 2, 
    title: "Screen", 
    desc: "Smart filtering and ranking of candidates", 
    metric: "95% accuracy", 
    icon: <Target size={20} /> 
  },
  { 
    id: 3, 
    title: "Interview", 
    desc: "AI conducts initial candidate assessments", 
    metric: "24/7 available", 
    icon: <MessageSquare size={20} /> 
  },
  { 
    id: 4, 
    title: "Hire", 
    desc: "Make data-driven hiring decisions", 
    metric: "3x faster", 
    icon: <Briefcase size={20} /> 
  },
];

export default function WatchAI() {
  return (
    <section className="bg-[#0B0F19] py-24 text-white overflow-hidden relative">
      {/* Background Decorative Glow (Figma detail) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-4 text-center relative z-10">
        {/* Section Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-6">
          <Zap size={14} className="text-indigo-400 fill-indigo-400" />
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">AI-Powered Workflow</span>
        </div>

        <h2 className="text-4xl font-bold md:text-6xl tracking-tight">
          Watch AI Transform Your Hiring
        </h2>
        <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto">
          From job posting to offer letter, our AI handles the heavy lifting.
        </p>
        
        <div className="mt-20 grid gap-6 md:grid-cols-4 relative">
          {/* Connector Line (visible on desktop) */}
          <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent z-0" />

          {workflowSteps.map((step, i) => (
            <div 
              key={i} 
              className="group relative z-10 rounded-[24px] bg-[#161B28]/60 p-8 text-left border border-slate-800 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/50 hover:bg-[#161B28]/80 hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.2)]"
            >
              <div className="flex justify-between items-start mb-8">
                
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold shadow-lg shadow-indigo-500/20">
                  {step.id}
                </div>
                <div className="text-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {step.desc}
              </p>

            
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                <Zap size={10} className="fill-emerald-400" />
                {step.metric}
              </div>

           
              <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}