import React from 'react';
import { Send } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-gradient-to-br from-[#2a45b0] to-[#26bba7] py-16 md:py-20 lg:py-24 text-white text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
          Ready to Get Started?
        </h2>
        <p className="mb-8 md:mb-10 text-white/80 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Start your 14-day free trial today. No credit card required.
        </p>
        <button className="bg-white text-[#1A1140] px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto text-base md:text-lg">
          Start Free Trial <Send size={18} />
        </button>
      </div>
    </section>
  );
}
