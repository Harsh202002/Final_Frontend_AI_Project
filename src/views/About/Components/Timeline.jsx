import React from 'react';

const timeline = [
  { year: "2020", title: "The Spark", desc: "Our founders, frustrated by inefficient hiring processes, envisioned an AI that could transform recruitment." },
  { year: "2021", title: "Building the Foundation", desc: "Assembled a world-class team of AI researchers, HR experts, and engineers. Developed our core AI engine." },
  { year: "2022", title: "First Launch", desc: "Launched RecruiterAI with 50 beta customers. Processed over 100,000 candidates in the first year." },
  { year: "2023", title: "Rapid Growth", desc: "Expanded to 500+ customers across 30 countries. Added AI interviews and advanced analytics." },
  { year: "2024", title: "Industry Leader", desc: "Recognized as a top AI recruitment platform. Serving Fortune 500 companies and fast-growing startups alike." },
];

export default function Timeline() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-4xl font-bold text-[#1A1140] mb-2">Our Journey</h2>
          <p className="text-gray-500 text-xl">
            From a simple idea to an industry-leading platform, here's how RecruiterAI came to be.
          </p>
        </div>
        
        <div className="relative">
          
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-0.5 bg-blue-200"></div>

          {timeline.map((item, i) => (
            <div key={i} className={`mb-12 md:mb-16 last:mb-0 relative flex flex-col ${i % 2 === 0 ? 'md:items-start' : 'md:items-end'} w-full`}>
              <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 lg:pr-16' : 'md:pl-12 lg:pl-16'} pl-10 md:pl-12`}>
                <div className="relative">
                  <span className="text-blue-600 font-bold text-xl md:text- mb-1 block">{item.year}</span>
                  <h4 className="font-bold text-[#1A1140] text-base md:text-2xl mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-2xl md:text-xl leading-relaxed">{item.desc}</p>
                </div>
              </div>
              {/* Timeline Dot */}
              <div className="absolute left-[10px] md:left-1/2 md:-translate-x-1/2 top-4 w-3.5 h-3.5 rounded-full bg-white border-[3px] border-blue-600 z-10"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
