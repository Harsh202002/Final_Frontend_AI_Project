import React from 'react';
import { Lightbulb, Users, Shield, Zap, Globe } from 'lucide-react';

const values = [
  { 
    title: "Innovation First", 
    desc: "We push the boundaries of what's possible with AI, constantly evolving our technology to stay ahead.", 
    icon: <Lightbulb size={20} /> 
  },
  { 
    title: "Human-Centered", 
    desc: "Technology should enhance human potential, not replace it. We design AI that empowers recruiters and respects candidates.", 
    icon: <Users size={20} /> 
  },
  { 
    title: "Ethical AI", 
    desc: "We're committed to building AI that's fair, unbiased, and transparent. Diversity and inclusion are built into our algorithms.", 
    icon: <Shield size={20} /> 
  },
  { 
    title: "Customer Obsessed", 
    desc: "Every feature we build starts with understanding our customers' challenges and ends with exceeding their expectations.", 
    icon: <Users size={20} /> 
  },
  { 
    title: "Speed & Quality", 
    desc: "We believe you shouldn't have to choose between moving fast and doing things right. We deliver both.", 
    icon: <Zap size={20} /> 
  },
  { 
    title: "Global Mindset", 
    desc: "Talent is everywhere. We build solutions that work across cultures, languages, and borders.", 
    icon: <Globe size={20} /> 
  },
];

export default function ValuesSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#101349] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-4xl font-bold mb-3 md:mb-4">Our Values</h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            These principles guide everything we do—from how we build our product to how we treat our customers.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {values.map((v, i) => (
            <div key={i} className="p-6 md:p-8 rounded-xl bg-white/6 border border-white/10 hover:bg-white/10 transition-all cursor-default group">
              <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                {v.icon}
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{v.title}</h4>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
