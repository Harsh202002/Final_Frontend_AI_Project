import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../utils/ApiConstants';
import { Pencil, Save, X, Phone, Mail, FileText, User } from "lucide-react";

function CandidateProfile() {
    const [candidate, setCandidate] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [phone, setPhone] = useState("");
    const [resume, setResume] = useState(null);
    const [resumeUrl, setResumeUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const resumeRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("candidateToken");
                const res = await axios.get(`${baseUrl}/candidate/profile/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCandidate(res.data.candidate);
                setPhone(res.data.candidate.phone || "");
                setResumeUrl(res.data.candidate.resume || "");
            } catch (err) {
                setCandidate(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) setResume(file);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("candidateToken");
            const formData = new FormData();
            formData.append("phone", phone);
            if (resume) formData.append("resume", resume);
            const res = await axios.put(`${baseUrl}/candidate/profile/me`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setCandidate(res.data.candidate);
            setResumeUrl(res.data.candidate.resume || "");
            setEditMode(false);
            setResume(null);
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading profile...</div>
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-red-500">Failed to load profile.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-medium text-gray-800 mb-2">Profile</h1>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-light">
                                {candidate.name ? candidate.name[0].toUpperCase() : '?'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-light mb-1">{candidate.name}</h2>
                                <p className="text-white/80 font-light">{candidate.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {!editMode && (
                            <div className="flex justify-end mb-6">
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="flex items-center gap-2 px-6 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                                >
                                    <Pencil size={18} />
                                    <span>Edit</span>
                                </button>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <User size={16} />
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={candidate.name}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-800 transition-all duration-200"
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <Mail size={16} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={candidate.email}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-800 transition-all duration-200"
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <Phone size={16} />
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    maxLength={10}
                                    value={phone}
                                    onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                    disabled={!editMode}
                                    placeholder="Enter your phone number"
                                    className={`w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                                        editMode 
                                            ? 'bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none' 
                                            : 'bg-gray-50 text-gray-800'
                                    }`}
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <FileText size={16} />
                                    Resume
                                </label>
                                
                                {resumeUrl && (
                                    <div className="mb-3">
                                        <a 
                                            href={resumeUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                                        >
                                            <FileText size={18} />
                                            View Current Resume
                                        </a>
                                    </div>
                                )}
                                
                                {editMode && (
                                    <div className="relative">
                                        <input
                                            ref={resumeRef}
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleResumeChange}
                                            className="w-full px-4 py-3 bg-white border-2 border-dashed border-indigo-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                        {resume && (
                                            <p className="mt-2 text-sm text-green-600">
                                                Selected: {resume.name}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {editMode && (
                            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save size={18} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={() => { 
                                        setEditMode(false); 
                                        setPhone(candidate.phone || ""); 
                                        setResume(null); 
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CandidateProfile;