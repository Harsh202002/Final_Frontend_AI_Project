import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, Calendar, Mail, Send } from 'lucide-react';
import { superAdminBaseUrl } from '../../../utils/ApiConstants';

export default function ContactForm() {
  const [activeTab, setActiveTab] = useState('demo'); // demo or inquiry
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    companySize: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await axios.post(`${superAdminBaseUrl}/enquiry/submit`, {
        companyName: formData.companyName || `${formData.firstName} ${formData.lastName}`,
        emailid: formData.email,
        phone: formData.phoneNumber,
        message: `Type: ${activeTab} | Size: ${formData.companySize} | Msg: ${formData.message}`
      });

      if (response.data.status === 'success') {
        setSubmitStatus({ type: 'success', message: 'Request sent successfully!' });
        setFormData({ 
          firstName: '', lastName: '', email: '', phoneNumber: '', 
          companyName: '', companySize: '', message: '' 
        });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to send. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-gray-50 p-6 md:p-8 lg:p-12 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <MessageSquare size={20} />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Contact Us</h2>
          <p className="text-xs md:text-sm text-gray-500">Fill out the form and we'll be in touch</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-xl max-w-md">
          <button 
            type="button" 
            onClick={() => setActiveTab('demo')} 
            className={`flex-1 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'demo' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar size={16} /> Book a Demo
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('inquiry')} 
            className={`flex-1 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'inquiry' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Mail size={16} /> General Inquiry
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-xs md:text-sm font-semibold text-gray-700">First Name *</label>
            <input 
              id="firstName"
              name="firstName" 
              type="text"
              required 
              value={formData.firstName} 
              onChange={handleChange} 
              placeholder="John" 
              aria-required="true"
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 md:py-3 focus:ring-2 focus:ring-indigo-500 transition-all text-sm md:text-base" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-xs md:text-sm font-semibold text-gray-700">Last Name *</label>
            <input 
              id="lastName"
              name="lastName" 
              type="text"
              required 
              value={formData.lastName} 
              onChange={handleChange} 
              placeholder="Doe" 
              aria-required="true"
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 md:py-3 focus:ring-2 focus:ring-indigo-500 transition-all text-sm md:text-base" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs md:text-sm font-semibold text-gray-700">Work Email *</label>
            <input 
              id="email"
              type="email" 
              name="email" 
              required 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="john@company.com" 
              aria-required="true"
              autoComplete="email"
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 md:py-3 focus:ring-2 focus:ring-indigo-500 transition-all text-sm md:text-base" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-xs md:text-sm font-semibold text-gray-700">Phone Number</label>
            <input 
              id="phoneNumber"
              name="phoneNumber" 
              type="tel"
              value={formData.phoneNumber} 
              onChange={handleChange} 
              placeholder="+1 (555) 000-0000" 
              autoComplete="tel"
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 md:py-3 focus:ring-2 focus:ring-indigo-500 transition-all text-sm md:text-base" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="companyName" className="text-xs md:text-sm font-semibold text-gray-700">Company Name *</label>
            <input 
              id="companyName"
              name="companyName" 
              type="text"
              required 
              value={formData.companyName} 
              onChange={handleChange} 
              placeholder="Acme Inc." 
              aria-required="true"
              autoComplete="organization"
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 md:py-3 focus:ring-2 focus:ring-indigo-500 transition-all text-sm md:text-base" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="companySize" className="text-xs md:text-sm font-semibold text-gray-700">Company Size *</label>
            <select 
              id="companySize"
              name="companySize" 
              value={formData.companySize} 
              onChange={handleChange} 
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 md:py-3 focus:ring-2 focus:ring-indigo-500 transition-all text-sm md:text-base"
            >
              <option value="">Select size</option>
              <option value="1-50">1-50 Employees</option>
              <option value="51-200">51-200 Employees</option>
              <option value="201+">201+ Employees</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-xs md:text-sm font-semibold text-gray-700">Message</label>
          <textarea 
            id="message"
            name="message" 
            rows="4" 
            value={formData.message} 
            onChange={handleChange} 
            placeholder="Tell us about your hiring needs..." 
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 md:py-3 focus:ring-2 focus:ring-indigo-500 transition-all text-sm md:text-base" 
          />
        </div>

        {submitStatus.message && (
          <div className={`p-3 rounded-lg text-sm ${
            submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base"
        >
          {isSubmitting ? 'Sending...' : (
            <>
              Book My Demo <Send size={18} />
            </>
          )}
        </button>
        <p className="text-center text-[9px] md:text-[10px] text-gray-400">
          By submitting, you agree to our Privacy Policy and Terms of Service.
        </p>
      </form>
    </div>
  );
}
