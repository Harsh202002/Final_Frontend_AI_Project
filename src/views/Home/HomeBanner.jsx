import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Brain, CheckCircle } from 'lucide-react';

export default function HomeBanner() {
  const navigate = useNavigate();

  const handleDemoClick = () => {
    navigate('/contact#contact-form');
  };
  
  return (
    <section className="relative min-h-[80vh] bg-[rgb(11,15,25)] overflow-hidden flex flex-col justify-center  md:py-0">
      
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-indigo-500/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-64 md:h-64 bg-cyan-500/10 blur-[80px] md:blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          
          <div className="text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 md:mb-8">
              <Sparkles size={16} className="text-cyan-400" />
              <span className="text-white/90 text-xs md:text-sm font-medium">
                Powered by Advanced AI <span className="ml-2 text-[10px] md:text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full uppercase font-bold">New</span>
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.2] md:leading-[1.1]">
              Hire Smarter with <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-[#C04AE8] via-[#6366F1] to-[#2DD4BF] bg-clip-text text-transparent">
                AI-Powered
              </span> <br className="hidden md:block" />
              Recruitment
            </h1>

            <p className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-slate-400 max-w-xl leading-relaxed">
              Transform your hiring process with intelligent JD generation, automated screening, AI-driven interviews, and powerful analytics. Find the perfect candidates faster than ever.
            </p>

            <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 md:gap-5">
              <button
                className="group flex items-center justify-center gap-2 bg-[#6338D9] text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold text-base md:text-lg transition-all hover:bg-[#522cb8] hover:shadow-[0_0_20px_rgba(99,56,217,0.4)] w-full sm:w-auto"
                onClick={handleDemoClick}
              >
                Book a Free Demo
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                className="flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold text-base md:text-lg text-white border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 w-full sm:w-auto"
                onClick={handleDemoClick}
              >
                <Play size={18} fill="currentColor" />
                Schedule a Demo
              </button>
            </div>

            <div className="mt-12 md:mt-20 grid grid-cols-3 gap-4 md:gap-8 pt-8 md:pt-10 border-t border-white/5">
              {[
                { label: "Companies", value: "500+" },
                { label: "Candidates", value: "2M+" },
                { label: "Satisfaction", value: "98%" }
              ].map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest mt-1 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0 w-full max-w-md mx-auto lg:max-w-none">
            
            <div className="rounded-[24px] md:rounded-[32px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl p-6 md:p-8 shadow-2xl relative z-10">
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                  <Brain className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base md:text-lg">RecruterAI Assistant</h3>
                  <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-400">Active • Processing</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                {[
                  "Analyzing 2,847 incoming applications...",
                  "156 candidates match primary criteria",
                  "Running skills assessment for top candidates...",
                  "42 candidates scored above 85%"
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-300 text-xs md:text-sm">
                    <div className="shrink-0 mt-0.5">
                      {text.includes("...") ? (
                        <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center"><div className="w-3 h-3 md:w-4 md:h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                      ) : (
                        <CheckCircle className="text-emerald-500 w-4 h-4 md:w-[18px] md:h-[18px]" />
                      )}
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

          
            <div className="absolute -top-4 -left-2 md:-top-6 md:-left-10 rounded-xl md:rounded-2xl bg-white p-3 md:p-4 shadow-2xl flex items-center gap-2 md:gap-3 animate-bounce shadow-indigo-200 z-20" style={{ animationDuration: '3s' }}>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"><CheckCircle className="w-4 h-4 md:w-5 md:h-5" /></div>
              <div>
                <div className="text-slate-900 font-bold text-[10px] md:text-sm">Match Found</div>
                <div className="text-slate-400 text-[8px] md:text-xs">94% fit score</div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-6 rounded-xl md:rounded-2xl bg-white p-3 md:p-4 shadow-2xl flex items-center gap-2 md:gap-3 z-20">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0"><Brain className="w-4 h-4 md:w-5 md:h-5" /></div>
              <div>
                <div className="text-slate-900 font-bold text-[10px] md:text-sm">AI Analysis</div>
                <div className="text-slate-400 text-[8px] md:text-xs">Processing...</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}