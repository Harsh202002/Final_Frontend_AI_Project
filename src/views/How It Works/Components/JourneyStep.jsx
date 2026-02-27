import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function JourneyStep({ step, isLast }) {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${step.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16 xl:gap-24`}>
          
          {/* Text Side */}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <span className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-100">
                {step.n}
              </span>
              <div className="p-2 md:p-3 bg-indigo-50 rounded-xl text-indigo-600">
                {step.icon}
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              {step.title}
            </h3>
            <p className="text-indigo-600 font-bold text-xs md:text-sm uppercase tracking-wider mb-4 md:mb-6">
              {step.subtitle}
            </p>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
              {step.desc}
            </p>
            
            <ul className="grid gap-3 md:gap-4">
              {step.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium text-sm md:text-base">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 relative group w-full max-w-[550px]">
            <div className="absolute -inset-4 bg-indigo-100/50 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative rounded-2xl md:rounded-[32px] overflow-hidden border border-slate-100 shadow-2xl bg-white p-2">
              <img 
                src={step.image} 
                alt={step.title}
                loading="lazy" 
                className="w-full rounded-xl md:rounded-[24px] object-cover" 
              />
              {/* Floating Step Badge */}
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/20 flex items-center gap-3 md:gap-4 shadow-lg">
                <div className="p-1.5 md:p-2 bg-indigo-600 rounded-lg text-white">
                  {step.icon}
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase font-bold text-slate-400">
                    Step {step.n}
                  </p>
                  <p className="text-xs md:text-sm font-bold text-slate-900">
                    {step.title}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {!isLast && (
        <div className="hidden lg:flex justify-center mt-16 md:mt-20">
          <div className="h-20 w-px border-l-2 border-dashed border-slate-200" />
        </div>
      )}
    </>
  );
}
