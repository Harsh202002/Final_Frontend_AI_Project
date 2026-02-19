import { useEffect, useState } from "react";
import { Upload, FileText, Copy, Eye, Trash2, Filter, Search, Trash } from "lucide-react";
import Pagination from "../components/LandingPage/Pagination";
import ResumeSummary from "./ResumeSummary";
import { useNavigate, useLocation } from "react-router-dom";
import { baseUrl } from "../utils/ApiConstants";
import axios from "axios";

function JDDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const jdData = location.state?.jdData || null;
    // console.log(jdData);

    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [showResumeSummary, setShowResumeSummary] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const [currentPageTable1, setCurrentPageTable1] = useState(1);
    const itemsPerPageTable1 = 5;

    const [currentPageTable2, setCurrentPageTable2] = useState(1);
    const itemsPerPageTable2 = 5;

    const [pendingCandidates, setPendingCandidates] = useState([]);
    const [isFiltering, setIsFiltering] = useState(false);
    const [jdDetails, setJdDetails] = useState(jdData);

    useEffect(() => {
        const fetchCandidateAppliedJDs = async () => {
            try {
                const token = localStorage.getItem('token');
                const jdId = jdData?._id;

                if (!jdId) {
                    console.error('No JD ID available');
                    return;
                }

                const response = await axios.get(`${baseUrl}/jd/${jdId}/candidatess`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                console.log('Candidate applied JDs Data:', response.data);

                if (response.data.success) {
                    // Include new 'applied' status (set by backend) and legacy 'pending'
                    const pending = response.data.data.filter(
                        (candidate) => candidate.status === 'pending' || candidate.status === 'applied'
                    );
                    setPendingCandidates(pending);
                }

            } catch (error) {
                console.error('Error fetching JDs:', error);
            }
        };

        fetchCandidateAppliedJDs();
    }, [jdData?._id]);

    const handleFilterResumes = async () => {
        try {
            setIsFiltering(true);
            const token = localStorage.getItem('token');
            const jdId = jdDetails?._id;

            if (!jdId) {
                console.error('No JD ID available');
                alert('No JD ID available');
                return;
            }

            const response = await axios.post(
                `${baseUrl}/jd/${jdId}/filter-resumes`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log('Filter Resumes Response:', response.data);

            if (response.data.success) {
                const newlyProcessedIds = new Set([
                    ...response.data.filtered.map(f => f.id),
                    ...response.data.unfiltered.map(u => u.id)
                ]);

                setPendingCandidates(prevPending => {
                    const updated = prevPending.filter(pc => {
                        const possibleIds = [
                            pc.candidate,
                            pc._id,
                            pc.candidateId,
                            pc.candidate?._id,
                            pc.id
                        ].filter(Boolean);

                        const shouldRemove = possibleIds.some(id => newlyProcessedIds.has(id));
                        return !shouldRemove;
                    });
                    return updated;
                });

                setCurrentPageTable1(1);

                setJdDetails(prevJdDetails => {
                    const existingFilteredCandidates = [...(prevJdDetails?.filteredCandidates || [])];
                    const existingUnfilteredCandidates = [...(prevJdDetails?.unfilteredCandidates || [])];

                    const newFilteredCandidates = response.data.filtered.map(f => ({
                        candidate: f.id,
                        aiScore: f.score,
                        aiExplanation: f.explanation
                    }));

                    const newUnfilteredCandidates = response.data.unfiltered.map(u => ({
                        candidate: u.id,
                        aiScore: u.score,
                        aiExplanation: u.explanation
                    }));

                    const existingFilteredIds = new Set(existingFilteredCandidates.map(c => c.candidate));
                    const existingUnfilteredIds = new Set(existingUnfilteredCandidates.map(c => c.candidate));

                    const mergedFilteredCandidates = [
                        ...existingFilteredCandidates,
                        ...newFilteredCandidates.filter(c => !existingFilteredIds.has(c.candidate))
                    ];

                    const mergedUnfilteredCandidates = [
                        ...existingUnfilteredCandidates,
                        ...newUnfilteredCandidates.filter(c => !existingUnfilteredIds.has(c.candidate))
                    ];

                    const updatedAppliedCandidates = prevJdDetails.appliedCandidates.map(candidate => {
                        const candidateId = candidate.candidate;

                        if (newlyProcessedIds.has(candidateId)) {
                            const filteredData = response.data.filtered.find(f => f.id === candidateId);
                            const unfilteredData = response.data.unfiltered.find(u => u.id === candidateId);

                            if (filteredData) {
                                return {
                                    ...candidate,
                                    status: 'filtered',
                                    aiScore: filteredData.score,
                                    aiExplanation: filteredData.explanation
                                };
                            }

                            if (unfilteredData) {
                                return {
                                    ...candidate,
                                    status: 'unfiltered',
                                    aiScore: unfilteredData.score,
                                    aiExplanation: unfilteredData.explanation
                                };
                            }
                        }

                        return candidate;
                    });

                    return {
                        ...prevJdDetails,
                        filteredCandidates: mergedFilteredCandidates,
                        unfilteredCandidates: mergedUnfilteredCandidates,
                        appliedCandidates: updatedAppliedCandidates
                    };
                });

                setCurrentPageTable2(1);

                const userConfirmed = window.confirm('Comeback to check filtered candidates');
                if (userConfirmed) {
                    navigate(-1);
                }
            } else {
                alert('Filtering failed. Please try again.');
            }

        } catch (error) {
            console.error('Error filtering resumes:', error);
            alert('Error filtering resumes. Please try again.');
        } finally {
            setIsFiltering(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const appliedCandidates = jdDetails?.appliedCandidates || [];
    const filteredCandidatesList = jdDetails?.filteredCandidates || [];
    const unfilteredCandidatesList = jdDetails?.unfilteredCandidates || [];

    const filteredCandidateIds = new Set(filteredCandidatesList.map(fc => fc.candidate));

    const mappedCandidates = appliedCandidates.map((candidate) => {
        const isFiltered = filteredCandidateIds.has(candidate.candidate);
        const filteredInfo = filteredCandidatesList.find(fc => fc.candidate === candidate.candidate);
        const unfilteredInfo = unfilteredCandidatesList.find(uc => uc.candidate === candidate.candidate);

        return {
            id: candidate.candidate,
            name: candidate.name || 'N/A',
            email: candidate.email || 'N/A',
            phone: candidate.phone || 'N/A',
            resume: candidate.resume || '',
            isFiltered: isFiltered,
            experience: candidate.experience || 'N/A',
            aiScore: filteredInfo?.aiScore || unfilteredInfo?.aiScore || 0,
            aiExplanation: filteredInfo?.aiExplanation || unfilteredInfo?.aiExplanation || '',
            appliedAt: formatDate(candidate.appliedAt),
            isProcessed: !!filteredInfo || !!unfilteredInfo,
        };
    });

    const getFilteredData = () => {
        let data = mappedCandidates.filter(c => c.isProcessed);

        if (activeTab === "filtered") {
            data = data.filter(candidate => candidate.isFiltered === true);
        } else if (activeTab === "unfiltered") {
            data = data.filter(candidate => candidate.isFiltered === false);
        }

        if (searchTerm) {
            data = data.filter(candidate =>
                candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return data;
    };

    const filteredCandidates = getFilteredData();

    const filteredCount = mappedCandidates.filter(c => c.isFiltered === true && c.isProcessed).length;
    const unfilteredCount = mappedCandidates.filter(c => c.isFiltered === false && c.isProcessed).length;

    const totalPagesTable1 = Math.ceil(pendingCandidates.length / itemsPerPageTable1);
    const startIndexTable1 = (currentPageTable1 - 1) * itemsPerPageTable1;
    const endIndexTable1 = startIndexTable1 + itemsPerPageTable1;
    const currentDataTable1 = pendingCandidates.slice(startIndexTable1, endIndexTable1);

    const totalPagesTable2 = Math.ceil(filteredCandidates.length / itemsPerPageTable2);
    const startIndexTable2 = (currentPageTable2 - 1) * itemsPerPageTable2;
    const endIndexTable2 = startIndexTable2 + itemsPerPageTable2;
    const currentDataTable2 = filteredCandidates.slice(startIndexTable2, endIndexTable2);

    const handlePageChangeTable1 = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesTable1) {
            setCurrentPageTable1(newPage);
        }
    };

    const handlePageChangeTable2 = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesTable2) {
            setCurrentPageTable2(newPage);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPageTable2(1);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPageTable2(1);
    };

    const handleViewCandidate = (candidate) => {
        setSelectedCandidate(candidate);
        setShowResumeSummary(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                    JD Details Page
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 border border-gray-200 p-4 rounded-2xl shadow-md">
                    <div className="bg-white rounded-xl p-6 flex shadow-md border border-gray-200 flex-col items-center justify-center">

                        <p className="text-xs text-gray-500 mt-3 text-center">
                            You can only filter 20 resumes at a time!
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                            <FileText className="text-blue-500" size={24} />
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mb-1">{filteredCount}</p>
                        <p className="text-sm text-blue-600">Filtered Resume</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                            <FileText className="text-red-500" size={24} />
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mb-1">{unfilteredCount}</p>
                        <p className="text-sm text-red-600">Unfiltered Resume</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-300 p-4 md:p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Pending Candidates ({pendingCandidates.length})
                        </h2>
                        <button
                            onClick={handleFilterResumes}
                            disabled={isFiltering || pendingCandidates.length === 0}
                            className={`${isFiltering || pendingCandidates.length === 0
                                ? 'bg-purple-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700'
                                } text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}
                        >
                            <Filter size={18} className={isFiltering ? 'animate-spin' : ''} />
                            {isFiltering ? 'Filtering...' : 'Filter'}
                        </button>
                    </div>

                    <div className="overflow-x-auto border border-gray-200 shadow-md rounded-2xl">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-300">
                                    {/* <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        ID
                                    </th> */}
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        Candidate Name
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        Applied On
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        Phone
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        Email
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        Reallocate
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        Status
                                    </th>
                                    {/* <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        Action
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {currentDataTable1.length > 0 ? (
                                    currentDataTable1.map((candidate, index) => (
                                        <tr
                                            key={candidate._id || index}
                                            className="border-b border-gray-300 hover:bg-gray-50"
                                        >
                                            {/* <td className="py-4 px-4 text-sm text-gray-800">
                                                #{candidate._id?.slice(-6) || 'N/A'}
                                            </td> */}
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {candidate.name || candidate.candidate?.name || 'N/A'}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {candidate.appliedAt ? formatDate(candidate.appliedAt) : 'N/A'}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {candidate.phone || candidate.candidate?.phone || 'N/A'}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {candidate.email || candidate.candidate?.email || 'N/A'}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {candidate.reallocate ? 'Yes' : 'No'}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                                                    {candidate.status || 'Pending'}
                                                </span>
                                            </td>
                                            {/* <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    <button className="p-1.5 border border-red-300 rounded hover:bg-red-50">
                                                        <Trash2 size={16} className="text-red-600" />
                                                    </button>
                                                </div>
                                            </td> */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="py-8 text-center text-gray-500">
                                            No pending candidates found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {currentDataTable1.length > 0 && totalPagesTable1 > 1 && (
                            <Pagination
                                currentPage={currentPageTable1}
                                totalPages={totalPagesTable1}
                                onPageChange={handlePageChangeTable1}
                            />
                        )}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 shadow-md rounded-2xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mx-6 my-3">
                        <div className="flex items-center gap-6 flex-wrap">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleTabChange("all")}
                                    className={`pb-2 font-medium transition-all relative ${activeTab === "all"
                                        ? "text-gray-900"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    All ({filteredCount + unfilteredCount})
                                    {activeTab === "all" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleTabChange("filtered")}
                                    className={`pb-2 font-medium transition-all relative flex items-center gap-2 ${activeTab === "filtered"
                                        ? "text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    Filtered ({filteredCount})
                                    {activeTab === "filtered" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleTabChange("unfiltered")}
                                    className={`pb-2 font-medium transition-all relative flex items-center gap-2 ${activeTab === "unfiltered"
                                        ? "text-red-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    Unfiltered ({unfilteredCount})
                                    {activeTab === "unfiltered" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by Candidate Name"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full sm:w-64 pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black p-2 rounded-md">
                                    <Search size={16} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-gray-300 shadow-md">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-[#D9D9D94A]">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        Candidate Name
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        Email
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        Fitbit Score
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        Phone
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        Status
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDataTable2.length > 0 ? (
                                    currentDataTable2.map((candidate, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-300 hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-2 h-2 rounded-full ${candidate.isFiltered
                                                            ? "bg-blue-500"
                                                            : "bg-red-500"
                                                            }`}
                                                    ></div>
                                                    <span className="text-sm text-gray-800">
                                                        {candidate.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {candidate.email}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${candidate.aiScore >= 70
                                                    ? "bg-green-100 text-green-700"
                                                    : candidate.aiScore >= 40
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {candidate.aiScore}%
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {candidate.phone}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${candidate.isFiltered
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {candidate.isFiltered ? "Filtered" : "Unfiltered"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewCandidate(candidate)}
                                                        className="p-1.5 border border-blue-300 rounded hover:bg-blue-50"
                                                    >
                                                        <Eye size={16} className="text-blue-500" />
                                                    </button>
                                                    {/* <button className="p-1.5 border border-red-300 rounded hover:bg-red-50">
                                                        <Trash2 size={16} className="text-red-600" />
                                                    </button> */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-gray-500">
                                            No candidates found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {currentDataTable2.length > 0 && totalPagesTable2 > 1 && (
                            <Pagination
                                currentPage={currentPageTable2}
                                totalPages={totalPagesTable2}
                                onPageChange={handlePageChangeTable2}
                            />
                        )}
                    </div>

                    <div className="my-6 flex justify-center">
                        <button
                            onClick={() => {
                                const onlyFiltered = mappedCandidates.filter(c => c.isFiltered === true);
                                // Store filtered candidate IDs in localStorage
                                const filteredIds = onlyFiltered.map(c => c.id);
                                localStorage.setItem('filteredCandidateIds', JSON.stringify(filteredIds));
                                navigate("/RecruiterAdmin-Dashboard/JDDetails/GenerateAssessment", {
                                    state: {
                                        filteredCandidates: onlyFiltered,
                                        jdData: jdDetails
                                    }
                                });
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Generate Assessment
                        </button>
                    </div>
                </div>

                {showResumeSummary && (
                    <ResumeSummary
                        onClose={() => setShowResumeSummary(false)}
                        candidate={selectedCandidate}
                    />
                )}

            </div>
        </div>
    );
}

export default JDDetails;