import React from 'react';
import { Award, TrendingUp, ShieldCheck, Users } from 'lucide-react';

const features = [
  { 
    title: "Industry-Leading AI", 
    desc: "Our proprietary AI models are trained on millions of successful hires, delivering unmatched accuracy.", 
    icon: <Award className="w-6 h-6 md:w-7 md:h-7" />,
    gradient: "from-[#6366f1] to-[#2dd4bf]" // Purple to Teal gradient
  },
  { 
    title: "Proven Results", 
    desc: "Customers see an average 70% reduction in time-to-hire and 3x improvement in candidate quality.", 
    icon: <TrendingUp className="w-6 h-6 md:w-7 md:h-7" />,
    gradient: "from-[#4f46e5] to-[#0891b2]" // Deep Blue to Cyan
  },
  { 
    title: "Enterprise Security", 
    desc: "SOC 2 Type II certified, GDPR compliant, and built with privacy-by-design principles.", 
    icon: <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" />,
    gradient: "from-[#4338ca] to-[#0d9488]" // Indigo to Teal
  },
  { 
    title: "Dedicated Support", 
    desc: "Every customer gets a dedicated success manager and 24/7 technical support.", 
    icon: <Users className="w-6 h-6 md:w-7 md:h-7" />,
    gradient: "from-[#4f46e5] to-[#0ea5e9]" // Blue to Sky Blue
  },
];

export default function WhyChooseSection() {
  return (
    <section className="py-20 md:py-28 bg-white" aria-labelledby="features-title">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h2 id="features-title" className="text-3xl md:text-4xl font-extrabold text-[#1e1b4b] tracking-tight mb-4">
            Why Choose RecruiterAI?
          </h2>
          <p className="text-gray-500 text-base md:text-lg font-medium">
            Here's what sets us apart from other recruitment solutions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              
              <div className={`
                w-16 h-16 md:w-20 md:h-20 
                bg-gradient-to-br ${f.gradient} 
                rounded-[22%] flex items-center justify-center 
                text-white mb-6 md:mb-8
                shadow-lg shadow-indigo-200/50
                transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
              `}>
                {f.icon}
              </div>

              <h3 className="text-lg md:text-xl font-bold text-[#1e1b4b] mb-3">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm md:text-[15px] leading-relaxed max-w-[280px]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}