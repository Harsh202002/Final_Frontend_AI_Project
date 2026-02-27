import React from 'react';
import { 
  FileText, Users, MessageSquare, BarChart3, 
  Search, ShieldCheck, Globe, Zap, Cpu, Code2, 
  Clock, ClipboardList, Sparkles 
} from 'lucide-react';
import Ai_JD from '../../assets/Ai_Jd.jpg';
import Smart_Screening from '../../assets/Screening.png';


import Analytics from './Analytics';
import Interviews from './interviews';
import FeaturesNav from './FeaturesNav';



/**
 * Dynamic Feature Data
 */
const detailedFeatures = [
  {
    tag: "Feature",
    title: "AI JD Generation",
    subtitle: "Create compelling job descriptions in seconds",
    desc: "Our AI engine analyzes thousands of successful job postings to generate optimized, bias-free job descriptions that attract the right candidates.",
    image: Ai_JD,
    bullets: [
      { icon: <Sparkles className="text-blue-500" />, t: "Smart Content Generation", d: "AI analyzes requirements to create tailored descriptions." },
      { icon: <ShieldCheck className="text-blue-500" />, t: "Bias Detection & Removal", d: "Automatically removes gender and cultural biases." },
      { icon: <Search className="text-blue-500" />, t: "SEO Optimization", d: "Optimized for job board search algorithms." },
      { icon: <Globe className="text-blue-500" />, t: "Multi-language Support", d: "Generate descriptions in 25+ languages." }
    ],
    reverse: false
  },
  {
    tag: "Feature",
    title: "Smart Candidate Screening",
    subtitle: "Find the best candidates automatically",
    desc: "Automatically screen and rank candidates based on skills, experience, cultural fit, and potential. Process hundreds of applications in minutes.",
    image: Smart_Screening,
    bullets: [
      { icon: <Search className="text-indigo-500" />, t: "Resume Parsing", d: "Advanced NLP extracts skills and qualifications." },
      { icon: <Zap className="text-indigo-500" />, t: "Match Scoring", d: "Each candidate receives a score based on 50+ criteria." },
      { icon: <Cpu className="text-indigo-500" />, t: "Custom Filters", d: "Set must-have and nice-to-have requirements." },
      { icon: <Users className="text-indigo-500" />, t: "Potential Detection", d: "Identifies high-potential candidates without traditional credentials." }
    ],
    reverse: true
  }
];

const secondaryFeatures = [
  { title: "ATS Integration", desc: "Seamlessly integrate with 50+ popular ATS platforms including Workday and Greenhouse.", icon: <Globe size={24} /> },
  { title: "Enterprise Security", desc: "SOC 2 Type II certified with end-to-end encryption and GDPR compliance.", icon: <ShieldCheck size={24} /> },
  { title: "API Access", desc: "Full REST API access for custom integrations and workflow automation.", icon: <Code2 size={24} /> },
  { title: "Team Collaboration", desc: "Share candidates, leave feedback, and collaborate with hiring managers in real-time.", icon: <Users size={24} /> },
  { title: "Automated Scheduling", desc: "AI-powered scheduling that finds optimal interview times for all participants.", icon: <Clock size={24} /> },
  { title: "Custom Templates", desc: "Create and save templates for job descriptions, emails, and interview scripts.", icon: <ClipboardList size={24} /> }
];

export default function Features() {
  return (
    <main className="bg-white overflow-x-hidden">
     
      <header className="relative py-16 md:py-20 bg-[#0B0F19] text-white text-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
            <Zap size={14} fill="currentColor" /> Comprehensive AI Recruitment Suite
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
            Powerful Features for <span className="text-indigo-400">Modern Recruiting</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg lg:text-xl leading-relaxed px-4">
            Everything you need to transform your hiring process. From AI-generated job descriptions to intelligent interviews and advanced analytics.
          </p>
        </div>
      </header>

      <FeaturesNav/>

      
      <section className="py-16 md:py-20 lg:py-32 space-y-24 md:space-y-32">
        {detailedFeatures.map((f, i) => (
          <article 
            key={i} 
            id={i === 0 ? 'ai-jd' : 'smart-screening'}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className={`flex flex-col ${f.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 md:gap-16 lg:gap-24`}>
              {/* Text Content */}
              <div className="flex-1 text-left">
                <span className="inline-flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs mb-3 md:mb-4">
                  <span className="h-1 w-1 rounded-full bg-indigo-600" /> {f.tag}
                </span>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-2">{f.title}</h2>
                <p className="text-indigo-600 text-base md:text-lg font-medium mb-4 md:mb-6">{f.subtitle}</p>
                <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 md:mb-10">{f.desc}</p>
                
                <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                  {f.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex gap-3 md:gap-4">
                      <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors">
                        {bullet.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1 text-sm md:text-base">{bullet.t}</h4>
                        <p className="text-xs md:text-sm text-slate-500">{bullet.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image with Decorative Shadow */}
              <div className="flex-1 relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-100 to-purple-50 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 shadow-2xl">
                  <img 
                    src={f.image} 
                    alt={f.title} 
                    loading="lazy"
                    className="w-full object-cover transform transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-2.5 md:px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-bold text-slate-900 border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> AI-Powered • Real-time • Scalable
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <Interviews />
      
      <Analytics />

      {/* 3. "And So Much More" Grid (Dark Theme) */}
      <section className="bg-[#1E1B4B] py-16 md:py-20 lg:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">And So Much More</h2>
          <p className="text-slate-400 mb-12 md:mb-16 max-w-2xl mx-auto text-sm md:text-base px-4">
            Additional features designed to make your recruitment process seamless and efficient.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {secondaryFeatures.map((item, idx) => (
              <div key={idx} className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 text-left transition-all hover:bg-white/10 hover:-translate-y-1">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 md:mb-6">
                  {item.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{item.title}</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="relative py-4 md:py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-[#2a45b0] to-[#26bba7]">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-white/80 text-base md:text-lg mb-8 md:mb-10 px-4">
            Start your free trial today and see how RecruterAI can transform your hiring process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <button 
              type="button"
              className="px-6 md:px-8 py-3 md:py-4 bg-white text-[#1E1B4B] rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              Start Free Trial <Zap size={18} fill="currentColor" />
            </button>
            <button 
              type="button"
              className="px-6 md:px-8 py-3 md:py-4 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-bold hover:bg-white/30 transition-all"
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}