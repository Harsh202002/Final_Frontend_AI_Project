import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../utils/ApiConstants';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        password: "123456",
        phone: "",
        resume: null,
        resumeName: "resume.pdf"
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState(profile);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${baseUrl}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log(response.data);
                
                const apiData = response.data.data;
                setProfile(prev => ({
                    ...prev,
                    name: apiData.name || prev.name,
                    email: apiData.email || prev.email,
                    phone: apiData.phone || prev.phone,
                }));
                
                setTempProfile(prev => ({
                    ...prev,
                    name: apiData.name || prev.name,
                    email: apiData.email || prev.email,
                    phone: apiData.phone || prev.phone,
                }));
                
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempProfile({
            ...tempProfile,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempProfile({
                ...tempProfile,
                resume: file,
                resumeName: file.name
            });
        }
    };

    const handleSave = () => {
        setProfile(tempProfile);
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    const handleCancel = () => {
        setTempProfile(profile);
        setIsEditing(false);
    };

    const EyeIcon = ({ open }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            {open ? (
                <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </>
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            )}
        </svg>
    );

    return (
        <div className="min-h-screen max-w-md mx-auto bg-white rounded-2xl shadow-md p-6">

            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                My Profile
            </h1>

            <div className="space-y-4">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={tempProfile.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-md">{profile.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <p className="px-3 py-2 bg-gray-200 rounded-md text-gray-600">
                        {profile.email}
                    </p>
                    <span className="text-xs text-gray-500">Email cannot be changed</span>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        {isEditing ? (
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={tempProfile.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            />
                        ) : (
                            <p className="px-3 py-2 bg-gray-50 rounded-md pr-10">
                                {showPassword ? profile.password : "••••••••"}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            <EyeIcon open={showPassword} />
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                    </label>
                    {isEditing ? (
                        <input
                            type="tel"
                            name="phone"
                            value={tempProfile.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-md">{profile.phone}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resume (PDF)
                    </label>
                    {isEditing ? (
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-md text-blue-600">
                            {profile.resumeName || "No resume uploaded"}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;