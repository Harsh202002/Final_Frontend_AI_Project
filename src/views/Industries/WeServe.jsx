import React from 'react';
import { 
  Stethoscope, 
  Building2, 
  Factory, 
  ShoppingBag, 
  GraduationCap, 
  Truck 
} from 'lucide-react';


const industries = [
  { name: "Healthcare", icon: <Stethoscope className="w-6 h-6 text-[#2DD4BF]" /> },
  { name: "Finance & Banking", icon: <Building2 className="w-6 h-6 text-[#2DD4BF]" /> },
  { name: "Manufacturing", icon: <Factory className="w-6 h-6 text-[#2DD4BF]" /> },
  { name: "Retail", icon: <ShoppingBag className="w-6 h-6 text-[#2DD4BF]" /> },
  { name: "Education", icon: <GraduationCap className="w-6 h-6 text-[#2DD4BF]" /> },
  { name: "Logistics", icon: <Truck className="w-6 h-6 text-[#2DD4BF]" /> },
];

export default function WeServe() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#F1F5F9]/50 rounded-2xl md:rounded-3xl lg:rounded-[40px] p-6 md:p-10 lg:p-12 text-center border border-slate-100 shadow-sm">
          
          <h3 className="text-xl md:text-2xl font-bold text-[#1E1B4B] mb-8 md:mb-10 lg:mb-12 tracking-tight">
            Industries We Serve
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {industries.map((industry, index) => (
              <div 
                key={index} 
                className="bg-white p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
              >
               
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3 md:mb-4 transition-colors group-hover:bg-emerald-100">
                  {industry.icon}
                </div>
                
                <h4 className="text-xs md:text-sm font-bold text-[#1E1B4B] text-center leading-tight">
                  {industry.name}
                </h4>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}