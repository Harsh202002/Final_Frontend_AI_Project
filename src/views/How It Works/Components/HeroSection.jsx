import React from 'react';
import { Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className=" md:py-20 bg-[#0B0F19] text-white text-center">
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', 
          backgroundSize: '30px 30px' 
        }} 
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
          <Play size={14} fill="currentColor" /> Simple 4-Step Process
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
          How <span className="text-indigo-400">RecruterAI</span> Works
        </h1>
        <p className="text-slate-400 text-base md:text-lg lg:text-xl leading-relaxed mb-8 md:mb-10 px-4">
          From setup to hire, our AI-powered platform streamlines every step of your recruitment process. See how easy it is to transform your hiring.
        </p>
        {/* <button className="inline-flex items-center gap-2 bg-[#6338D9] text-white px-6 md:px-8 py-3 rounded-full font-bold hover:bg-[#522cb8] transition-all">
          Watch Demo Video <Play size={16} fill="currentColor" />
        </button> */}
      </div>
    </section>
  );
}
