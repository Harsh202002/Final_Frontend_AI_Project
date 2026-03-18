import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative bg-[#1A1140] text-white py-16 md:py-20 lg:py-24 px-4 text-center overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_70%)]"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* <span className="px-3 md:px-4 py-1 rounded-full bg-white/10 text-xs font-medium border border-white/20 inline-flex items-center gap-2 mb-4 md:mb-6">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> Get in Touch
        </span> */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
          Let's Start{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Transforming
          </span>{' '}
          Your Hiring
        </h1>
        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto px-4">
          Book a personalized demo or reach out to our team. We're here to help you find the perfect solution for your recruitment needs.
        </p>
      </div>
    </section>
  );
}
