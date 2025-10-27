import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-container') && !event.target.closest('.mobile-menu-dropdown')) {
        setMobileMenuOpen(false);
      }
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen, showProfileMenu]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      default:
        return '/patient/dashboard';
    }
  };

  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      {
        to: getDashboardLink(),
        label: 'Dashboard',
        icon: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-8l3-4M4.93 10.93A9 9 0 0 1 12 5'
      }
    ];

    if (user.role === 'patient') {
      return [
        ...baseItems,
        { to: '/patient/appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { to: '/patient/records', label: 'Records', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      ];
    }

    if (user.role === 'doctor') {
      return [
        ...baseItems,
        { to: '/doctor/appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { to: '/doctor/patients', label: 'Patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
      ];
    }

    if (user.role === 'admin') {
      return [
        ...baseItems,
        { to: '/admin/doctor-approvals', label: 'Doctor Approvals', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
      ];
    }

    return baseItems;
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand - Left */}
          <div className="flex items-center">
            <Link to={getDashboardLink()} className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                HealthCare
              </span>
            </Link>
          </div>

          {/* Desktop Navigation & Profile - Right Side */}
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {/* Nav Links */}
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${isActiveLink(item.to)
                      ? 'bg-sky-100 text-sky-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-sky-600'
                    }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* User Profile */}
              <div className="relative profile-menu-container ml-2">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-semibold capitalize">
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          {user && (
            <div className="md:hidden flex items-center mobile-menu-container">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-xl mobile-menu-dropdown">
          <div className="px-4 pt-4 pb-3 space-y-1">
            {/* User Info on Mobile */}
            <div className="flex items-center px-3 py-3 mb-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md mr-3">
                <span className="text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>

            {/* Mobile Nav Links */}
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-3 py-3 rounded-lg font-medium transition-all ${isActiveLink(item.to)
                    ? 'bg-sky-100 text-sky-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
              </Link>
            ))}

            {/* Mobile Logout */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition font-medium shadow-md"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
