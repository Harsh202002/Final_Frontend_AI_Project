import React from 'react';

/**
 * Data for the IT Sub-sectors based on the Figma design.
 */
const sectors = [
  "Software Development",
  "DevOps & Cloud",
  "Data Science & AI",
  "Cybersecurity",
  "Product Management",
  "IT Support"
];

export default function Subsectors() {
  return (
    <section className="py-10 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8FAFC] rounded-2xl md:rounded-3xl lg:rounded-[32px] p-6 md:p-10 lg:p-12 border border-slate-50 shadow-sm">
          
         
          <div className="text-center mb-6 md:mb-8 lg:mb-10">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#1E1B4B] tracking-tight">
              Sub-sectors We Serve
            </h3>
          </div>

        
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4">
            {sectors.map((sector, index) => (
              <div 
                key={index} 
                className="bg-white px-4 md:px-6 py-2 md:py-2.5 rounded-full border border-slate-200 shadow-sm 
                           transition-all duration-300 hover:border-indigo-300 hover:shadow-md 
                           cursor-default group"
              >
                <span className="text-xs md:text-sm lg:text-base font-medium text-slate-700 group-hover:text-indigo-600">
                  {sector}
                </span>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}