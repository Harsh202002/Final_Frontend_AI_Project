import React from 'react';
import HeroSection from './Components/HeroSection';
import StatsBar from './Components/StatsBar';
import MissionVision from './Components/MissionVision';
import Timeline from './Components/Timeline';
import ValuesSection from './Components/ValuesSection';
import TeamSection from './Components/TeamSection';
import WhyChooseSection from './Components/WhyChooseSection';
import CTASection from './Components/CTASection';

export default function About() {
  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <HeroSection />
      <StatsBar />
      <MissionVision />
      <Timeline />
      <ValuesSection />
      <TeamSection />
      <WhyChooseSection />
      <CTASection />
    </div>
  );
}
