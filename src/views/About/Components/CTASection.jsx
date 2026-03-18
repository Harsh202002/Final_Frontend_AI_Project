import React from 'react';
import { useNavigate } from 'react-router-dom';

//about
export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-[#2a45b0] to-[#26bba7] py-16 md:py-20 lg:py-24 text-white text-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Join Us On Our Mission
          </h2>
          <p className="mb-8 md:mb-10 text-white/80 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Whether you're looking to transform your hiring or join our team, we'd love to connect.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <button className="bg-white text-[#1A1140] px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              onClick={() => navigate('/contact#contact-form')}
            
            >
              Get Started →
            </button>
            <button className="bg-white/10 backdrop-blur-md px-10 py-4 rounded-full font-bold border border-white/20 hover:bg-white/20 hover:scale-105 transition-all"
            onClick={() => navigate('/contact#contact-form')}>
              View Careers
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
