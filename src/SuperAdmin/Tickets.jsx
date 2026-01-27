import { Search, Filter, CreditCard as Edit2, Trash2, Edit, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Pagination from '../components/LandingPage/Pagination';
import axios from 'axios';
import { superAdminBaseUrl } from '../utils/ApiConstants';

function Tickets() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Total Tickets', value: '0', icon: '🎫', bgColor: 'bg-blue-100', iconColor: 'text-blue-500' },
    { label: 'Pending Tickets', value: '0', icon: '⏱️', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-500' },
    { label: 'Closed Tickets', value: '0', icon: '✅', bgColor: 'bg-green-100', iconColor: 'text-green-500' },
    { label: 'Deleted Tickets', value: '0', icon: '🗑️', bgColor: 'bg-red-100', iconColor: 'text-red-500' }
  ]);

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${superAdminBaseUrl}/superAdmin/allTickets`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        console.log(response.data);

        const ticketsData = response.data.tickets;

        const mappedTickets = ticketsData.map((ticket) => ({
          id: `#${ticket._id.slice(-6)}`,
          fullId: ticket._id,
          requestedBy: {
            name: ticket.adminName
          },
          subject: ticket.subject,
          priority: 'High',
          status: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1),
          startDate: new Date(ticket.createdAt).toLocaleDateString('en-GB').replace(/\//g, '.'),
        }));

        setTickets(mappedTickets);

        const totalTickets = ticketsData.length;
        const pendingTickets = ticketsData.filter(t => t.status === 'open').length;
        const closedTickets = ticketsData.filter(t => t.status === 'closed').length;
        const deletedTickets = ticketsData.filter(t => t.status === 'deleted').length;

        setStats([
          { label: 'Total Tickets', value: totalTickets.toString(), icon: '🎫', bgColor: 'bg-blue-100', iconColor: 'text-blue-500' },
          { label: 'Pending Tickets', value: pendingTickets.toString(), icon: '⏱️', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-500' },
          { label: 'Closed Tickets', value: closedTickets.toString(), icon: '✅', bgColor: 'bg-green-100', iconColor: 'text-green-500' },
          { label: 'Deleted Tickets', value: deletedTickets.toString(), icon: '🗑️', bgColor: 'bg-red-100', iconColor: 'text-red-500' }
        ]);

      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [])

  const itemsPerPage = 5;
  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tickets.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'High': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Open'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-200 text-gray-700';
  };

  const handleEditClick = (ticketFullId) => {
    setSelectedTicketId(ticketFullId);
    setReplyMessage('');
    setIsReplyModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsReplyModalOpen(false);
    setSelectedTicketId(null);
    setReplyMessage('');
  };

  const handleSubmitReply = async () => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${superAdminBaseUrl}/superadmin/reply-to-ticket/${selectedTicketId}`,
        { message: replyMessage },
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      console.log('Reply sent successfully:', response.data);
      alert('Reply sent successfully!');
      handleCloseModal();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                placeholder="Search by ID"
                className="w-full pl-4 pr-10 py-2 shadow-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white p-2 rounded-md hover:bg-gray-800">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested by</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th> */}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((ticket, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                          {ticket.requestedBy.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-3 text-sm text-gray-900">{ticket.requestedBy.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.startDate}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditClick(ticket.fullId)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>

        {tickets.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {isReplyModalOpen && (
        <div className="fixed inset-0 bg-black/50 background-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Reply to Ticket</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Enter your reply message..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReply}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tickets;