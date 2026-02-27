import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  MessageSquare, 
  BarChart3, 
  Users,
  ArrowUpRight 
} from 'lucide-react';

const reasons = [
  {
    t: "10x Faster Hiring",
    d: "Reduce time-to-hire from weeks to days with automated screening and scheduling.",
    icon: <Zap className="w-5 h-5 text-indigo-600" />,
    bg: "bg-indigo-50"
  },
  {
    t: "Better Quality Hires",
    d: "AI-powered matching ensures you find candidates who truly fit your requirements.",
    icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
    bg: "bg-blue-50"
  },
  {
    t: "24/7 Availability",
    d: "Your AI recruiter works around the clock, engaging candidates across time zones.",
    icon: <Clock className="w-5 h-5 text-purple-600" />,
    bg: "bg-purple-50"
  },
  {
    t: "Bias-Free Process",
    d: "Our AI is trained to eliminate unconscious bias, promoting diversity in hiring.",
    icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
    bg: "bg-indigo-50"
  }
];

export default function ChooseRecruterAI() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          
          
          <div className="max-w-xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1E1B4B] sm:text-4xl md:text-5xl">
              Why Companies Choose RecruterAI
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Join hundreds of forward-thinking companies that have transformed their hiring process with our AI-powered recruitment platform.
            </p>
            
            <div className="mt-12 space-y-10">
              {reasons.map((item, i) => (
                <div key={i} className="flex items-start gap-5 group">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.bg} transition-transform group-hover:scale-110 duration-300`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{item.t}</h4>
                    <p className="mt-2 text-slate-500 leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          <div className="relative">
           
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-100 to-purple-50 rounded-3xl blur-2xl opacity-50 -z-10" />
            
            <div className="rounded-[40px] border border-slate-100 bg-white p-6 shadow-2xl md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                   </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Activity
                </div>
              </div>

              <div className="space-y-5">
               
                <div className="rounded-2xl bg-[#F0FDF4] p-5 border border-emerald-100 flex items-center justify-between transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-emerald-600">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Sarah Chen screened</p>
                      <p className="text-xs text-emerald-600 font-semibold">Match score: 94%</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">2s ago</span>
                </div>

               
                <div className="rounded-2xl bg-[#F5F3FF] p-5 border border-purple-100 flex items-center justify-between transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-purple-600">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">AI Interview completed</p>
                      <p className="text-xs text-slate-500">Duration: 25 minutes</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">5m ago</span>
                </div>

                <div className="rounded-2xl bg-[#F0FDFA] p-5 border border-teal-100 flex items-center justify-between transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-teal-600">
                      <BarChart3 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Analytics updated</p>
                      <p className="text-xs text-teal-600 font-semibold">12 new insights</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">12m ago</span>
                </div>
                <div className="rounded-2xl bg-[#F8FAFC] p-5 border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-blue-600">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">47 new applicants</p>
                      <p className="text-xs text-slate-500">Senior Engineer role</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">1h ago</span>
                </div>

                <div className="rounded-3xl bg-gradient-to-r from-[#6366F1] to-[#2DD4BF] p-8 text-white flex justify-between items-center shadow-xl shadow-indigo-200 mt-8">
                  <div>
                    <p className="text-sm opacity-90 font-medium">Time saved this week</p>
                    <p className="text-4xl font-extrabold mt-1 tracking-tight">42 hours</p>
                  </div>
                  <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 transition-transform hover:rotate-12">
                    <TrendingUp size={28} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}