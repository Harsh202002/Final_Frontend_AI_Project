import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  UserPlus,
  Building2,
  LogOut,
  X,
  MessageSquare,
  Building
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeNav, setActiveNav] = useState('');

  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/EnquiryMessages")) setActiveNav("EnquiryMessages");
    else if (path.includes("/CompaniesRegister")) setActiveNav("RegisteredCompanies");
    // else if (path.includes("/Tickets")) setActiveNav("Tickets");
    else if (path.includes("/RejisteredRecruiters")) setActiveNav("RejisteredRecruiters");
    else if (path.includes("/Profile")) setActiveNav("Profile");
    else if (path.includes("/logout")) setActiveNav("Logout");
    else setActiveNav("Dashboard");

  }, [location.pathname]);

  const handleNavClick = (name, path) => {
    setActiveNav(name);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/SuperAdminLogin');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div
        className={`
          fixed left-0 top-0 h-screen bg-gray-900 text-white z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 w-64 flex flex-col
        `}
      >
        <div className="flex items-center justify-between py-6 px-7 border-b border-gray-700">
          <h1 className="text-xl font-bold">Recruter AI</h1>
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-gray-700 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="py-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">

            <li>
              <button
                onClick={() => handleNavClick('Dashboard', '/SuperAdmin-Dashboard')}
                className={`flex w-full items-center space-x-3 py-2 px-7 rounded transition-colors
                  ${activeNav === 'Dashboard' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
              >
                <Home size={20} />
                <span>Dashboard</span>
              </button>
            </li>
            
            <li>
              <button
                onClick={() => handleNavClick('EnquiryMessages', '/SuperAdmin-Dashboard/EnquiryMessages')}
                className={`flex w-full items-center space-x-3 py-2 px-7 rounded transition-colors
                  ${activeNav === 'EnquiryMessages' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
              >
                <MessageSquare size={20} />
                <span>Enquiry Messages</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick('RegisteredCompanies', '/SuperAdmin-Dashboard/CompaniesRegister')}
                className={`flex w-full items-center space-x-3 py-2 px-7 rounded transition-colors
                  ${activeNav === 'RegisteredCompanies' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
              >
                <Building size={20} />
                <span>Register Companies</span>
              </button>
            </li>

           

            {/* <li>
              <button
                onClick={() => handleNavClick('Tickets', '/SuperAdmin-Dashboard/Tickets')}
                className={`flex w-full items-center space-x-3 py-2 px-7 rounded transition-colors
                  ${activeNav === 'Tickets' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
              >
                <UserPlus size={20} />
                <span>Tickets</span>
              </button>
            </li> */}

            <li>
              <button
                onClick={() => handleNavClick('RejisteredRecruiters', '/SuperAdmin-Dashboard/RejisteredRecruiters')}
                className={`flex w-full items-center space-x-3 py-2 px-7 rounded transition-colors
                  ${activeNav === 'RejisteredRecruiters' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
              >
                <Building2 size={20} />
                <span>Recently Applied</span>
              </button>
            </li>

            {/* <li>
              <button
                onClick={() => handleNavClick('Profile', '/SuperAdmin-Dashboard/Profile')}
                className={`flex w-full items-center space-x-3 py-2 px-7 rounded transition-colors
                  ${activeNav === 'Profile' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
              >
                <Building2 size={20} />
                <span>Profile</span>
              </button>
            </li> */}

            <li>
              <button
                onClick={handleLogout}
                className={`flex w-full items-center space-x-3 py-2 px-7 rounded transition-colors
                  ${activeNav === 'Logout' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </li>

          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
