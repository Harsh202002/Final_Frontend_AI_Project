import React from 'react';
import { Briefcase } from 'lucide-react';
import Agency from '../../assets/Agency.png';


export default function Scale() {
  const stats = [
    { label: "More candidates processed", value: "5x" },
    { label: "Faster placements", value: "60%" },
    { label: "Increase in margins", value: "45%" },
  ];

  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16 xl:gap-24">
          
          <div className="flex-1 text-left order-2 lg:order-1">
          
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6 md:mb-8">
              <Briefcase size={14} className="fill-indigo-600/10" />
              Recruitment Agencies
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E1B4B] leading-tight mb-6 md:mb-8 tracking-tight">
              Scale Your Agency with AI
            </h2>
            
            <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 md:mb-10 lg:mb-12 max-w-xl">
              Multiply your agency's capacity without multiplying headcount. RecruterAI helps recruitment agencies process more candidates, fill positions faster, and deliver better results for clients—all while reducing operational costs.
            </p>

            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 pt-6 md:pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-indigo-600 mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative group w-full order-1 lg:order-2">
           
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-100 to-purple-50 rounded-[32px] md:rounded-[40px] blur-2xl opacity-50 transition-opacity group-hover:opacity-80" />
            
            <div className="relative overflow-hidden rounded-2xl md:rounded-[24px] bg-white p-1 md:p-2 h-100">
              <img 
                src={Agency} 
                alt="Recruitment Team Collaboration" 
                className="w-full h-auto rounded-2xl md:rounded-[24px] object-cover transform transition-transform duration-700 group-hover:scale-105" 
              />
              
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 lg:bottom-8 lg:left-8 lg:right-8 bg-[#1E1B4B]/80 backdrop-blur-md p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl border border-white/20 shadow-xl">
                <p className="text-white font-bold text-base md:text-lg lg:text-xl leading-tight">Recruitment Agencies</p>
                <p className="text-indigo-200 text-[10px] md:text-xs font-medium mt-1 tracking-wide">Specialized AI Solutions</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}