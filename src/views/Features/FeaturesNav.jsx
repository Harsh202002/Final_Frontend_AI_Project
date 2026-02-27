import React, { useState, useEffect } from 'react';
import { FileText, Users, MessageSquare, BarChart3 } from 'lucide-react';

/**
 * Navigation items matching the Figma Features sub-nav
 */
const navItems = [
  { id: 'ai-jd', label: 'AI JD Generation', icon: <FileText size={18} /> },
  { id: 'smart-screening', label: 'Smart Candidate Screening', icon: <Users size={18} /> },
  { id: 'ai-interviews', label: 'AI-Powered Interviews', icon: <MessageSquare size={18} /> },
  { id: 'analytics', label: 'Advanced Analytics', icon: <BarChart3 size={18} /> },
];

export default function FeaturesNav() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    // Intersection Observer to detect which section is in view
    const isMobile = window.innerWidth < 768;
    const observerOptions = {
      root: null,
      rootMargin: isMobile ? '-112px 0px -70% 0px' : '-140px 0px -70% 0px', // Responsive margin
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each section by ID
    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
     
      const isMobile = window.innerWidth < 768;
      const yOffset = isMobile ? -112 : -140; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-[56px] md:top-[72px] z-40 w-full bg-white border-b border-slate-100 shadow-sm overflow-x-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-w-max h-16 gap-10 md:gap-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex items-center gap-2.5 transition-all duration-300 py-2 relative group ${
                activeSection === item.id ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              {/* Icon component */}
              <span className={`${activeSection === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors`}>
                {item.icon}
              </span>
              
              {/* Label */}
              <span className="text-[14px] md:text-[15px] font-medium whitespace-nowrap">
                {item.label}
              </span>
              
              {/* Active Underline Indicator */}
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transition-transform duration-300 origin-left ${
                activeSection === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}