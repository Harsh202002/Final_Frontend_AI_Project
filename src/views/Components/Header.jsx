import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../img/logo.png';

export default function Header() {
  const [loginDropdown, setLoginDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Industries', path: '/industries' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0" onClick={() => navigate("/")}>
            <div className="h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-lg bg-gradient-to-br from-[#6338D9] to-[#2D1B69] flex items-center justify-center shadow-md">
               <img src={logo} alt="RecruterAI Logo" className="h-full w-full object-cover" />
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2D1B69]">
              RecruterAI
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-[15px] font-medium text-slate-700">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `relative pb-1 transition-all duration-200 hover:text-[#6338D9] ${
                    isActive 
                      ? 'text-[#6338D9] font-semibold ' 
                      : ''
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Login Buttons */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0">
            <div className="relative">
              <button
                className="rounded-full border-2 border-[#6338D9] px-5 py-2 text-sm font-semibold text-[#6338D9] transition-all duration-200 hover:bg-[#6338D9] hover:text-white"
                onClick={() => setLoginDropdown((v) => !v)}
                onBlur={() => setTimeout(() => setLoginDropdown(false), 150)}
              >
                Sign In
              </button>

              {loginDropdown && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white py-2 shadow-lg z-50">
                  <button
                    className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#F3E8FF] hover:text-[#6338D9]"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setLoginDropdown(false);
                      navigate("/login", { state: { role: "Admin" } });
                    }}
                  >
                    Admin
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#F3E8FF] hover:text-[#6338D9]"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setLoginDropdown(false);
                      navigate("/login", { state: { role: "RMG" } });
                    }}
                  >
                    RMG
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#F3E8FF] hover:text-[#6338D9]"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setLoginDropdown(false);
                      navigate("/login", { state: { role: "Recruiter" } });
                    }}
                  >
                    Recruiter
                  </button>
                </div>
              )}
            </div>

            <button
              className="rounded-full bg-gradient-to-r from-[#6338D9] to-[#522cb8] px-6 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              onClick={() => navigate("/CandidateLogin")}
            >
              Book a Demo
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 text-[#2D1B69]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileMenu
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white px-4 pb-6 lg:hidden">
            <div className="flex flex-col gap-4 pt-6 text-[15px] font-medium text-slate-700">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `transition-colors ${
                      isActive ? 'text-[#6338D9] font-semibold' : ''
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="mt-4 flex flex-col gap-3">
                <div className="relative">
                  <button
                    className="w-full rounded-full border-2 border-[#6338D9] py-2.5 text-sm font-semibold text-[#6338D9]"
                    onClick={() => setLoginDropdown((v) => !v)}
                  >
                    Sign In
                  </button>

                  {loginDropdown && (
                    <div className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                      <button
                        className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#F3E8FF] hover:text-[#6338D9]"
                        onClick={() => {
                          setLoginDropdown(false);
                          setMobileMenu(false);
                          navigate("/login", { state: { role: "Admin" } });
                        }}
                      >
                        Admin
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#F3E8FF] hover:text-[#6338D9]"
                        onClick={() => {
                          setLoginDropdown(false);
                          setMobileMenu(false);
                          navigate("/login", { state: { role: "RMG" } });
                        }}
                      >
                        RMG
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#F3E8FF] hover:text-[#6338D9]"
                        onClick={() => {
                          setLoginDropdown(false);
                          setMobileMenu(false);
                          navigate("/login", { state: { role: "Recruiter" } });
                        }}
                      >
                        Recruiter
                      </button>
                    </div>
                  )}
                </div>
                
                <button
                  className="rounded-full bg-gradient-to-r from-[#6338D9] to-[#522cb8] py-3 text-sm font-semibold text-white"
                  onClick={() => {
                    setMobileMenu(false);
                    navigate("/CandidateLogin");
                  }}
                >
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
