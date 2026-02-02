import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  UserPlus,
  Building2,
  LogOut,
  X
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeNav, setActiveNav] = useState('');

  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/RecruiterManagement")) setActiveNav("RecruiterManagement");
    else if (path.includes("/RMGManagement")) setActiveNav("RMGManagement");
    else if (path.includes("/Tickets")) setActiveNav("RaiseTickets");
    else if (path.includes("/RaiseTickets")) setActiveNav("CreateTickets");
    else setActiveNav("Admin-Dashboard");

  }, [location.pathname]);

  const handleNavClick = (name, path) => {
    setActiveNav(name);
    navigate(path);
  };


  const handleLogout = () => {
    localStorage.removeItem('candidateToken');
    navigate('/Login');
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
                onClick={() => handleNavClick('Admin-Dashboard', '/Admin-Dashboard')}
                className={`flex w-full items-center space-x-3 py-2 px-7 rounded transition-colors 
                  ${activeNav === 'Admin-Dashboard' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
              >
                <Home size={20} />
                <span>Dashboard</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick('RecruiterManagement', '/Admin-Dashboard/RecruiterManagement')}
                className={`flex w-full items-center space-x-3 py-2 px-7 rounded transition-colors 
                  ${activeNav === 'RecruiterManagement' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
              >
                <UserPlus size={20} />
                <span>Recruiter Administration</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick('RMGManagement', '/Admin-Dashboard/RMGManagement')}
                className={`flex w-full items-center space-x-3 py-2 px-7 rounded transition-colors 
                  ${activeNav === 'RMGManagement' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
              >
                <UserPlus size={20} />
                <span>RMG Management</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick('RaiseTickets', '/Admin-Dashboard/Tickets')}
                className={`flex w-full items-center space-x-3 py-2 px-7 rounded transition-colors 
                  ${activeNav === 'RaiseTickets' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
              >
                <Building2 size={20} />
                <span>Raise Tickets</span>
              </button>
            </li>

            {/* <li>
              <button
                onClick={() => handleNavClick('CreateTickets', '/Admin-Dashboard/RaiseTickets')}
                className={`flex w-full items-center space-x-3 py-2 px-7 rounded transition-colors 
                  ${activeNav === 'CreateTickets' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
              >
                <Building2 size={20} />
                <span>Create Tickets</span>
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
