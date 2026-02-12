import React, { useEffect, useState } from "react";
import { MapPin, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../utils/ApiConstants";
import axios from "axios";

const JDDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchJDs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${baseUrl}/jd/allJDs`);

                if (response.data.success && response.data.data) {
                    const matchedJD = response.data.data.find(jd => jd._id === id);

                    if (matchedJD) {
                        setJobData({
                            title: matchedJD.offerId?.jobTitle || 'Job Title Not Available',
                            location: matchedJD.offerId?.location || 'Location Not Specified',
                            company: matchedJD.companyName || 'Company Not Specified',
                            jobSummary: matchedJD.jobSummary || '',
                            responsibilities: matchedJD.responsibilities || [],
                            requirements: matchedJD.requirements || [],
                            benefits: matchedJD.benefits || [],
                            additionalInfo: matchedJD.additionalInfo || '',
                            _id: matchedJD._id
                        });
                        setNotFound(false);
                    } else {
                        setJobData(null);
                        setNotFound(true);
                    }
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error('Error fetching JDs:', error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJDs();
        } else {
            setNotFound(true);
            setLoading(false);
        }
    }, [id]);

    const handleApply = () => {
        const token = localStorage.getItem('candidateToken');
        if (token) {
            navigate(`/Candidate-Dashboard/AllJDs/ApplyToJob/${jobData._id}`);
        } else {
            navigate('/CandidateLogin', { state: { redirectJobId: jobData._id } });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (notFound || !jobData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Job Not Available
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Either this job description has been deleted or the job requirement is closed.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 sm:p-8 space-y-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                                {jobData.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center text-red-600 text-sm font-medium">
                                    <MapPin size={16} className="mr-1" />
                                    {Array.isArray(jobData.location)
                                        ? jobData.location.join(', ')
                                        : jobData.location
                                    }
                                </div>
                                <span className="text-gray-600 text-sm">
                                    {jobData.company}
                                </span>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {jobData.jobSummary && (
                            <div>
                                <h2 className="font-semibold text-gray-900 text-lg mb-2">
                                    Job Summary
                                </h2>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {jobData.jobSummary}
                                </p>
                            </div>
                        )}

                        {jobData.responsibilities.length > 0 && (
                            <div>
                                <h2 className="font-semibold text-gray-900 text-lg mb-3">
                                    Key Responsibilities
                                </h2>
                                <ul className="space-y-2">
                                    {jobData.responsibilities.map((resp, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-gray-700 text-sm"
                                        >
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                            <span>{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {jobData.requirements.length > 0 && (
                            <div>
                                <h2 className="font-semibold text-gray-900 text-lg mb-3">
                                    Requirements
                                </h2>
                                <ul className="space-y-2">
                                    {jobData.requirements.map((req, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-gray-700 text-sm"
                                        >
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {jobData.benefits.length > 0 && (
                            <div>
                                <h2 className="font-semibold text-gray-900 text-lg mb-3">
                                    Benefits
                                </h2>
                                <ul className="space-y-2">
                                    {jobData.benefits.map((benefit, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-gray-700 text-sm"
                                        >
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {jobData.additionalInfo && (
                            <div>
                                <h2 className="font-semibold text-gray-900 text-lg mb-2">
                                    Additional Information
                                </h2>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                                    {jobData.additionalInfo}
                                </p>
                            </div>
                        )}

                        <hr className="border-gray-200" />

                        <div className="pt-2 flex justify-center">
                            <button
                                onClick={handleApply}
                                className="bg-black text-white font-medium py-3 px-20 rounded-lg transition hover:bg-gray-800"
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JDDetail;