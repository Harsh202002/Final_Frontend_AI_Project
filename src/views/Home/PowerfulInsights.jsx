import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Label
} from 'recharts';
import { 
  FileText, Users, MessageSquare, BarChart3, 
  Target, Zap, Clock, ShieldCheck, Briefcase 
} from 'lucide-react';



const statistics = [
  { label: "Reduction in Time-to-Hire", value: "85%" },
  { label: "More Qualified Candidates", value: "3x" },
  { label: "Cost Savings", value: "60%" },
  { label: "Companies Trust Us", value: "500+" },
];

const timeToHireData = [
  { month: 'Jan', traditional: 45, ai: 12 },
  { month: 'Feb', traditional: 42, ai: 10 },
  { month: 'Mar', traditional: 48, ai: 11 },
  { month: 'Apr', traditional: 44, ai: 9 },
  { month: 'May', traditional: 46, ai: 8 },
  { month: 'Jun', traditional: 43, ai: 7 },
];

const qualityScoreData = [
  { week: 'Week 1', score: 72 },
  { week: 'Week 2', score: 82 },
  { week: 'Week 3', score: 88 },
  { week: 'Week 4', score: 91 },
  { week: 'Week 5', score: 93 },
  { week: 'Week 6', score: 95 },
];

const sourceData = [
  { name: 'LinkedIn', value: 35, color: '#6366f1' },
  { name: 'Indeed', value: 25, color: '#10b981' },
  { name: 'Referrals', value: 20, color: '#a855f7' },
  { name: 'Direct', value: 15, color: '#0ea5e9' },
  { name: 'Other', value: 5, color: '#cbd5e1' },
];

const pipelineData = [
  { stage: 'Applied', count: 1200, fill: 'url(#grad1)' },
  { stage: 'Screened', count: 600, fill: 'url(#grad2)' },
  { stage: 'Interview', count: 200, fill: 'url(#grad3)' },
  { stage: 'Final', count: 80, fill: 'url(#grad4)' },
  { stage: 'Hired', count: 40, fill: 'url(#grad5)' },
];

const features = [
  { title: "AI JD Generation", desc: "Generate compelling, bias-free job descriptions in seconds.", icon: <FileText className="w-6 h-6" />, color: "text-blue-600", bg: "bg-blue-50" },
  { title: "Smart Screening", desc: "Automatically screen and rank candidates based on skills.", icon: <Users className="w-6 h-6" />, color: "text-indigo-600", bg: "bg-indigo-50" },
  { title: "AI Interviews", desc: "Conduct intelligent preliminary interviews with NLP.", icon: <MessageSquare className="w-6 h-6" />, color: "text-purple-600", bg: "bg-purple-50" },
  { title: "Advanced Analytics", desc: "Get deep insights into your pipeline with real-time reporting.", icon: <BarChart3 className="w-6 h-6" />, color: "text-cyan-600", bg: "bg-cyan-50" }
];

export default function PowerfulInsights() {
  return (
    <div className="">

      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold text-indigo-600 mb-4 border border-indigo-100">
              <Zap size={14} /> Real-Time Analytics
            </span>
            <h2 className="text-3xl font-bold md:text-5xl text-slate-900 mb-4">Powerful Insights at Your Fingertips</h2>
            <p className="text-slate-500 text-xl max-w-3xl mx-auto">Track every metric that matters with our comprehensive analytics dashboard.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            
          
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-bold text-xl text-slate-800">Time to Hire (Days)</h4>
                  <p className="text-sm text-slate-400">Traditional vs AI-Powered</p>
                </div>
                <div className="flex gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200" /> Traditional</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600" /> With AI</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeToHireData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={{ stroke: '#000', strokeWidth: 2 }} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#94a3b8' }} 
                    />
                    <YAxis 
                      axisLine={{ stroke: '#000', strokeWidth: 2 }} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#94a3b8' }} 
                    />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="traditional" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={36} />
                    <Bar dataKey="ai" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Quality Score */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-bold text-xl text-slate-800">Candidate Quality Score</h4>
                  <p className="text-sm text-slate-400">AI-optimized matching over time</p>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-lg">+22% improvement</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={qualityScoreData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="week" 
                      axisLine={{ stroke: '#000', strokeWidth: 2 }} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#94a3b8' }} 
                    />
                    <YAxis 
                      axisLine={{ stroke: '#000', strokeWidth: 2 }} 
                      tickLine={false} 
                      domain={[60, 100]} 
                      tick={{ fontSize: 12, fill: '#94a3b8' }} 
                    />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center">
              <div className="flex-1 w-full">
                <h4 className="font-bold text-xl text-slate-800">Candidate Sources</h4>
                <p className="text-sm text-slate-400 mb-4">Where your best hires come from</p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sourceData} innerRadius={60} outerRadius={95} paddingAngle={5} dataKey="value">
                        {sourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex-1 space-y-2 w-full md:pl-8">
                {sourceData.map((s, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} /> {s.name}</span>
                    <span className="font-bold text-base">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-xl text-slate-800">Hiring Pipeline</h4>
              <p className="text-sm text-slate-400 mb-6">Real-time funnel visualization</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={pipelineData} margin={{ left: 30, right: 30 }}>
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient>
                      <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#34d399"/></linearGradient>
                    </defs>
                    <XAxis 
                      type="number" 
                      axisLine={{ stroke: '#000', strokeWidth: 2 }} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#94a3b8' }} 
                    />
                    <YAxis 
                      dataKey="stage" 
                      type="category" 
                      axisLine={{ stroke: '#000', strokeWidth: 2 }} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </section>


    </div>
  );
}