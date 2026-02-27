import React from 'react';
import { ArrowRight, Sparkles,FileText } from 'lucide-react';

export default function Transform() {
  return (
    <section className="relative py-24  overflow-hidden">
     
      <div className="absolute inset-0 bg-[#1E1B4B] bg-gradient-to-br from-[#352bc6] via-[#200a4a] to-[#1e1b54] z-0" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
     
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 transition-all hover:bg-white/10 cursor-default">
          <Sparkles size={16} className="text-[#2DD4BF]" />
          <span className="text-white/80 text-sm font-medium">
            Join 500+ companies already using RecruterAI
          </span>
        </div>

     
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
          Ready to Transform Your Hiring?
        </h2>

      
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-12">
          Start your free trial today and experience the future of AI-powered recruitment.
        </p>

    
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="group flex items-center gap-2 bg-white text-[#1E1B4B] px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-opacity-90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Start Free Trial
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
          
          <button className="px-8 py-4 rounded-full font-bold text-lg text-white border border-white/20 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/40">
            Schedule a Demo
          </button>
        </div>
      </div>
    </section>
  );
}