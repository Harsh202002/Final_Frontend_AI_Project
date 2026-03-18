import React from 'react';
import { 
  Cpu, UserPlus, Search, 
  Zap, Clock, ShieldCheck, Globe, 
  Database, Star, Users, Sparkles,
  TrendingUp, BarChart3, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

 import Built from './Built';
 import AIPowered from './AIPowered';
 import Agency from './Agency';
 import Hire from '../../assets/Hire.png';
import Aipowered from '../../assets/Aipowered.png';
import WeServe from './WeServe';
import Subsectors from './Subsectors';
import Nonit from './Nonit';
import IndustriesNav from './IndustriesNav';
import Scale from './Scale';

const industryData = {
  tech: {
    tag: "IT & Technology",
    title: "Hire Top Tech Talent Faster",
    desc: "In the competitive tech landscape, finding skilled developers and IT professionals is challenging. RecruterAI uses specialized technical assessments to identify candidates who truly have the skills you need.",
    stats: [
      { label: "Faster technical screening", value: "70%" },
      { label: "More qualified developers", value: "3x" },
      { label: "Offer acceptance rate", value: "85%" }
    ],
    features: [
      { t: "Technical Skill Assessment", d: "AI evaluates coding skills and technical problem-solving.", icon: <Cpu size={20} /> },
      { t: "Stack Matching", d: "Match candidates to your specific tech stack—React, Python, or AWS.", icon: <Database size={20} /> },
      { t: "Remote Hiring", d: "Hire global talent with timezone-aware interviews.", icon: <Globe size={20} /> },
      { t: "Startup to Enterprise", d: "Scalable solutions for teams of all sizes.", icon: <ShieldCheck size={20} /> }
    ],
    subSectors: ["Software Development", "DevOps & Cloud", "Data Science & AI", "Cybersecurity", "Product Management", "IT Support"]
  },
  nonTech: {
    tag: "Non-IT Industries",
    title: "AI-Powered Hiring for Every Sector",
    desc: "From healthcare to retail, RecruterAI adapts to the unique hiring needs of every industry, understanding sector-specific requirements and compliance needs.",
    stats: [
      { label: "Reduction in time-to-fill", value: "50%" },
      { label: "Lower cost per hire", value: "40%" },
      { label: "Compliance adherence", value: "90%" }
    ],
    features: [
      { t: "Certification Verification", d: "Automatically verify professional credentials.", icon: <ShieldCheck size={20} /> },
      { t: "Volume Hiring", d: "Handle high-volume recruitment for retail and hospitality.", icon: <UserPlus size={20} /> },
      { t: "Compliance Screening", d: "Built-in checks for regulated sectors.", icon: <ShieldCheck size={20} /> },
      { t: "Soft Skills Assessment", d: "Evaluate communication and leadership critical for non-tech roles.", icon: <Users size={20} /> }
    ],
    sectors: [
      { n: "Healthcare", i: "🏥" }, { n: "Finance", i: "🏦" }, { n: "Manufacturing", i: "🏭" },
      { n: "Retail", i: "🛍️" }, { n: "Education", i: "🎓" }, { n: "Logistics", i: "🚚" }
    ]
  }
};

const testimonials = [
  { name: "Sarah Chen", role: "VP Engineering", text: "RecruterAI cut our engineering hiring time in half. We're now competing for top talent." },
  { name: "Michael Roberts", role: "HR Director", text: "Managing compliance across our facilities was a nightmare. RecruterAI automated it." },
  { name: "Jennifer Walsh", role: "Founder, Elite Recruiters", text: "Our agency now processes 5x more candidates. ROI was positive in the first month." }
];

export default function Industries() {

  const navigate = useNavigate();
  return (
    <main className="">
      {/* 1. Header Section */}
      <header className="relative py-20 bg-[#0B0F19] text-white text-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} fill="currentColor" /> Solutions for Every Industry
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Tailored <span className="text-indigo-400">AI Recruitment</span> for Your Industry
          </h1>
          <p className="text-slate-400 mx-auto max-w-3xl text-lg md:text-xl leading-relaxed">
           Whether you're in tech, healthcare, retail, or running a recruitment agency—RecruterAI adapts to your unique hiring challenges and industry requirements.
          </p>
        </div>
      </header>

      <IndustriesNav/>

      {/* 2. Tech Industry Section */}
      <section id="it-tech" className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16 mb-16 md:mb-20 lg:mb-24">
            <div className="flex-1 text-left">
              <span className="inline-block px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 text-xs font-bold uppercase mb-4">
                {industryData.tech.tag}
              </span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 md:mb-6">{industryData.tech.title}</h2>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 md:mb-10">{industryData.tech.desc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {industryData.tech.stats.map((s, i) => (
                  <div key={i} className="text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600 mb-1 md:mb-2">{s.value}</div>
                    <div className="text-[10px] sm:text-[11px] md:text-[12px] text-slate-600 uppercase font-bold">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative group w-full">
              <img 
                src={Hire} 
                alt="Tech Recruitment Platform Preview" 
                loading="lazy"
                className="w-full rounded-2xl md:rounded-3xl shadow-2xl border border-slate-100 transition-transform duration-500 group-hover:scale-[1.02]" 
              />
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/20 shadow-lg">
                <p className="text-xs md:text-sm font-bold text-slate-900">IT & Technology</p>
                <p className="text-[9px] md:text-[10px] text-slate-500">Specialized AI Solutions</p>
              </div>
            </div>
          </div>

           <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-8 md:mb-10 lg:mb-12 text-center">How RecruterAI Helps IT & Technology</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 lg:mb-20">
            {industryData.tech.features.map((f, i) => (
              <div key={i} className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all text-left">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 md:mb-6">{f.icon}</div>
                <h4 className="font-bold text-slate-900 mb-2 text-sm md:text-base">{f.t}</h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>

          <Subsectors sectors={industryData.tech.subSectors} />

          <AIPowered/>
          
          <Nonit/>

          <WeServe/>

          <Scale/>

          <Agency/>

        </div>
      </section>
     

      <Built/>

      {/* <section className="bg-[#1E1B4B] py-16 md:py-20 lg:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 tracking-tight">Trusted Across Industries</h2>
          <p className="text-slate-400 mb-12 md:mb-16 text-sm md:text-base">Real feedback from industry leaders</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="flex gap-1 mb-4 md:mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="sm:w-4 sm:h-4 fill-emerald-400 text-emerald-400" />)}
                </div>
                <p className="text-sm md:text-base lg:text-lg italic text-slate-200 mb-6 md:mb-8 leading-relaxed">"{t.text}"</p>
                <div>
                  <div className="font-bold text-white text-sm md:text-base">{t.name}</div>
                  <div className="text-xs md:text-sm text-indigo-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-[#2a45b0] to-[#26bba7] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8 lg:mb-12">Ready to Transform Hiring in Your Industry?</h2>
          <h3 className="text-white text-base md:text-lg lg:text-xl mx-auto max-w-2xl mb-8 md:mb-10 leading-relaxed">Get a personalized demo showing how RecruterAI works for your specific industry needs.</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
             className="px-8 md:px-10 py-3 md:py-4 bg-[#6338D9] text-white rounded-full font-bold text-sm md:text-base shadow-xl hover:bg-[#522cb8] hover:scale-105 transition-all"
              onClick={() => navigate('/contact#contact-form')}
             >Start Free Trial</button>
            <button 
              className="px-8 md:px-10 py-3 md:py-4 border-2 border-white text-white rounded-full font-bold text-sm md:text-base hover:bg-white/10 hover:scale-105 transition-all"
              onClick={() => navigate('/contact#contact-form')}
            >
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}