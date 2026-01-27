import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Ticket, Clock, FileCheck, Trash2, ChevronDown } from 'lucide-react';
import axios from 'axios';
import Pagination from '../../components/LandingPage/Pagination';
import SupportTicketDetail from '../Components/SupportTicketsDetail';
import { baseUrl } from '../../utils/ApiConstants';

const Tickets = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchId, setSearchId] = useState('');
    const [allTickets, setAllTickets] = useState([]);

    const stats = [
        { icon: Ticket, label: 'Total Tickets', value: '4004', bgColor: 'bg-blue-100', iconColor: 'text-blue-500' },
        { icon: Clock, label: 'Pending Tickets', value: '4124', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-500' },
        { icon: FileCheck, label: 'Closed Tickets', value: '2487', bgColor: 'bg-green-100', iconColor: 'text-green-500' },
        { icon: Trash2, label: 'Resolved Tickets', value: '5487', bgColor: 'bg-red-100', iconColor: 'text-red-500' },
    ];

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await axios.get(`${baseUrl}/tickets/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                console.log("hii", res.data);
                
                
                if (res.data.success && res.data.tickets) {
                    const mappedTickets = res.data.tickets.map(ticket => ({
                        id: `#${ticket._id.slice(-5)}`,
                        reporter: ticket.raisedBy?.name || 'NA',
                        avatar: '',
                        subject: ticket.subject,
                        status: ticket.status,
                        startDate: new Date(ticket.createdAt).toLocaleDateString('en-GB').replace(/\//g, '.'),
                        dueDate: new Date(ticket.updatedAt).toLocaleDateString('en-GB').replace(/\//g, '.'),
                        role: ticket.role || ticket.raisedBy?.role || 'N/A',
                        priority: ticket.priority,
                        description: ticket.description,
                        email: ticket.raisedBy?.email || '',
                        assignedTo: ticket.assignedTo,
                        _id: ticket._id,
                        raisedBy: ticket.raisedBy
                    }));
                    setAllTickets(mappedTickets);
                    console.log('Mapped tickets:', mappedTickets);
                }
            } catch (error) {
                console.log('Error fetching tickets:', error);
            }
        }

        fetchTickets();
    }, [])


    const filteredTickets = useMemo(() => {
    let filtered = allTickets;

    if (activeTab === 'Pending') {
        filtered = filtered.filter(ticket => ticket.status === 'Open');
    } else if (activeTab === 'Closed') {
        filtered = filtered.filter(ticket => ticket.status === 'Closed');
    } else if (activeTab === 'Resolved') {
        filtered = filtered.filter(ticket => ticket.status === 'Resolved');
    }

    if (searchId) {
        filtered = filtered.filter(ticket =>
            ticket.id.toLowerCase().includes(searchId.toLowerCase())
        );
    }

    // Reverse to show latest first
    return [...filtered].reverse();
}, [activeTab, searchId, allTickets]);

    const itemsPerPage = 7;
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const paginatedTickets = filteredTickets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const calculatedStats = useMemo(() => {
        const pending = allTickets.filter(t => t.status === 'Open').length;
        const closed = allTickets.filter(t => t.status === 'Closed').length;
        const resolved = allTickets.filter(t => t.status === 'Resolved').length;

        return {
            total: allTickets.length,
            pending,
            closed,
            resolved
        };
    }, [allTickets]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open':
                return 'bg-yellow-100 text-yellow-600';
            case 'Closed':
                return 'bg-green-100 text-green-600';
            case 'Resolved':
                return 'bg-blue-100 text-blue-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, index) => {
                        const StatIcon = stat.icon;
                        let value = stat.value;
                        if (stat.label === 'Total Tickets') value = calculatedStats.total;
                        else if (stat.label === 'Pending Tickets') value = calculatedStats.pending;
                        else if (stat.label === 'Closed Tickets') value = calculatedStats.closed;
                        else if (stat.label === 'Resolved Tickets') value = calculatedStats.resolved;

                        return (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                                        <StatIcon className={`w-6 h-6 ${stat.iconColor}`} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{value}</div>
                                        <div className="text-sm text-gray-500">{stat.label}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search by ID"
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                                {/* <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <SlidersHorizontal className="w-5 h-5" />
                                    <span>Filters</span>
                                </button> */}
                            </div>
                        </div>

                        <div className="flex gap-6 px-4 border-b border-gray-200 overflow-x-auto">
                            <button
                                onClick={() => handleTabChange('All')}
                                className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'All' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                All ({calculatedStats.total})
                            </button>
                            <button
                                onClick={() => handleTabChange('Pending')}
                                className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'Pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                Pending ({calculatedStats.pending})
                            </button>
                            <button
                                onClick={() => handleTabChange('Closed')}
                                className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'Closed' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                Closed ({calculatedStats.closed})
                            </button>
                            <button
                                onClick={() => handleTabChange('Resolved')}
                                className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'Resolved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                Resolved ({calculatedStats.resolved})
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.No.</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th> */}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedTickets.length > 0 ? (
                                        paginatedTickets.map((ticket, index) => (
                                            <tr
                                                key={`${ticket.id}-${index}`}
                                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => setSelectedTicket(ticket)}
                                            >
                                                <td className="px-4 py-4 text-sm text-gray-900">{(currentPage - 1) * itemsPerPage + index + 1}.</td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                                                            {getInitials(ticket.reporter)}
                                                        </div>
                                                        <span className="text-sm text-gray-900 hidden sm:inline">{ticket.reporter}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">{ticket.role}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">{ticket.subject}</td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                            {ticket.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500">{ticket.startDate}</td>
                                                <td className="px-4 py-4 text-sm text-gray-500">{ticket.dueDate}</td>
                                                {/* <td className="px-4 py-4">
                                                    <button
                                                        className="p-1 rounded-sm hover:bg-red-100 transition-colors group border border-red-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </td> */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                                No tickets found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>

                    <SupportTicketDetail
                        selectedTicket={selectedTicket} 
                        getStatusColor={getStatusColor}
                    />
                </div>
            </div>
        </div>
    );
};

export default Tickets;