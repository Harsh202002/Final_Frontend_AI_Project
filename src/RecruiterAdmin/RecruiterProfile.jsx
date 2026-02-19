import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import axios from 'axios';
import { baseUrl } from '../utils/ApiConstants';

const RecruiterProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        phone: '',
        isActive: true
    });
    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await axios.get(`${baseUrl}/auth/meAll`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = response.data;
                console.log(data);
                

                if (data.data) {
                    const profileData = {
                        name: data.data.name || '',
                        email: data.data.email || '',
                        role: data.data.role || '',
                        phone: data.data.phone || '',
                        isActive: data.data.isActive ?? true
                    };
                    setFormData(profileData);
                    setOriginalData(profileData);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'phone') {
            const phoneValue = value.replace(/[^0-9]/g, '').slice(0, 10);
            setFormData((prev) => ({ ...prev, [name]: phoneValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `${baseUrl}/recruiter/profile/me`,
                { phone: formData.phone },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            
            if (response.data.data) {
                setFormData(prev => ({
                    ...prev,
                    phone: response.data.data.phone || ''
                }));
                setOriginalData(prev => ({
                    ...prev,
                    phone: response.data.data.phone || ''
                }));
            }
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(originalData);
    };

    const getInitials = (name) => {
        if (!name) return 'NA';
        const words = name.trim().split(' ');
        if (words.length === 1) {
            return words[0][0].toUpperCase();
        }
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };

    if (loading) {
        return (
            <div className="p-4 md:p-6 lg:p-8 shadow-[0px_0px_10px_0px_rgba(0,_0,_0,_0.1)] max-w-3xl mx-auto rounded-xl">
                <p className="text-center text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 shadow-[0px_0px_10px_0px_rgba(0,_0,_0,_0.1)] max-w-3xl mx-auto rounded-xl bg-white">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Profile</h1>

            <div className="flex flex-col md:flex-row items-center mb-8 md:space-x-8">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold mb-4 md:mb-0">
                    {getInitials(formData.name)}
                </div>
                {/* <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <span>Upload Image</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-red-300 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                        <span>Delete</span>
                    </button>
                </div> */}
            </div>

            <form className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                        <Check className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                    </label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone <span className="text-xs text-purple-500">(Editable)</span>
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        maxLength={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            formData.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {formData.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecruiterProfile;