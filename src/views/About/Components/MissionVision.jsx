import React from 'react';
import { Target, Eye } from 'lucide-react';

export default function MissionVision() {
  return (
    <section className="py-16 md:py-20 lg:py-24 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6 md:gap-8">
      <div className="p-8 md:p-10 rounded-2xl bg-[#F8FAFF] border border-blue-50">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-4 md:mb-6 shadow-lg shadow-blue-200">
          <Target size={24} />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-[#1A1140] mb-3 md:mb-4">Our Mission</h3>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          To democratize access to great talent and great opportunities. We believe every company deserves efficient hiring, and every candidate deserves a fair shot—regardless of their background or where they went to school.
        </p>
      </div>
      <div className="p-8 md:p-10 rounded-2xl bg-[#F8FAFF] border border-blue-50">
        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white mb-4 md:mb-6 shadow-lg shadow-blue-200">
          <Eye size={24} />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-[#1A1140] mb-3 md:mb-4">Our Vision</h3>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          A world where the right person finds the right job every time. Where hiring decisions are based on potential and fit, not bias and guesswork. Where recruitment is a delightful experience for everyone involved.
        </p>
      </div>
    </section>
  );
}
