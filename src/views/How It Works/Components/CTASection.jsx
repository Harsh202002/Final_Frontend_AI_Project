import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-[#1E1B4B] py-16 md:py-20 lg:py-24 text-white text-center px-4">
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tight">
        Ready to Get Started?
      </h2>
      <p className="text-slate-400 text-base md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto px-4">
        Join hundreds of companies already using RecruterAI. Setup takes just 5 minutes.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
        <button className="bg-white text-[#1E1B4B] px-8 md:px-10 py-3 md:py-4 rounded-full font-extrabold hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
          Start Free Trial <CheckCircle2 size={18} />
        </button>
        <button className="bg-white/10 border border-white/20 text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-extrabold hover:bg-white/20 transition-all">
          Schedule a Demo
        </button>
      </div>
    </section>
  );
}
