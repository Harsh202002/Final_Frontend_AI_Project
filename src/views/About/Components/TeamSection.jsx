import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';

const team = [
  { 
    name: "Alexandra Chen", 
    role: "Co-Founder & CEO", 
    bio: "Former VP of Engineering at LinkedIn. 15+ years in HR tech and AI.", 
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" 
  },
  { 
    name: "Marcus Williams", 
    role: "Co-Founder & CTO", 
    bio: "PhD in Machine Learning from Stanford. Previously led AI research at Google.", 
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" 
  },
  { 
    name: "Sarah Mitchell", 
    role: "Chief Product Officer", 
    bio: "Former Head of Product at Workday. Passionate about user experience.", 
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" 
  },
  { 
    name: "David Park", 
    role: "VP of Engineering", 
    bio: "Built engineering teams at Stripe and Airbnb. Expert in scalable systems.", 
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" 
  },
  { 
    name: "Emily Rodriguez", 
    role: "VP of Customer Success", 
    bio: "10+ years helping enterprise clients achieve recruitment excellence.", 
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    name: "James Thompson", 
    role: "Head of AI Research", 
    bio: "Former MIT AI Lab researcher. Published 30+ papers on NLP and ML.", 
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" 
  },
];

export default function TeamSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24 max-w-7xl mx-auto px-4">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-4xl md:text-3xl font-bold text-[#1A1140] mb-2 md:mb-3">
          Meet Our Leadership
        </h2>
        <p className="text-gray-500 text-xl">
          A diverse team of experts united by a passion for transforming recruitment.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {team.map((member, i) => (
          <div key={i} className="group overflow-hidden rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="h-64 md:h-72 overflow-hidden relative">
              <img 
                src={member.img} 
                alt={`${member.name} - ${member.role}`}
                loading="lazy" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#1A1140]/90 to-transparent text-white">
                <p className="font-bold text-base md:text-lg">{member.name}</p>
                <p className="text-[10px] md:text-xs text-blue-400 font-medium uppercase tracking-widest">
                  {member.role}
                </p>
              </div>
            </div>
            <div className="p-5 md:p-6 bg-white flex-grow">
              <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
                {member.bio}
              </p>
              <div className="flex gap-4 text-gray-300 border-t pt-4">
                <Linkedin size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
                <Twitter size={18} className="cursor-pointer hover:text-blue-400 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
