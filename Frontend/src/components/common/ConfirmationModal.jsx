import React from 'react';
import { FaTimes, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const ConfirmationModal = ({ 
  isOpen, 
  type = 'warning', // 'warning', 'danger', 'info', 'success'
  title, 
  message, 
  itemName,
  itemType = 'item',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  className = ""
}) => {
  if (!isOpen) return null;

  const COLORS = {
    warning: {
      primary: '#F59E0B',
      light: '#FEF3C7',
      dark: '#D97706',
      icon: FaExclamationTriangle
    },
    danger: {
      primary: '#EF4444',
      light: '#FEF2F2',
      dark: '#DC2626',
      icon: FaExclamationTriangle
    },
    info: {
      primary: '#3B82F6',
      light: '#EFF6FF',
      dark: '#2563EB',
      icon: FaInfoCircle
    },
    success: {
      primary: '#10B981',
      light: '#D1FAE5',
      dark: '#059669',
      icon: FaCheckCircle
    }
  };

  const currentColor = COLORS[type] || COLORS.warning;
  const IconComponent = currentColor.icon;

  const getButtonStyle = () => {
    if (type === 'danger') {
      return {
        background: `linear-gradient(135deg, ${currentColor.primary}, ${currentColor.dark})`,
        color: '#ffffff',
        border: 'none',
      };
    }
    return {
      background: `linear-gradient(135deg, ${currentColor.primary}, ${currentColor.dark})`,
      color: '#ffffff',
      border: 'none',
    };
  };

  return (
    <div
      className={`fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm animate-fadeIn ${className}`}
      style={{ background: 'rgba(15, 23, 42, 0.4)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out animate-slideUp"
        style={{
          background: '#ffffff',
          border: '1px solid #ECEEF2',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="px-6 py-5 border-b flex items-center justify-between sticky top-0 z-10"
          style={{
            background: '#ffffff',
            borderColor: '#ECEEF2',
          }}
        >
          <div>
            <h3
              className="text-xl font-semibold"
              style={{ color: '#111827' }}
            >
              {title}
            </h3>
            <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
              {type === 'danger' ? 'This action cannot be undone' : 'Please confirm your action'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-105 group"
            style={{
              background: '#ffffff',
              color: '#6B7280',
              border: '1px solid #ECEEF2',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#0F1ED115';
              e.target.style.borderColor = '#0F1ED1';
              e.target.style.color = '#0F1ED1';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#ffffff';
              e.target.style.borderColor = '#ECEEF2';
              e.target.style.color = '#6B7280';
            }}
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
        
        <div className="px-6 py-6 space-y-6">
          {/* Icon and Message */}
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center" 
              style={{ backgroundColor: currentColor.light }}
            >
              <IconComponent className="w-6 h-6" style={{ color: currentColor.primary }} />
            </div>
            <div>
              <h4 className="font-semibold" style={{ color: '#111827' }}>
                {message}
              </h4>
              {itemName && (
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  {type === 'danger' 
                    ? `Are you sure you want to delete this ${itemType}?`
                    : `Do you want to proceed with this ${itemType}?`
                  }
                </p>
              )}
            </div>
          </div>

          {/* Item to be affected */}
          {itemName && (
            <div 
              className="p-4 rounded-lg border" 
              style={{ 
                backgroundColor: type === 'danger' ? '#FEF2F2' : '#F9FAFB', 
                borderColor: type === 'danger' ? '#FECACA' : '#ECEEF2' 
              }}
            >
              <div className="flex items-center gap-2">
                <IconComponent size={16} style={{ color: currentColor.primary }} />
                <span className="font-medium" style={{ color: '#111827' }}>
                  {itemName}
                </span>
              </div>
            </div>
          )}

          <p className="text-sm" style={{ color: '#6B7280' }}>
            {type === 'danger' 
              ? `This action will permanently remove the ${itemType} from your records.`
              : `Please review the details above before confirming.`
            }
          </p>
        </div>
        
        {/* Form Actions */}
        <div
          className="flex flex-col sm:flex-row gap-3 pt-6 border-t px-6 pb-6"
          style={{ borderColor: '#ECEEF2' }}
        >
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: '#ffffff',
              color: '#6B7280',
              border: '2px solid #ECEEF2',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#6B728010';
              e.target.style.borderColor = '#6B7280';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#ffffff';
              e.target.style.borderColor = '#ECEEF2';
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
            style={getButtonStyle()}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow =
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow =
                '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
