import axios from 'axios';
import { Search, Filter, Edit, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Pagination from '../components/LandingPage/Pagination';
import { superAdminBaseUrl } from '../utils/ApiConstants';

function EnquiryMessages() {
    const [currentPage, setCurrentPage] = useState(1);
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('Ok, we will look on this issue as soon as possible.');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [sending, setSending] = useState(false);

    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        const fetchTotalEnquiry = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${superAdminBaseUrl}/enquiry/all`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = response.data;
                console.log(data);

                if (data.status === 'success' && data.data) {
                    setTickets(data.data);
                    setFilteredTickets(data.data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Fetch error:", error);
                setLoading(false);
            }
        };

        fetchTotalEnquiry();
    }, []);

    const handleEditClick = (ticket) => {
        setSelectedTicket(ticket);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedTicket(null);
        setPopupMessage('Ok, we will look on this issue as soon as possible.');
    };

    const handleSaveMessage = () => {
        if (!selectedTicket) return;

        console.log('Message saved:', popupMessage);
        setShowPopup(false);
        setSelectedTicket(null);
        setPopupMessage('Ok, we will look on this issue as soon as possible.');
    };

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setFilteredTickets(tickets);
        } else {
            const filtered = tickets.filter(ticket => {
                const idMatch = ticket._id && ticket._id.toLowerCase().includes(searchTerm.toLowerCase());
                const emailMatch = ticket.emailid && ticket.emailid.toLowerCase().includes(searchTerm.toLowerCase());
                return idMatch || emailMatch;
            });
            setFilteredTickets(filtered);
        }
        setCurrentPage(1);
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            setFilteredTickets(tickets);
        } else {
            const filtered = tickets.filter(ticket => {
                const idMatch = ticket._id && ticket._id.toLowerCase().includes(value.toLowerCase());
                const emailMatch = ticket.emailid && ticket.emailid.toLowerCase().includes(value.toLowerCase());
                return idMatch || emailMatch;
            });
            setFilteredTickets(filtered);
        }
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const stats = [
        { label: 'Total Messages', value: tickets.length || '0', icon: '📧', bgColor: 'bg-blue-100', iconColor: 'text-blue-500' },
        { label: 'Closed Messages', value: 'NA', icon: '✅', bgColor: 'bg-green-100', iconColor: 'text-green-500' },
        { label: 'Pending Messages', value: 'NA', icon: '⏱️', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-500' },
        { label: 'Deleted Messages', value: 'NA', icon: '🗑️', bgColor: 'bg-red-100', iconColor: 'text-red-500' }
    ];

    const getFieldValue = (value) => {
        return value || 'NA';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'NA';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getInitials = (name) => {
        if (!name) return 'NA';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Tickets</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-300 shadow-sm p-5 flex items-center space-x-4">
                            <div className={`${stat.bgColor} p-3 rounded-[50%]`}>
                                <span className="text-2xl">{stat.icon}</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search by ID or Email"
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-4 pr-10 py-2 shadow-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white p-2 rounded-md hover:bg-gray-800"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 shadow-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th> */}
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : currentItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            No tickets found
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map((ticket, index) => (
                                        <tr key={ticket._id || index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {indexOfFirstItem + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                                                        {getInitials(ticket.companyName)}
                                                    </div>
                                                    <span className="ml-3 text-sm text-gray-900">
                                                        {getFieldValue(ticket.companyName)}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {getFieldValue(ticket.emailid)}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {getFieldValue(ticket.phone)}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                                {getFieldValue(ticket.message)}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(ticket.createdAt)}
                                            </td>

                                            {/* Actions */}
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleEditClick(ticket)} className="text-blue-600 hover:text-blue-800">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-800">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td> */}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {!loading && filteredTickets.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            {showPopup && (
                <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Notification</h3>
                            <button
                                onClick={handleClosePopup}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <textarea
                            value={popupMessage}
                            onChange={(e) => setPopupMessage(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows="4"
                            placeholder="Enter your message..."
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleClosePopup}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                disabled={sending}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveMessage}
                                disabled={sending}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                            >
                                {sending ? 'Sending...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EnquiryMessages;