import React from 'react';
import { Clock, Zap, Target, Users } from 'lucide-react';


const stats = [
  { 
    value: "5 min", 
    label: "Average setup time", 
    icon: <Clock size={20} className="text-white" />,
    gradient: "from-[#6366F1] to-[#2DD4BF]"
  },
  { 
    value: "< 1 sec", 
    label: "Resume processing", 
    icon: <Zap size={20} className="text-white" />,
    gradient: "from-[#4F46E5] to-[#06B6D4]" 
  },
  { 
    value: "94%", 
    label: "Match accuracy", 
    icon: <Target size={20} className="text-white" />,
    gradient: "from-[#6366F1] to-[#2DD4BF]"
  },
  { 
    value: "1000+", 
    label: "Daily candidates", 
    icon: <Users size={20} className="text-white" />,
    gradient: "from-[#4F46E5] to-[#06B6D4]"
  }
];

export default function StatsBar() {
  return (
    <div >
     
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8  p-8 md:p-10 shadow-xl border border-slate-100">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            
            <div className={`h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} mb-5 shadow-lg shadow-indigo-100 transition-transform duration-300 group-hover:scale-110`}>
              {stat.icon}
            </div>

            <div className="text-2xl md:text-3xl font-bold text-[#1E1B4B] tracking-tight">
              {stat.value}
            </div>

           
            <div className="text-[11px] md:text-xs text-slate-500 font-bold uppercase mt-1.5 tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}