import React, { useEffect, useState } from 'react';
import {
  Search,
  MoreHorizontal,
  TrendingUp,
  Eye,
  Trash2
} from 'lucide-react';
import Pagination from '../components/LandingPage/Pagination';
import { useNavigate } from 'react-router-dom';
import { superAdminBaseUrl } from '../utils/ApiConstants';
import axios from 'axios';

function Companies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [companies, setCompanies] = useState([]);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  const filteredData = companies.filter(company =>
    company.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchTotalCompanies();
  }, []);

  const fetchTotalCompanies = async () => {
    try {
      const response = await axios.get(`${superAdminBaseUrl}/company/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = response.data.companies;
      console.log(data);


      const mapped = data.map((item) => ({
        id: item._id,
        name: item.companyName,
        logo: item.logo,
        email: item.email,
        address1: item.address1,
        address2: item.address2,
        city: item.city,
        state: item.state,
        phoneNo: item.phoneNo,
        gstNumber: item.gstNumber,
        panNumber: item.panNumber,
        numberOfEmployees: item.numberOfEmployees,
        registration: item.registrationDate || "N/A",
        booking: item.bookingDate || "N/A",
        validTill: item.validTill || "N/A",
        freeTrial: item.freeTrial || "N/A"
      }));

      setCompanies(mapped);

    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen">
      <div className="space-y-6">

        {/* Total Companies Card */}
        <div className="flex flex-col">
          <div className="bg-white rounded-xl w-full sm:w-[450px] shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Total Companies</h2>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-end gap-4">
              <span className="text-4xl font-bold text-gray-900">{companies.length}</span>
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-md mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">12.50%</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 flex justify-end">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Company Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full shadow-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="shadow-sm border border-gray-200 rounded-3xl overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-100 border border-gray-200 rounded-3xl">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Company Name</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Registration</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Booking</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Valid Till</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Free Trial</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((company, index) => (
                <tr
                  key={company.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">

                      {/* Company Logo */}
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt="logo"
                          className="w-10 h-10 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {company.name?.charAt(0)}
                          </span>
                        </div>
                      )}

                      <span className="font-medium text-gray-900">{company.name}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-gray-600">{company.registration}</td>
                  <td className="py-4 px-6 text-gray-600">{company.booking}</td>
                  <td className="py-4 px-6 text-gray-600">{company.validTill}</td>
                  <td className="py-4 px-6 text-gray-600">{company.freeTrial}</td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">

                      <button
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors">
                        Alert
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Companies;
