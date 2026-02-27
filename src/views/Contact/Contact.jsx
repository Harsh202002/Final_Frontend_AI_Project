import React from 'react';
import HeroSection from './Components/HeroSection';
import ContactMethods from './Components/ContactMethods';
import ContactForm from './Components/ContactForm';
import InfoPanels from './Components/InfoPanels';
import FAQSection from './Components/FAQSection';
import CTASection from './Components/CTASection';

export default function Contact() {
  return (
    <div className="bg-white min-h-screen">
      <HeroSection />
      <ContactMethods />

      <section className="py-16 md:py-20 lg:py-24 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 md:gap-12">
        <ContactForm />
        <InfoPanels />
      </section>

      <FAQSection />
      <CTASection />
    </div>
  );
}
