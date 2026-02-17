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
  
  const NavItem = ({ name, path, icon: Icon, label }) => {
    const isActive = activeNav === name;

    return (
      <li>
        <button
          onClick={() => handleNavClick(name, path)}
          className={`
            relative flex w-full items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 font-medium
            ${isActive ? 'bg-white text-[#8b21de] shadow-sm' : 'text-white hover:bg-white/20'}
          `}
        >
          {isActive && (
            <div className="absolute left-[-16px] top-0 h-full w-1 bg-white rounded-r-md" />
          )}

          <Icon size={20} />
          <span>{label}</span>
        </button>
      </li>
    );
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
          fixed left-0 top-0 h-screen bg-gradient-to-b from-[#9A31BD] to-[#250B52] text-white z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 w-64 flex flex-col shadow-xl rounded-xl ml-1 my-1
        `}
      >
        <div className="flex items-center justify-between pb-8 py-4 px-6">
          <div className='w-full text-center'>
            <h1 className="text-3xl font-bold tracking-wide">RecruterAI</h1>
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-white/20 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4">
          <ul className="space-y-2">

            <NavItem
              name="Dashboard"
              path="/SuperAdmin-Dashboard"
              icon={Home}
              label="Dashboard"
            />

            <NavItem
              name="EnquiryMessages"
              path="/SuperAdmin-Dashboard/EnquiryMessages"
              icon={MessageSquare}
              label="Enquiry Messages"
            />

            <NavItem
              name="RegisteredCompanies"
              path="/SuperAdmin-Dashboard/CompaniesRegister"
              icon={Building}
              label="Register Companies"
            />

            {/* <NavItem name="Tickets" ... /> */}

            <NavItem
              name="RejisteredRecruiters"
              path="/SuperAdmin-Dashboard/RejisteredRecruiters"
              icon={Building2}
              label="Recently Applied"
            />

            {/* <NavItem name="Profile" ... /> */}

            <li>
              <button
                onClick={handleLogout}
                className={`flex w-full items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 font-medium text-white hover:bg-white/20`}
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