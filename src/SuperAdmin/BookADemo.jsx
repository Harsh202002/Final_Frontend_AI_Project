import React, { useState } from 'react';
import { Calendar, Send, CheckCircle, AlertCircle, User, Phone, Building2, Users, Mail, Clock } from 'lucide-react';

const BookADemo = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    companySize: '',
    preferredTime: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.companySize) newErrors.companySize = 'Please select company size';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          firstName: '', lastName: '', email: '',
          phone: '', companyName: '', companySize: '',
          preferredTime: '', message: ''
        });
      }, 3500);
    }, 2000);
  };

  const inputBase =
    'w-full px-4 py-2.5 text-sm text-gray-800 bg-gray-50 border rounded-lg outline-none transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100';
  const inputError = 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100';
  const inputNormal = 'border-gray-200 hover:border-gray-300';

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-10 text-center">
          <div className="w-14 h-14 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-7 h-7 text-violet-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Demo Booked!</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Thanks for your interest! Our team will reach out within 1 business day to confirm your demo slot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-2xl overflow-hidden">

        {/* Header Banner */}
        <div className="bg-violet-600 px-8 py-7">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="text-white w-4 h-4" />
            </div>
            <h1 className="text-xl font-semibold text-white">Book a Demo</h1>
          </div>
          <p className="text-violet-200 text-sm pl-11">
            See our platform in action — schedule a personalized walkthrough with our team.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-8 py-4 bg-violet-50 border-b border-violet-100">
          {[
            { icon: '✓', text: '30-min live session' },
            { icon: '✓', text: 'Tailored to your use case' },
            { icon: '✓', text: 'No commitment required' },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs text-violet-700 font-medium">
              <span className="text-violet-500">{item.icon}</span> {item.text}
            </span>
          ))}
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className={`${inputBase} pl-9 ${errors.firstName ? inputError : inputNormal}`}
                    aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  />
                </div>
                {errors.firstName && (
                  <p id="firstName-error" className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className={`${inputBase} pl-9 ${inputNormal}`}
                  />
                </div>
              </div>
            </div>

            {/* Email + Phone Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Work Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@company.com"
                    className={`${inputBase} pl-9 ${errors.email ? inputError : inputNormal}`}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className={`${inputBase} pl-9 ${errors.phone ? inputError : inputNormal}`}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                </div>
                {errors.phone && (
                  <p id="phone-error" className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Company Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Acme Inc."
                    className={`${inputBase} pl-9 ${errors.companyName ? inputError : inputNormal}`}
                    aria-describedby={errors.companyName ? 'companyName-error' : undefined}
                  />
                </div>
                {errors.companyName && (
                  <p id="companyName-error" className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.companyName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Company Size <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className={`${inputBase} pl-9 appearance-none cursor-pointer ${errors.companySize ? inputError : inputNormal}`}
                    aria-describedby={errors.companySize ? 'companySize-error' : undefined}
                  >
                    <option value="">Select size</option>
                    <option value="1-50">1–50 employees</option>
                    <option value="51-200">51–200 employees</option>
                    <option value="201-1000">201–1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.companySize && (
                  <p id="companySize-error" className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.companySize}
                  </p>
                )}
              </div>
            </div>

            {/* Preferred Time — demo-specific field */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Preferred Time Slot <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className={`${inputBase} pl-9 appearance-none cursor-pointer ${inputNormal}`}
                >
                  <option value="">No preference</option>
                  <option value="morning">Morning (9 AM – 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM – 4 PM)</option>
                  <option value="evening">Evening (4 PM – 6 PM)</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Tell us about your needs <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about your team size, goals, or anything you'd like us to focus on during the demo…"
                className={`${inputBase} resize-none ${inputNormal}`}
              />
            </div>

            {/* Divider + Submit */}
            <div className="border-t border-gray-100 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white text-sm font-medium py-3 px-6 rounded-lg transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Booking…
                  </>
                ) : (
                  <>
                    Book My Demo
                    <Send className="w-4 h-4 -rotate-12" />
                  </>
                )}
              </button>
            </div>

          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By submitting, you agree to our{' '}
            <span className="underline cursor-pointer hover:text-violet-600 transition-colors">Privacy Policy</span>
            {' '}and{' '}
            <span className="underline cursor-pointer hover:text-violet-600 transition-colors">Terms of Service</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookADemo;