import React, { useEffect, useState } from "react";
import { Search, MapPin, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/LandingPage/Pagination";
import axios from "axios";
import { baseUrl } from "../../utils/ApiConstants";

const AllJDs = () => {
    const navigate = useNavigate();
    const [jdData, setJdData] = useState([]);
    const [appliedJdIds, setAppliedJdIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterLocation, setFilterLocation] = useState("");
    const [filterCompany, setFilterCompany] = useState("");

    useEffect(() => {
        const fetchAppliedJDs = async () => {
            try {
                const response = await axios.get(`${baseUrl}/candidate/applied-jobs`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('candidateToken')}`,
                    },
                });
                console.log('Applied JDs data:', response.data);

                if (response.data.success && response.data.jobs) {
                    const appliedIds = response.data.jobs.map(job => job._id);
                    setAppliedJdIds(appliedIds);
                }
            } catch (error) {
                console.error('Error fetching applied JDs:', error);
            }
        };
        fetchAppliedJDs();
    }, []);

    useEffect(() => {
        const fetchJDs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${baseUrl}/jd/all-jd`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('candidateToken')}`,
                    }
                });

                console.log('JDs Data:', response.data);

                if (response.data.success && response.data.data) {
                    const mappedData = response.data.data
                        .filter(item => item._id)
                        .filter(item => !appliedJdIds.includes(item._id))
                        .map(item => ({
                            id: item._id,
                            _id: item._id,
                            title: item.offerId?.jobTitle || 'Job Title Not Available',
                            location: item.offerId?.location || 'Location Not Specified',
                            company: item.companyName || 'Company Not Specified',
                            companyId: `#${item._id.slice(-6)}`,
                            skills: item.requirements?.slice(0, 4).join(', ') + (item.requirements?.length > 4 ? ', etc.' : '') || 'Skills not specified',
                            skillsArray: item.requirements?.slice(0, 6) || [],
                            primaryLocation: item.offerId?.location || 'Location Not Specified',
                            jobSummary: item.jobSummary || '',
                            responsibilities: item.responsibilities || [],
                            requirements: item.requirements || [],
                            benefits: item.benefits || [],
                            additionalInfo: item.additionalInfo || '',
                            department: item.department || '',
                            createdBy: item.createdBy || {},
                            publicToken: item.publicToken || '',
                            createdAt: item.createdAt || '',
                        }))
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setJdData(mappedData);
                }

            } catch (error) {
                console.error('Error fetching JDs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJDs();
    }, [appliedJdIds]);

    const itemsPerPage = 6;
    const totalPages = Math.ceil(jdData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleApplyClick = (candidate) => {
        setSelectedJob(candidate);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
        setShowModal(false);
    };

    const handleApplyFromModal = () => {
        setShowModal(false);
        navigate(`/Candidate-Dashboard/AllJDs/ApplyToJob/${selectedJob._id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    // Filter and search logic
    const filteredCandidates = jdData.filter(jd => {
        const matchesSearch = jd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jd.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jd.skills.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = filterLocation ? jd.location === filterLocation : true;
        const matchesCompany = filterCompany ? jd.company === filterCompany : true;
        return matchesSearch && matchesLocation && matchesCompany;
    });
    const currentCandidates = filteredCandidates.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="min-h-screen">
            <header>
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                    <h1 className="text-2xl sm:text-3xl text-gray-900 font-bold">All Job Descriptions</h1>
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-stretch md:items-center">
                        <div className="relative flex-1 md:flex-initial">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search by title, company, or skills"
                                className="w-full md:w-64 pl-3 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <Search className="w-5 h-5" />
                            </span>
                        </div>
                        {(filterLocation || filterCompany || searchTerm) && (
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                onClick={() => { setFilterLocation(""); setFilterCompany(""); setSearchTerm(""); }}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="mt-10">
                {currentCandidates.length === 0 ? (
                    <div className="text-center text-gray-600 py-10">
                        No job descriptions available.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {currentCandidates.map((candidate) => (
                            <div
                                key={candidate.id}
                                className="bg-white rounded-lg border border-gray-300 shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-3">{candidate.title}</h2>

                                <div className="flex items-start gap-2 mb-4 border border-green-300 rounded-md p-2">
                                    <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                                    <div className="flex flex-wrap gap-1.5 h-[50px] overflow-y-auto pr-2">
                                        {Array.isArray(candidate.location)
                                            ? candidate.location.map((loc, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200 h-fit"
                                                >
                                                    {loc}
                                                </span>
                                            ))
                                            : <span className="text-sm text-green-600 font-medium">{candidate.location}</span>
                                        }
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-gray-900 font-medium">
                                        {candidate.company}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills</h3>
                                    <div className="h-[200px] overflow-y-auto border border-gray-200 rounded-lg p-3">
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {candidate.skills}
                                        </p>
                                    </div>
                                </div>

                                <hr className="mb-4" />

                                <div className="flex flex-row-reverse items-center gap-3">
                                    <button
                                        onClick={() => handleApplyClick(candidate)}
                                        className="px-6 bg-black text-white py-1.5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {jdData.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </main>

            {showModal && selectedJob && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
                        >
                            <X size={22} />
                        </button>

                        <div className="p-6 space-y-5">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                                <div className="flex items-center text-red-600 text-sm font-medium">
                                    <MapPin size={16} className="mr-1" />
                                    {selectedJob.location}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Job Summary:</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {selectedJob.jobSummary || 'No job summary available.'}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Key Responsibilities:</h3>
                                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                    {selectedJob.responsibilities?.length > 0 ? (
                                        selectedJob.responsibilities.map((resp, idx) => (
                                            <li key={idx}>{resp}</li>
                                        ))
                                    ) : (
                                        <li>No responsibilities listed.</li>
                                    )}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Requirements:</h3>
                                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                    {selectedJob.requirements?.length > 0 ? (
                                        selectedJob.requirements.map((req, idx) => (
                                            <li key={idx}>{req}</li>
                                        ))
                                    ) : (
                                        <li>No requirements listed.</li>
                                    )}
                                </ul>
                            </div>

                            {selectedJob.benefits?.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Benefits:</h3>
                                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                        {selectedJob.benefits.map((benefit, idx) => (
                                            <li key={idx}>{benefit}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <hr />

                            <div className="pt-2 flex justify-center">
                                <button
                                    onClick={handleApplyFromModal}
                                    className="bg-black text-white font-medium py-2 px-16 rounded-lg transition hover:bg-gray-800 mx-auto"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllJDs;