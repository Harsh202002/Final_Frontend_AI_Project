import React from 'react';


const agencyFeatures = [
  {
    title: "Multi-Client Management",
    description: "Manage multiple client accounts with customized screening criteria and branded experiences for each.",
  },
  {
    title: "Candidate Database",
    description: "Build and maintain a searchable AI-powered talent pool that grows smarter over time.",
  },
  {
    title: "White-Label Solutions",
    description: "Offer AI-powered recruitment as your own service with fully customizable branding.",
  },
  {
    title: "Performance Analytics",
    description: "Track placement success, client satisfaction, and recruiter performance across all accounts.",
  },
];

const Agency = () => {
  return (
    <section id="agencies" className="bg-gray-50 py-12 md:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
       
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#1e1b4b] mb-8 md:mb-10 lg:mb-12">
          How RecruiterAI Helps Recruitment Agencies
        </h2>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {agencyFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 
                         transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
                         flex flex-col items-start"
            >
              
              <div className="bg-[#f5f3ff] p-2.5 md:p-3 rounded-lg md:rounded-xl mb-4 md:mb-6">
                <svg 
                  className="w-5 h-5 md:w-6 md:h-6 text-[#6366f1]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2.5" 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>

              
              <h3 className="text-lg md:text-xl font-bold text-[#1e1b4b] mb-2 md:mb-3 leading-snug">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agency;