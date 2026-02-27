import React from 'react';
import { Layers, Globe, ShieldCheck, TrendingUp } from 'lucide-react';

const agencyFeatures = [
  {
    title: "Multi-tenant Architecture",
    desc: "Separate workspaces for each client",
    icon: <Layers className="w-5 h-5 text-indigo-600" />,
    bg: "bg-indigo-100"
  },
  {
    title: "Global Reach",
    desc: "Hire across borders and timezones",
    icon: <Globe className="w-5 h-5 text-indigo-600" />,
    bg: "bg-indigo-100"
  },
  {
    title: "Data Privacy",
    desc: "Enterprise-grade security for client data",
    icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
    bg: "bg-indigo-100"
  },
  {
    title: "Scalable Pricing",
    desc: "Pay as you grow with flexible plans",
    icon: <TrendingUp className="w-5 h-5 text-indigo-600" />,
    bg: "bg-indigo-100"
  }
];

export default function Built() {
  return (
    <section className="py-10 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#F8FAFC] rounded-2xl md:rounded-3xl lg:rounded-[32px] p-6 md:p-10 lg:p-12 border border-slate-50">
          
          <div className="text-center mb-8 md:mb-10 lg:mb-12">
            <h3 className="text-xl md:text-2xl font-bold text-[#1E1B4B] tracking-tight">
              Built for Agencies
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-4 xl:gap-10">
            {agencyFeatures.map((feature, index) => (
              <div key={index} className="flex items-start sm:items-center gap-3 md:gap-4 group">
               
                <div className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl md:rounded-2xl ${feature.bg} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                  {feature.icon}
                </div>

               
                <div className="text-left">
                  <h4 className="text-sm md:text-base font-bold text-[#1E1B4B] leading-tight mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}