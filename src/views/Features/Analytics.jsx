import React from 'react';
import { LineChart, ShieldCheck, BarChart2, Layout } from 'lucide-react';
import AdvancedAnalyticsImage from '../../assets/AdvancedAnalytics.png';

const analyticFeatures = [
  {
    icon: <LineChart className="w-5 h-5 text-white" />,
    title: "Pipeline Analytics",
    desc: "Track candidates through every stage with conversion rates and time metrics.",
    gradient: "from-[#6366F1] to-[#2DD4BF]"
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-white" />,
    title: "Diversity Reporting",
    desc: "Monitor diversity metrics and ensure inclusive hiring practices.",
    gradient: "from-[#4F46E5] to-[#06B6D4]"
  },
  {
    icon: <BarChart2 className="w-5 h-5 text-white" />,
    title: "Predictive Insights",
    desc: "AI predicts hiring outcomes and recommends process improvements.",
    gradient: "from-[#6366F1] to-[#2DD4BF]"
  },
  {
    icon: <Layout className="w-5 h-5 text-white" />,
    title: "Real-time Dashboards",
    desc: "Live dashboards with customizable widgets and automated reports.",
    gradient: "from-[#4F46E5] to-[#06B6D4]"
  }
];

export default function Analytics() {
  return (
    <section id="analytics" className="py-16 md:py-20 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-16">
          
          <div className="flex-1 relative group w-full">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-100 to-purple-50 rounded-3xl blur-2xl opacity-50 transition-opacity group-hover:opacity-80" />
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 shadow-2xl bg-white">
              <img 
                src={AdvancedAnalyticsImage} 
                alt="Advanced Analytics Dashboard"
                loading="lazy" 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-2.5 md:px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-bold text-slate-900 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 
                AI-Powered • Real-time • Scalable
              </div>
            </div>
          </div>

        
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> Feature
            </div>
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#1E1B4B] mb-2">
              Advanced Analytics
            </h2>
            <p className="text-indigo-600 text-base md:text-lg font-medium mb-4 md:mb-6">
              Data-driven hiring decisions
            </p>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 md:mb-10">
              Get comprehensive insights into your hiring pipeline. Track metrics, identify bottlenecks, and optimize your recruitment process with real-time analytics.
            </p>

           
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              {analyticFeatures.map((feature, index) => (
                <div key={index} className="flex gap-3 md:gap-4 group">
                  <div className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform group-hover:scale-110 ${feature.gradient}`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1E1B4B] mb-1 text-sm md:text-base">{feature.title}</h4>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
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