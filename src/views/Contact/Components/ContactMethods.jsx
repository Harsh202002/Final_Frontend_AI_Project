import React from 'react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

const contactMethods = [
  { 
    icon: <Mail className="text-indigo-500" />, 
    title: "Email Us", 
    detail: "airecruit@gmail.com", 
    sub: "Get a response within 24 hours" 
  },
  { 
    icon: <Phone className="text-indigo-500" />, 
    title: "Call Us", 
    detail: "+9876543210", 
    sub: "Mon-Fri, 9am-6pm EST" 
  },
  { 
    icon: <MapPin className="text-indigo-500" />, 
    title: "Visit Us", 
    detail: "123 Newtown Kolkata-700156", 
    sub: "Our headquarters" 
  },
  { 
    icon: <MessageSquare className="text-indigo-500" />, 
    title: "Live Chat", 
    detail: "Start a conversation", 
    sub: "Available 24/7" 
  },
];

export default function ContactMethods() {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {contactMethods.map((item, i) => (
          <div 
            key={i} 
            className="bg-white p-5 md:p-6 rounded-2xl shadow-xl border border-gray-100 text-center hover:translate-y-[-5px] transition-all"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              {item.icon}
            </div>
            <h4 className="font-bold text-gray-900 mb-1 text-sm md:text-base">{item.title}</h4>
            <p className="text-[10px] md:text-xs text-gray-500 mb-2">{item.sub}</p>
            <p className="text-xs md:text-sm font-semibold text-indigo-600">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
