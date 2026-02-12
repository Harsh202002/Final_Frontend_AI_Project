import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Upload, X } from "lucide-react";
import axios from "axios";
import { baseUrl } from "../../utils/ApiConstants";

const ApplyToJob = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [existingResume, setExistingResume] = useState(null);
    const [showResumeChoice, setShowResumeChoice] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [useExistingResume, setUseExistingResume] = useState(false);
    const [resume, setResume] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        reallocate: false
    });

    const getCandidateInfo = () => {
        try {
            const user = JSON.parse(localStorage.getItem("candidate"));
            if (user) {
                return {
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || ''
                };
            }
        } catch (e) { }
        return { name: '', email: '', phone: '' };
    };

    useEffect(() => {
        const initializePage = async () => {
            try {
                setLoading(true);

                const allJDsResponse = await axios.get(`${baseUrl}/jd/all-jd`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('candidateToken')}`,
                    }
                });

                if (allJDsResponse.data.success && allJDsResponse.data.data) {
                    const matchedJob = allJDsResponse.data.data.find(item => item._id === jobId);

                    if (matchedJob) {
                        setSelectedJob({
                            id: matchedJob._id,
                            _id: matchedJob._id,
                            title: matchedJob.offerId?.jobTitle || 'Job Title Not Available',
                            location: matchedJob.offerId?.location || 'Location Not Specified',
                            company: matchedJob.companyName || 'Company Not Specified',
                            primaryLocation: matchedJob.offerId?.location || 'Location Not Specified',
                            jobSummary: matchedJob.jobSummary || '',
                            responsibilities: matchedJob.responsibilities || [],
                            requirements: matchedJob.requirements || [],
                            benefits: matchedJob.benefits || [],
                        });
                    }
                }

                const info = getCandidateInfo();
                setFormData({
                    name: info.name,
                    email: info.email,
                    phone: info.phone,
                    reallocate: false
                });

                const token = localStorage.getItem('candidateToken');
                const resumeResponse = await axios.get(`${baseUrl}/candidate/resume`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (resumeResponse.data.success && resumeResponse.data.resume) {
                    setExistingResume(resumeResponse.data.resume);
                    setShowResumeChoice(true);
                } else {
                    setShowApplicationForm(true);
                }
            } catch (error) {
                setShowApplicationForm(true);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, [jobId]);

    useEffect(() => {
        const initializePage = async () => {
            try {
                setLoading(true);

                let jobData = null;
                const storedJob = localStorage.getItem("selectedJD");

                if (storedJob) {
                    jobData = JSON.parse(storedJob);
                } else {
                    try {
                        const allJDsResponse = await axios.get(`${baseUrl}/jd/all-jd`, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('candidateToken')}`,
                            }
                        });

                        if (allJDsResponse.data.success && allJDsResponse.data.data) {
                            const matchedJob = allJDsResponse.data.data.find(item => item._id === jobId);
                            if (matchedJob) {
                                jobData = {
                                    id: matchedJob._id,
                                    _id: matchedJob._id,
                                    title: matchedJob.offerId?.jobTitle || 'Job Title Not Available',
                                    location: matchedJob.offerId?.location || 'Location Not Specified',
                                    company: matchedJob.companyName || 'Company Not Specified',
                                    primaryLocation: matchedJob.offerId?.location || 'Location Not Specified',
                                    jobSummary: matchedJob.jobSummary || '',
                                    responsibilities: matchedJob.responsibilities || [],
                                    requirements: matchedJob.requirements || [],
                                    benefits: matchedJob.benefits || [],
                                };
                            }
                        }
                    } catch (jobError) {
                        console.log("Error fetching job:", jobError);
                    }
                }

                if (jobData) {
                    setSelectedJob(jobData);
                }

                const info = getCandidateInfo();
                setFormData({
                    name: info.name,
                    email: info.email,
                    phone: info.phone,
                    reallocate: false
                });

                try {
                    const token = localStorage.getItem('candidateToken');
                    const resumeResponse = await axios.get(`${baseUrl}/candidate/resume`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    console.log("Resume Response:", resumeResponse.data); // Debug log

                    if (resumeResponse.data.success && resumeResponse.data.resume) {
                        setExistingResume(resumeResponse.data.resume);
                        setShowResumeChoice(true);
                        setShowApplicationForm(false);
                    } else {
                        setShowResumeChoice(false);
                        setShowApplicationForm(true);
                    }
                } catch (resumeError) {
                    console.log("Resume fetch error:", resumeError);
                    setShowResumeChoice(false);
                    setShowApplicationForm(true);
                }

            } catch (error) {
                console.log("Error in initializePage:", error);
                setShowApplicationForm(true);
            } finally {
                setLoading(false);
            }
        };

        initializePage();
    }, [jobId]);

    const handleUseExistingResume = () => {
        setShowResumeChoice(false);
        setShowApplicationForm(true);
        setUseExistingResume(true);
    };

    const handleUploadNewResume = () => {
        setShowResumeChoice(false);
        setShowApplicationForm(true);
        setUseExistingResume(false);
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'phone') {
            setFormData(prev => ({ ...prev, [name]: value.replace(/[^0-9]/g, '') }));
        } else if (name === 'reallocate') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        }
    };

    const handleSubmitApplication = async (e) => {
        e.preventDefault();

        if (!useExistingResume && !resume) {
            alert('Please upload a resume');
            return;
        }

        if (!formData.name || !formData.email || !formData.phone) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setSubmitting(true);
            const token = localStorage.getItem('candidateToken');
            const submitData = new FormData();

            if (useExistingResume && existingResume) {
                submitData.append('useExistingResume', 'true');
                submitData.append('existingResumeUrl', existingResume);
            } else {
                submitData.append('resume', resume);
            }
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('reallocate', formData.reallocate ? 'yes' : 'no');

            const response = await axios.post(
                `${baseUrl}/candidate/apply/${jobId}`,
                submitData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            if (response.data.success) {
                alert('Application submitted successfully!');
                navigate('/Candidate-Dashboard/AllJDs');
            } else {
                alert(response.data.error || 'Application failed.');
            }
        } catch (error) {
            alert(error?.response?.data?.error || 'Application failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate("/Candidate-Dashboard/AllJds");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!selectedJob) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Job not found</p>
                    <button onClick={handleBack} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {showResumeChoice && existingResume && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative">
                        <button onClick={handleBack} className="absolute top-3 right-3 text-gray-500 hover:text-black transition">
                            <X size={22} />
                        </button>
                        <div className="p-6 space-y-5">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Resume Selection</h2>
                            <p className="text-gray-700 mb-4">You already have a resume uploaded. Please choose an option:</p>
                            <div className="flex flex-col gap-4">
                                <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                                    <span className="text-green-700 font-semibold">Use Existing Resume</span>
                                    <a href={existingResume} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2">View Resume</a>
                                    <button className="mt-3 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium" onClick={handleUseExistingResume}>
                                        Use This Resume
                                    </button>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                                    <span className="text-blue-700 font-semibold">Upload New Resume</span>
                                    <button className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium" onClick={handleUploadNewResume}>
                                        Upload New Resume
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showApplicationForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                        <button className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl" onClick={handleBack} disabled={submitting}>
                            <X size={22} />
                        </button>
                        <div className="p-6">
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Apply for {selectedJob.title}</h2>
                                <div className="flex items-center gap-1 text-red-500 mt-1">
                                    <MapPin size={16} />
                                    <span>{selectedJob.primaryLocation || selectedJob.location}</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitApplication} className="space-y-4">
                                {!useExistingResume ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Resume<span className="text-red-500">*</span>
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                            <Upload size={28} className="text-gray-400 mb-2" />
                                            <label htmlFor="resume" className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 text-sm">
                                                Upload a Resume
                                            </label>
                                            <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX up to 5MB</p>
                                            <input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                                            {resume && <p className="mt-2 text-sm text-green-600">{resume.name}</p>}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
                                        <div className="border border-green-300 rounded-lg p-4 flex flex-col items-center">
                                            <span className="text-green-700 font-semibold">Using Existing Resume</span>
                                            <a href={existingResume} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2">View Resume</a>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name<span className="text-red-500">*</span>
                                    </label>
                                    <input type="text" name="name" value={formData.name} readOnly className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 focus:outline-none cursor-not-allowed text-gray-500" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email<span className="text-red-500">*</span>
                                    </label>
                                    <input type="email" name="email" value={formData.email} readOnly className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 focus:outline-none cursor-not-allowed text-gray-500" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone<span className="text-red-500">*</span>
                                    </label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none" required maxLength={10} />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="reallocate" name="reallocate" checked={formData.reallocate} onChange={handleInputChange} className="w-4 h-4 border-gray-300 rounded accent-black" />
                                    <label htmlFor="reallocate" className="text-sm text-gray-700 select-none">
                                        I am willing to relocate for this position
                                    </label>
                                </div>

                                <button type="submit" disabled={submitting} className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {submitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplyToJob;