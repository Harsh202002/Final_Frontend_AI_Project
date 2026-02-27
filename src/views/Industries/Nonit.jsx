import React from 'react';
import { CheckCircle } from 'lucide-react'; // Using lucide-react for the icons

const data = [
  {
    title: "Certification Verification",
    description: "Automatically verify professional certifications, licenses, and credentials required for regulated industries.",
  },
  {
    title: "Volume Hiring",
    description: "Handle high-volume recruitment for retail, hospitality, and seasonal positions efficiently.",
  },
  {
    title: "Compliance Screening",
    description: "Built-in compliance checks for healthcare, finance, and other regulated sectors.",
  },
  {
    title: "Soft Skills Assessment",
    description: "Evaluate communication, leadership, and customer service skills critical for non-technical roles.",
  },
];

export default function Nonit() {
  return (
    <section className="bg-white py-12 md:py-14 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2D1B69] mb-8 md:mb-10 lg:mb-12">
          How RecruiterAI Helps Non-IT Industries
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-6 md:p-8 rounded-xl md:rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col items-start"
            >
             
              <div className="bg-[#E6F7F5] p-2 rounded-lg mb-4 md:mb-6">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-[#14B8A6]" strokeWidth={2.5} />
              </div>

             
              <h3 className="text-lg md:text-xl font-bold text-[#2D1B69] mb-3 md:mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}