import React from 'react';
import { Building2, CheckCircle2 } from 'lucide-react';
import Aipowered from '../../assets/Aipowered.png';

export default function AIPowered() {
  const stats = [
    { label: "Reduction in time-to-fill", value: "50%" },
    { label: "Lower cost per hire", value: "40%" },
    { label: "Compliance adherence", value: "90%" },
  ];

  return (
    <section id="non-it" className="py-16 md:py-20 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16 xl:gap-24">
          
         
          <div className="flex-1 relative group w-full">
            
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-[32px] md:rounded-[40px] blur-2xl opacity-50 transition-opacity group-hover:opacity-80" />
            
            <div className="relative rounded-2xl md:rounded-[32px] overflow-hidden border border-slate-100 shadow-2xl bg-white p-1 md:p-2">
              <img 
                src={Aipowered} 
                alt="Non-IT Industries Collaboration"
                loading="lazy" 
                className="w-full h-auto rounded-xl md:rounded-[24px] object-cover transform transition-transform duration-700 group-hover:scale-105" 
              />
              
            
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 lg:bottom-8 lg:left-8 lg:right-8 bg-white/90 backdrop-blur-md p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl border border-white/20 shadow-xl">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Building2 size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base lg:text-lg font-bold text-slate-900">Non-IT Industries</h4>
                    <p className="text-xs md:text-sm text-slate-500 font-medium tracking-wide">Specialized AI Solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 text-left">
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-6 md:mb-8">
              <Building2 size={14} className="fill-emerald-600/20" />
              Non-IT Industries
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[#1E1B4B] leading-tight mb-6 md:mb-8 tracking-tight">
              AI-Powered Hiring for Every Sector
            </h2>
            
            <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 md:mb-10 lg:mb-12">
              From healthcare to retail, manufacturing to finance—RecruterAI adapts to the unique hiring needs of every industry. Our AI understands sector-specific requirements, certifications, and compliance needs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 pt-6 md:pt-8 border-t border-slate-100">
              {stats.map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-500 mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}