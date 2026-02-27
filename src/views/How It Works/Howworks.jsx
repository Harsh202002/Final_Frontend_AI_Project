import React from 'react';
import { Settings, Cpu, BarChart3, Link } from 'lucide-react';
import AdvancedAnalyticsImage from '../../assets/AdvancedAnalytics.png';
import AutomatedProcessing from '../../assets/AutomatedProcessing.png';
import journey from '../../assets/journey.png';
import integration from '../../assets/integration.png';

import Recruitment from './Recruitment';
import HeroSection from './Components/HeroSection';
import StatsBar from './Components/StatsBar';
import JourneyStep from './Components/JourneyStep';
import CTASection from './Components/CTASection';

/**
 * Step data matching the Figma Journey section
 */
const journeySteps = [
  {
    n: "01",
    title: "Setup",
    subtitle: "Quick & Easy Configuration",
    desc: "Get started in minutes with our intuitive onboarding process. Connect your existing ATS, define your hiring requirements, and customize AI parameters to match your company culture.",
    icon: <Settings size={20} className="text-indigo-400" />,
    image: journey,
    bullets: ["Connect your ATS with one-click integrations", "Import existing job descriptions and templates", "Configure AI screening criteria and preferences", "Set up team roles and permissions"],
    reverse: false
  },
  {
    n: "02",
    title: "Automated Processing",
    subtitle: "AI Does the Heavy Lifting",
    desc: "Once configured, RecruterAI automatically processes incoming applications. Our AI screens resumes, matches candidates to requirements, and conducts preliminary interviews—all without human intervention.",
    icon: <Cpu size={20} className="text-indigo-400" />,
    image: AutomatedProcessing,
    bullets: ["AI parses and analyzes every resume automatically", "Smart matching scores candidates against requirements", "Automated preliminary interviews available 24/7", "Real-time candidate engagement and follow-ups"],
    reverse: true
  },
  {
    n: "03",
    title: "Analysis & Insights",
    subtitle: "Data-Driven Decisions",
    desc: "Get comprehensive insights into every candidate and your overall hiring pipeline. Our AI generates detailed reports, highlights top candidates, and identifies potential concerns—helping you make informed decisions.",
    icon: <BarChart3 size={20} className="text-indigo-400" />,
    image: AdvancedAnalyticsImage,
    bullets: ["Detailed candidate scorecards and rankings", "Interview transcripts with key highlights", "Pipeline analytics and bottleneck identification", "Diversity and compliance reporting"],
    reverse: false
  },
  {
    n: "04",
    title: "Integration & Handoff",
    subtitle: "Seamless Workflow",
    desc: "When candidates are ready for human review, RecruterAI seamlessly hands them off to your team. All data syncs with your existing tools, ensuring a smooth transition from AI screening to human interviews.",
    icon: <Link size={20} className="text-indigo-400" />,
    image: integration,
    bullets: ["One-click handoff to hiring managers", "Calendar integration for interview scheduling", "Complete candidate history and AI insights shared", "Feedback loop to continuously improve AI accuracy"],
    reverse: true
  }
];

export default function Howworks() {
  return (
    <div className="bg-white overflow-hidden">
     
      <HeroSection />

      
      <StatsBar />
      
      <Recruitment />

      <section className="py-16 md:py-20 lg:py-24 space-y-24 md:space-y-12 bg-white">
        <div className="text-center mb-12 md:mb-20 px-4">
          <div className="inline-flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs mb-3 md:mb-4">
            Step-by-Step Guide
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900">
            Your Journey with RecruterAI
          </h2>
          <p className="text-slate-500 mt-3 md:mt-4 text-xl md:text-base">
            Follow these four simple steps to revolutionize your hiring process.
          </p>
        </div>

        {journeySteps.map((step, i) => (
          <JourneyStep key={i} step={step} isLast={i === journeySteps.length - 1} />
        ))}
      </section>

      
      <CTASection />
    </div>
  );
}