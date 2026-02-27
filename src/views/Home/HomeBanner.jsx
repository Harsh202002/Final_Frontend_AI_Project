import React from 'react';
import { ArrowRight, Play, Sparkles, Brain, CheckCircle } from 'lucide-react';

export default function HomeBanner() {
  return (
    <section className="relative min-h-[80vh] bg-[rgb(11,15,25)] overflow-hidden flex flex-col justify-center">
      
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
         
          <div className="text-left">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <Sparkles size={16} className="text-cyan-400" />
              <span className="text-white/90 text-sm font-medium">
                Powered by Advanced AI <span className="ml-2 text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full uppercase font-bold">New</span>
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Hire Smarter with <br />
              <span className="bg-gradient-to-r from-[#C04AE8] via-[#6366F1] to-[#2DD4BF] bg-clip-text text-transparent">
                AI-Powered
              </span> <br />
              Recruitment
            </h1>

            <p className="mt-8 text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
              Transform your hiring process with intelligent JD generation, automated screening, AI-driven interviews, and powerful analytics. Find the perfect candidates faster than ever.
            </p>

            
            <div className="mt-12 flex flex-col sm:flex-row gap-5">
              <button className="group flex items-center justify-center gap-2 bg-[#6338D9] text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-[#522cb8] hover:shadow-[0_0_20px_rgba(99,56,217,0.4)]">
                Book a Free Demo
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
              
              <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg text-white border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10">
                <Play size={18} fill="currentColor" />
                Watch How It Works
              </button>
            </div>

            
            <div className="mt-20 grid grid-cols-3 gap-8 pt-10 border-t border-white/5">
              {[
                { label: "Companies", value: "500+" },
                { label: "Candidates", value: "2M+" },
                { label: "Satisfaction", value: "98%" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block">
            
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Brain className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">RecruterAI Assistant</h3>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-400">Active • Processing</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  "Analyzing 2,847 incoming applications...",
                  "156 candidates match primary criteria",
                  "Running skills assessment for top candidates...",
                  "42 candidates scored above 85%"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    {text.includes("...") ? (
                      <div className="w-5 h-5 flex items-center justify-center"><div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                    ) : (
                      <CheckCircle size={18} className="text-emerald-500" />
                    )}
                    {text}
                  </div>
                ))}
              </div>
            </div>

          
            <div className="absolute -top-6 -left-10 rounded-2xl bg-white p-4 shadow-2xl flex items-center gap-3 animate-bounce shadow-indigo-200" style={{ animationDuration: '3s' }}>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><CheckCircle size={20} /></div>
              <div>
                <div className="text-slate-900 font-bold text-sm">Match Found</div>
                <div className="text-slate-400 text-xs">94% fit score</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 rounded-2xl bg-white p-4 shadow-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Brain size={20} /></div>
              <div>
                <div className="text-slate-900 font-bold text-sm">AI Analysis</div>
                <div className="text-slate-400 text-xs">Processing...</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}