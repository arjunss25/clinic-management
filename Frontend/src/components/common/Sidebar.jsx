import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigationConfig } from '../../config/navigation';
import { HiChevronLeft, HiChevronRight, HiChevronDown } from 'react-icons/hi2';

const PRODUCT_NAME = 'CareNexus'; // Example product name

const Sidebar = ({ role = 'patient' }) => {
  const location = useLocation();
  const navItems = navigationConfig[role] || [];
  const [hoveredItem, setHoveredItem] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState(() => {
    // Auto-expand parent items if any of their sub-items are active
    const initialExpanded = {};
    navItems.forEach(item => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some(subItem => location.pathname.startsWith(subItem.path));
        if (hasActiveSubItem) {
          initialExpanded[item.name] = true;
        }
      }
    });
    return initialExpanded;
  });

  const isActive = (path, itemName) => {
    if (!path) {
      // For items without a path (like parent items with sub-items), check if any sub-item is active
      const item = navItems.find(item => item.name === itemName);
      if (item && item.subItems) {
        return item.subItems.some(subItem => {
          // Check if current path starts with sub-item path (for routes with parameters)
          return location.pathname.startsWith(subItem.path);
        });
      }
      return false;
    }
    
    if (path === `/${role}`) {
      return location.pathname === path;
    }
    // Check if the current path starts with the item path or if it's a sub-item
    const isPathActive = location.pathname.startsWith(path);
    const hasSubItems = navItems.find(item => item.path === path)?.subItems;
    
    if (hasSubItems) {
      // For items with sub-items, check if current path matches any sub-item path
      return isPathActive || hasSubItems.some(subItem => {
        // Check if current path starts with sub-item path (for routes with parameters)
        return location.pathname.startsWith(subItem.path);
      });
    }
    
    return isPathActive;
  };

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } min-h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative z-100 hidden lg:block`}
    >
      {/* Collapse Button - Positioned outside the header */}
      <button
        className={`
          absolute top-6 z-10 p-1.5 
          rounded-full bg-[#FFF8F8] hover:bg-[#E9DFC3]/80 transition-all duration-200
          border-2 border-[#E9DFC3] shadow-sm hover:shadow-md
          ${collapsed ? '-right-4' : '-right-4'}
        `}
        aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsed ? (
          <HiChevronRight className="w-4 h-4 text-[#0118D8]" />
        ) : (
          <HiChevronLeft className="w-4 h-4 text-[#0118D8]" />
        )}
      </button>

      {/* Header */}
      <div className={`border-b border-gray-50 bg-gradient-to-r from-white to-[#E9DFC3]/40 flex items-center px-4 py-5 ${
        collapsed ? 'justify-center' : ''
      }`}>
        {/* Product Logo & Name */}
        <div className="flex items-center space-x-3">
          {/* Logo */}
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
          {/* Product Name & Role */}
          {!collapsed && (
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#0118D8] to-[#1B56FD] text-transparent bg-clip-text drop-shadow">
                {PRODUCT_NAME}
              </h1>
              <p className="text-xs mt-0.5 text-[#1B56FD] font-semibold capitalize tracking-wider">{role} portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6">
        <div className="space-y-1">
          {navItems.map((item, index) => {
            const active = isActive(item.path, item.name);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedItems[item.name];
            
            return (
              <div key={item.path || item.name}>
                {hasSubItems ? (
                  // Navigation item with sub-items
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className="relative group flex items-center w-full"
                      onMouseEnter={() => setHoveredItem(index)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {/* Active indicator */}
                      <span
                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#0118D8] transition-all duration-300 ${
                          active ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      <div
                        className={`
                          flex items-center rounded-xl w-full min-h-[48px]
                          px-0 ${collapsed ? 'justify-center' : 'px-4'}
                          py-3
                          text-sm font-medium transition-all duration-300
                          ${active
                            ? 'bg-[#0118D8]/10 text-[#0118D8] shadow-sm'
                            : `text-gray-600 hover:bg-gray-50/80 hover:text-[#0118D8] hover:shadow-sm ${
                                hoveredItem === index && !collapsed ? 'bg-gray-50/80 shadow-sm' : ''
                              }`}
                        `}
                        title={collapsed ? item.name : undefined}
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
                        {!collapsed && (
                          <span className="ml-3">{item.name}</span>
                        )}
                        {/* Chevron for expandable items */}
                        {!collapsed && hasSubItems && (
                          <HiChevronDown
                            className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            } ${active ? 'text-[#0118D8]' : 'text-gray-400'}`}
                          />
                        )}
                      </div>
                    </button>
                    
                    {/* Sub-items */}
                    {!collapsed && isExpanded && hasSubItems && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.subItems.map((subItem, subIndex) => {
                          const subActive = location.pathname.startsWith(subItem.path);
                          return (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className="relative group flex items-center"
                            >
                              {/* Active indicator for sub-items */}
                              <span
                                className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#0118D8] transition-all duration-300 ${
                                  subActive ? 'opacity-100' : 'opacity-0'
                                }`}
                              />
                              <div
                                className={`
                                  flex items-center rounded-lg w-full min-h-[40px]
                                  px-4 py-2
                                  text-sm font-medium transition-all duration-300
                                  ${subActive
                                    ? 'bg-[#0118D8]/10 text-[#0118D8] shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-[#0118D8] hover:shadow-sm'}
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
                ) : (
                  // Regular navigation item
                  <Link
                    to={item.path}
                    className="relative group flex items-center"
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Active indicator */}
                    <span
                      className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#0118D8] transition-all duration-300 ${
                        active ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <div
                      className={`
                        flex items-center rounded-xl w-full min-h-[48px]
                        px-0 ${collapsed ? 'justify-center' : 'px-4'}
                        py-3
                        text-sm font-medium transition-all duration-300
                        ${active
                          ? 'bg-[#0118D8]/10 text-[#0118D8] shadow-sm'
                          : `text-gray-600 hover:bg-gray-50/80 hover:text-[#0118D8] hover:shadow-sm ${
                              hoveredItem === index && !collapsed ? 'bg-gray-50/80 shadow-sm' : ''
                            }`}
                      `}
                      title={collapsed ? item.name : undefined}
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
                      {!collapsed && (
                        <span className="ml-3">{item.name}</span>
                      )}
                      {/* Chevron for active (desktop, not collapsed) */}
                      {!collapsed && active && (
                        <svg
                          className="w-4 h-4 text-[#0118D8] ml-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      
    </div>
  );
};

export default Sidebar;
