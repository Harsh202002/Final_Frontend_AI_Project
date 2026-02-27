import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative bg-[#1A1140] text-white py-16 md:py-20 lg:py-24 px-4 text-center">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_70%)]"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex justify-center mb-4 md:mb-6">
          <span className="px-3 md:px-4 py-1 rounded-full bg-white/10 text-xs font-medium border border-white/20 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span> Our Story
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
          Transforming How the World <br className="hidden sm:block" /> 
          <span className="text-blue-400">Hires Talent</span>
        </h1>
        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto px-4">
          We're a team of AI researchers, HR veterans, and engineers on a mission to make hiring faster, fairer, and more effective for everyone.
        </p>
      </div>
    </section>
  );
}
