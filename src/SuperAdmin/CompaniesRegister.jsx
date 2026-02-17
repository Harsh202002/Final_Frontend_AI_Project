import React, { useState } from 'react';
import { Upload, ChevronDown, Trash2, CheckCircle, AlertCircle, Loader2, Mail, Globe, Key } from 'lucide-react';
import SpinLoader from '../components/SpinLoader';
import { superAdminBaseUrl } from '../utils/ApiConstants';

function CompaniesRegister() {
    const [formData, setFormData] = useState({
        companyName: '',
        companyType: '',
        contactPerson: '',
        email: '',
        phoneNo: '',
        numberOfEmployees: '',
        gstNumber: '',
        panNumber: '',
        typeOfStaffing: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        logo: null
    });

    const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [message, setMessage] = useState('');
    const [tenantDetails, setTenantDetails] = useState(null);
    const [showSuccessDetails, setShowSuccessDetails] = useState(false);

    const countryCode = ['+91', '+1', '+44', '+86', '+81'];
    const states = [
        'Select State',
        'Maharashtra',
        'Delhi',
        'Karnataka',
        'Tamil Nadu',
        'Gujarat',
        'Uttar Pradesh',
        'West Bengal',
        'Rajasthan'
    ];

    const staffingTypes = [
        { value: '', label: 'Select Type of Staffing' },
        { value: 'contract', label: 'Contract' },
        { value: 'permanent', label: 'Permanent' },
        { value: 'both', label: 'Both' }
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (submitStatus === 'error') {
            setSubmitStatus(null);
            setMessage('');
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({
                ...formData,
                logo: file
            });
        }
    };

    const validateForm = () => {
        const errors = [];

        if (!formData.companyName.trim()) errors.push('Company name is required');
        if (!formData.companyType.trim()) errors.push('Company type is required');
        if (!formData.email.trim()) errors.push('Email is required');
        if (!formData.phoneNo.trim()) errors.push('Phone number is required');
        if (!formData.numberOfEmployees.trim()) errors.push('Number of employees is required');
        if (!formData.gstNumber.trim()) errors.push('GST number is required');
        if (!formData.panNumber.trim()) errors.push('PAN number is required');
        if (!formData.typeOfStaffing.trim()) errors.push('Type of staffing is required');
        if (!formData.address1.trim()) errors.push('Address is required');
        if (!formData.city.trim()) errors.push('City is required');
        if (formData.state === 'Select State' || !formData.state) errors.push('Please select a state');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            errors.push('Please enter a valid email address');
        }

        const phoneRegex = /^\d{10}$/;
        if (formData.phoneNo && !phoneRegex.test(formData.phoneNo)) {
            errors.push('Please enter a valid 10-digit phone number');
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitStatus(null);
        setMessage('');
        setTenantDetails(null);
        setShowSuccessDetails(false);

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setSubmitStatus('error');
            setMessage(validationErrors.join(', '));
            return;
        }

        setIsSubmitting(true);

        try {
            const apiData = {
                companyName: formData.companyName,
                email: formData.email,
                companyType: formData.companyType,
                gstNumber: formData.gstNumber,
                typeOfStaffing: formData.typeOfStaffing,
                panNumber: formData.panNumber,
                phoneNo: `${selectedCountryCode}${formData.phoneNo}`,
                numberOfEmployees: formData.numberOfEmployees,
                address1: formData.address1,
                address2: formData.address2,
                city: formData.city,
                state: formData.state
            };

            console.log('Sending data:', apiData);

            const response = await fetch(`${superAdminBaseUrl}/company/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(apiData)
            });

            console.log('Response status:', response.status);

            const data = await response.json();
            if (response.ok && (data.success || data.company)) {
                setSubmitStatus('success');
                setMessage('Registration successful! Company has been registered.');
                setTenantDetails(data.data || data);
                setShowSuccessDetails(true);

                setTimeout(() => {
                    setFormData({
                        companyName: '',
                        companyType: '',
                        contactPerson: '',
                        email: '',
                        phoneNo: '',
                        numberOfEmployees: '',
                        gstNumber: '',
                        panNumber: '',
                        typeOfStaffing: '',
                        address1: '',
                        address2: '',
                        city: '',
                        state: '',
                        logo: null
                    });
                    setShowSuccessDetails(false);
                    setSubmitStatus(null);
                }, 5000);
            } else {
                setSubmitStatus('error');
                setMessage(data.message || data.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setMessage('Network error. Please check your connection and try again.');
            console.log('Registration error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 items-start relative">
            
            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <SpinLoader />
                </div>
            )}

            <div className="">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-purple-600 mb-2">RecruterAI</h1>
                </div>

                {submitStatus && (
                    <div className={`mb-4 p-4 rounded-lg ${submitStatus === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                        }`}>
                        <div className="flex items-start gap-3">
                            {submitStatus === 'success' ? (
                                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-600" />
                            ) : (
                                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-600" />
                            )}
                            <div className="flex-1">
                                <p className={`font-medium ${submitStatus === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                    {message}
                                </p>

                                {showSuccessDetails && tenantDetails && (
                                    <div className="mt-4 space-y-3 bg-white p-4 rounded-lg border border-green-200">
                                        <div className="flex items-start gap-3">
                                            <Mail className="h-4 w-4 text-purple-600 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-700">Email Sent To:</p>
                                                <p className="text-gray-600">{tenantDetails.tenant?.email || tenantDetails.company?.email}</p>
                                            </div>
                                        </div>

                                        {tenantDetails.tenant?.subdomain && (
                                            <div className="flex items-start gap-3">
                                                <Globe className="h-4 w-4 text-purple-600 mt-0.5" />
                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-700">Your Subdomain:</p>
                                                    <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                                                        {tenantDetails.tenant.subdomain}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {tenantDetails.credentials && (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <Key className="h-4 w-4 text-purple-600 mt-0.5" />
                                                    <div className="text-sm">
                                                        <p className="font-medium text-gray-700">Login Credentials:</p>
                                                        <p className="text-gray-600">Username: <span className="font-mono">{tenantDetails.credentials.username}</span></p>
                                                        <p className="text-xs text-gray-500 mt-1">Password has been sent to your email</p>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-gray-200">
                                                    <a
                                                        href={tenantDetails.credentials.loginUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-block px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                                                    >
                                                        Go to Login Page →
                                                    </a>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-white border-gray-500 border rounded-4xl">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-500 py-1 px-6 sm:px-8">
                            Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-6 sm:px-8 pb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Company Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    placeholder="Enter Company Name"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-1 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Company Type <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="companyType"
                                    value={formData.companyType}
                                    onChange={handleInputChange}
                                    placeholder="Enter Company Type"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-1 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Contact Person
                                </label>
                                <input
                                    type="text"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleInputChange}
                                    placeholder="Enter Contact Person"
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-1 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter Email"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-1 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="relative w-full sm:w-20">
                                        <select
                                            value={selectedCountryCode}
                                            onChange={(e) => setSelectedCountryCode(e.target.value)}
                                            disabled={isSubmitting}
                                            className="appearance-none border bg-gray-100 border-gray-300 border-r-0 rounded-l-lg px-4 py-1 pr-8 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {countryCode.map((code) => (
                                                <option key={code} value={code}>
                                                    {code}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>

                                    <input
                                        type="tel"
                                        name="phoneNo"
                                        value={formData.phoneNo}
                                        onChange={handleInputChange}
                                        placeholder="Enter Phone Number"
                                        required
                                        disabled={isSubmitting}
                                        pattern="[0-9]{10}"
                                        maxLength="10"
                                        className="w-full sm:flex-1 px-4 py-1 border border-gray-300 bg-gray-100 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Number of Employees <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="numberOfEmployees"
                                    value={formData.numberOfEmployees}
                                    onChange={handleInputChange}
                                    placeholder="Number of Employees"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-1 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    GST Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="gstNumber"
                                    value={formData.gstNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter GST Number"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-1 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    PAN Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="panNumber"
                                    value={formData.panNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter PAN Number"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-1 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">
                                    Type of Staffing <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="typeOfStaffing"
                                        value={formData.typeOfStaffing}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting}
                                        className="w-full appearance-none px-4 py-1 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {staffingTypes.map((type) => (
                                            <option key={type.value} value={type.value} disabled={type.value === ''}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-gray-500 border rounded-4xl">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-500 py-1 px-6 sm:px-8">
                            Address
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-4 px-6 sm:px-8">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Address 1 <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="address1"
                                    value={formData.address1}
                                    onChange={handleInputChange}
                                    placeholder="Enter Address 1"
                                    rows="2"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full px-4 pt-2 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Address 2
                                </label>
                                <textarea
                                    name="address2"
                                    value={formData.address2}
                                    onChange={handleInputChange}
                                    placeholder="Enter Address 2"
                                    rows="2"
                                    disabled={isSubmitting}
                                    className="w-full px-4 pt-2 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Enter City"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-1 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    State <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting}
                                        className="w-full appearance-none px-4 py-1 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {states.map((state) => (
                                            <option key={state} value={state} disabled={state === 'Select State'}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-gray-500 border rounded-4xl">
                        <div className='border-b border-gray-500 text-xl py-1 px-6 sm:px-8'>
                            <label className="block font-medium text-gray-900">Logo</label>
                        </div>

                        <div className="flex flex-col justify-between sm:flex-row items-start gap-4 py-3 px-6 sm:px-8">
                            <div className="w-35 h-20 bg-gray-50 border border-gray-500 rounded-md flex items-center justify-center overflow-hidden">
                                {formData.logo ? (
                                    <img
                                        src={typeof formData.logo === 'string' ? formData.logo : URL.createObjectURL(formData.logo)}
                                        alt="Logo preview"
                                        className="max-h-full max-w-full object-contain p-2"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400">No logo</span>
                                )}
                            </div>

                            <div className="flex sm:flex-col items-stretch gap-2">
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={isSubmitting}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="logo-upload"
                                    className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full border border-gray-500 bg-white text-sm text-gray-800 hover:bg-gray-50 cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload a file
                                </label>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (formData.logo && typeof formData.logo === 'string' && formData.logo.startsWith('blob:')) {
                                            try { URL.revokeObjectURL(formData.logo); } catch { }
                                        }
                                        setFormData({ ...formData, logo: null });
                                        const input = document.getElementById('logo-upload');
                                        if (input) input.value = '';
                                    }}
                                    disabled={!formData.logo || isSubmitting}
                                    className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full border text-sm
                                        ${formData.logo && !isSubmitting
                                            ? 'bg-red-50 text-red-700 border-red-500 hover:bg-red-100'
                                            : 'bg-red-50/50 text-red-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-[#6D28D9] text-white font-semibold py-3 px-12 rounded-4xl transform transition-all duration-200 shadow-lg inline-flex items-center justify-center
                                ${isSubmitting
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:scale-105 hover:shadow-xl'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Registering...
                                </>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CompaniesRegister;