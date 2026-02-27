import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';
import logo from '../../img/logo.png'; // Assuming your logo image is here

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-br from-[#2D0B7B] via-[#1a0548] to-[#0f0228] text-white">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Company Info */}
          <div className="space-y-4 lg:space-y-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="RecruterAI" className="h-10 w-10 rounded-lg shadow-lg" />
              <span className="text-xl sm:text-2xl font-bold tracking-tight">RecruterAI</span>
            </div>
            <p className="text-sm leading-relaxed text-indigo-100/70 max-w-xs">
              Transforming recruitment with AI-powered solutions. Hire smarter, faster, and more efficiently.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 hover:scale-110 transition-all duration-200" aria-label="LinkedIn">
                <Linkedin size={18} className="text-indigo-200" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 hover:scale-110 transition-all duration-200" aria-label="Twitter">
                <Twitter size={18} className="text-indigo-200" />
              </a>
              <a href="mailto:hello@recruterai.com" className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 hover:scale-110 transition-all duration-200" aria-label="Email">
                <Mail size={18} className="text-indigo-200" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4 lg:mb-6 text-indigo-100">Product</h4>
            <ul className="space-y-3 text-sm text-indigo-100/70">
              <li><button onClick={() => navigate('/features')} className="hover:text-white transition-colors">Features</button></li>
              <li><button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors">How It Works</button></li>
              <li><button onClick={() => navigate('/industries')} className="hover:text-white transition-colors">Industries</button></li>
              <li><button onClick={() => navigate('/pricing')} className="hover:text-white transition-colors">Pricing</button></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4 lg:mb-6 text-indigo-100">Company</h4>
            <ul className="space-y-3 text-sm text-indigo-100/70">
              <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => navigate('/careers')} className="hover:text-white transition-colors">Careers</button></li>
              <li><button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">Blog</button></li>
              <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4 lg:mb-6 text-indigo-100">Contact Us</h4>
            <ul className="space-y-4 text-sm text-indigo-100/70">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-indigo-400 mt-0.5 shrink-0" />
                <a href="mailto:hello@recruterai.com" className="hover:text-white transition-colors">hello@recruterai.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-indigo-400 mt-0.5 shrink-0" />
                <a href="tel:+15551234567" className="hover:text-white transition-colors">+1 (555) 123-4567</a>
              </li>
              <li className="flex items-start gap-3 leading-relaxed">
                <MapPin size={18} className="text-indigo-400 mt-0.5 shrink-0" />
                <span>123 Innovation Drive, Tech City, TC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 lg:mt-16 pt-6 lg:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-indigo-100/50">
          <p className="text-center sm:text-left">© 2026 RecruterAI. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <button className="hover:text-white transition-colors">Terms of Service</button>
            <button className="hover:text-white transition-colors">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}