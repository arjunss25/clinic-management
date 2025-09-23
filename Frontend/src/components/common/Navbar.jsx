import React, { useState } from 'react';
import { HiBell, HiChevronDown, HiCog6Tooth, HiUser, HiArrowRightOnRectangle, HiEllipsisVertical, HiBars3 } from 'react-icons/hi2';
import { FaBell } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navigationConfig } from '../../config/navigation';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

const Navbar = ({ role = 'patient', userName = 'John Doe' }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const location = useLocation();
  const navItems = navigationConfig[role] || [];

  const notifications = [
    { 
      id: 1, 
      title: 'Appointment Reminder', 
      message: 'Your appointment with Dr. Smith is scheduled for tomorrow at 2:00 PM. Please arrive 15 minutes early.',
      time: '2 min ago', 
      unread: true,
      type: 'appointment'
    },
    { 
      id: 2, 
      title: 'Lab Results Available', 
      message: 'Your blood test results from last week are now available in your patient portal.',
      time: '1 hour ago', 
      unread: true,
      type: 'results'
    },
    { 
      id: 3, 
      title: 'Prescription Update', 
      message: 'Dr. Johnson has updated your prescription. New medication is ready for pickup.',
      time: '3 hours ago', 
      unread: false,
      type: 'prescription'
    },
  ];

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if logout API fails
      navigate('/login');
    }
  };

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname.startsWith(path);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'appointment':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'results':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01.293.707V12a1 1 0 102 0V9a1 1 0 01.293-.707L13.586 6H12a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293A1 1 0 0112 9v3a3 3 0 11-6 0V9a1 1 0 01.293-.707L8.586 6H7a1 1 0 01-1-1V4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 relative z-50">
        <div className="max-w-full mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Left Section - Menu Icon and Page Context */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                className="lg:hidden p-2 rounded-xl bg-white border border-[#E9DFC3] text-[#0118D8] hover:bg-[#FFF8F8] transition-colors hover:bg-[#E9DFC3] transform duration-200"
                aria-label="Toggle mobile menu"
              >
                <HiBars3 className="w-5 h-5" />
              </button>
            </div>
            
            {/* Right Section - Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications - Updated Button Style */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="px-4 py-2 bg-white border border-[#E9DFC3] rounded-xl text-[#0118D8] hover:bg-[#FFF8F8] transition-colors flex items-center gap-2 hover:bg-[#E9DFC3] transform duration-200"
                >
                  <FaBell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notifications</span>
                  {notificationCount > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Enhanced Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    {/* Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-[#0118D8]/5 to-[#1B56FD]/5 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{notificationCount} unread messages</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-xs text-[#0118D8] hover:text-[#1B56FD] font-medium px-3 py-1 rounded-md hover:bg-white/50 transition-colors">
                            Mark all read
                          </button>
                          <button 
                            onClick={() => setShowNotifications(false)}
                            className="text-xs text-gray-500 hover:text-gray-700 font-medium px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                            aria-label="Close notifications"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification, index) => (
                        <div
                          key={notification.id}
                          className={`px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer group ${
                            index !== notifications.length - 1 ? 'border-b border-gray-50' : ''
                          } ${notification.unread ? 'bg-[#0118D8]/5' : ''}`}
                        >
                          <div className="flex items-start space-x-4">
                            {/* Icon */}
                            {getNotificationIcon(notification.type)}
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#0118D8] transition-colors">
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-[#1B56FD] rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 leading-relaxed pr-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-3">
                                <p className="text-xs text-gray-400 font-medium">{notification.time}</p>
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <HiEllipsisVertical className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                      <button className="w-full text-sm text-[#0118D8] hover:text-[#1B56FD] font-medium py-2 hover:bg-white/50 rounded-lg transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-br hover:from-[#E9DFC3] hover:to-[#E9DFC3]/20 rounded-xl transition-all duration-200 group"
                >
                  <div className="relative">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0118D8] to-[#1B56FD] flex items-center justify-center shadow-lg ring-2 ring-white/20">
                      <span className="text-sm font-bold text-white">
                        {userName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#0118D8] transition-colors">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize font-medium">{role}</p>
                  </div>
                  <HiChevronDown className={`h-4 w-4 text-gray-400 transition-all duration-200 group-hover:text-[#0118D8] ${
                    showProfileDropdown ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Enhanced Profile Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    {/* Profile Header */}
                    <div className="px-6 py-5 bg-gradient-to-br from-[#0118D8]/10 to-[#1B56FD]/10 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0118D8] to-[#1B56FD] flex items-center justify-center shadow-lg">
                            <span className="text-lg font-bold text-white">
                              {userName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-gray-900">{userName}</p>
                          <p className="text-sm text-gray-600 capitalize">{role}</p>
                          <p className="text-xs text-gray-500 mt-1">{role}@carenexus.com</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to={`/${role}/profile`}
                        onClick={() => setShowProfileDropdown(false)}
                        className="w-full flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#0118D8]/5 hover:to-transparent hover:text-[#0118D8] transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-gray-100 group-hover:bg-[#0118D8]/10 rounded-lg flex items-center justify-center mr-3 transition-colors">
                          <HiUser className="h-4 w-4 text-gray-500 group-hover:text-[#0118D8]" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">My Profile</p>
                          <p className="text-xs text-gray-500">View and edit profile</p>
                        </div>
                      </Link>
                      <button className="w-full flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#0118D8]/5 hover:to-transparent hover:text-[#0118D8] transition-all duration-200 group">
                        <div className="w-8 h-8 bg-gray-100 group-hover:bg-[#0118D8]/10 rounded-lg flex items-center justify-center mr-3 transition-colors">
                          <HiCog6Tooth className="h-4 w-4 text-gray-500 group-hover:text-[#0118D8]" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Settings</p>
                          <p className="text-xs text-gray-500">Preferences and privacy</p>
                        </div>
                      </button>
                    </div>
                    
                    {/* Logout */}
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-6 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center mr-3 transition-colors">
                          <HiArrowRightOnRectangle className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Sign Out</p>
                          <p className="text-xs text-red-500">Logout from account</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop for dropdowns */}
        {(showProfileDropdown || showNotifications) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowProfileDropdown(false);
              setShowNotifications(false);
            }}
          />
        )}
      </nav>

      {/* Mobile Sidebar */}
      {showMobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/10 transition-opacity"
            onClick={() => setShowMobileSidebar(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-white to-[#E9DFC3]/40">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0118D8] to-[#1B56FD] shadow-lg">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFF8F8"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="10" fill="#FFF8F8" opacity="0.18" />
                    <path
                      d="M11.99 7V17M17 12H7"
                      stroke="#0118D8"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#0118D8] to-[#1B56FD] text-transparent bg-clip-text">
                    CareNexus
                  </h1>
                  <p className="text-xs mt-0.5 text-[#1B56FD] font-semibold capitalize tracking-wider">{role} portal</p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  
                  return (
                    <div key={item.path || item.name}>
                      {hasSubItems ? (
                        // Navigation item with sub-items
                        <div>
                          <div className="relative group">
                            <div
                              className={`
                                flex items-center rounded-xl w-full min-h-[48px]
                                px-4 py-3
                                text-sm font-medium transition-all duration-300
                                ${active
                                  ? 'bg-[#0118D8]/10 text-[#0118D8] shadow-sm'
                                  : 'text-gray-600 hover:bg-gray-50/80 hover:text-[#0118D8] hover:shadow-sm'
                                }
                              `}
                            >
                              <span
                                className={
                                  'flex items-center justify-center w-7 h-7 transition-colors duration-300 ' +
                                  (active
                                    ? 'text-[#0118D8] scale-110'
                                    : 'text-gray-400 group-hover:text-[#1B56FD] group-hover:scale-105')
                                }
                              >
                                {item.icon && <item.icon className="w-5 h-5" />}
                              </span>
                              <span className="ml-3">{item.name}</span>
                            </div>
                            
                            {/* Sub-items */}
                            {hasSubItems && (
                              <div className="ml-4 mt-2 space-y-1">
                                {item.subItems.map((subItem) => {
                                  const subActive = location.pathname.startsWith(subItem.path);
                                  return (
                                    <Link
                                      key={subItem.path}
                                      to={subItem.path}
                                      onClick={() => setShowMobileSidebar(false)}
                                      className="relative group flex items-center"
                                    >
                                      <div
                                        className={`
                                          flex items-center rounded-lg w-full min-h-[40px]
                                          px-4 py-2
                                          text-sm font-medium transition-all duration-300
                                          ${subActive
                                            ? 'bg-[#0118D8]/10 text-[#0118D8] shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50/80 hover:text-[#0118D8] hover:shadow-sm'
                                          }
                                        `}
                                      >
                                        <span className="ml-3">{subItem.name}</span>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        // Regular navigation item
                        <Link
                          to={item.path}
                          onClick={() => setShowMobileSidebar(false)}
                          className="relative group flex items-center"
                        >
                          <div
                            className={`
                              flex items-center rounded-xl w-full min-h-[48px]
                              px-4 py-3
                              text-sm font-medium transition-all duration-300
                              ${active
                                ? 'bg-[#0118D8]/10 text-[#0118D8] shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50/80 hover:text-[#0118D8] hover:shadow-sm'
                              }
                            `}
                          >
                            <span
                              className={
                                'flex items-center justify-center w-7 h-7 transition-colors duration-300 ' +
                                (active
                                  ? 'text-[#0118D8] scale-110'
                                  : 'text-gray-400 group-hover:text-[#1B56FD] group-hover:scale-105')
                              }
                            >
                              {item.icon && <item.icon className="w-5 h-5" />}
                            </span>
                            <span className="ml-3">{item.name}</span>
                          </div>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
