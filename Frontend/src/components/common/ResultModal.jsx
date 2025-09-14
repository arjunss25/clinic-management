import React from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const ResultModal = ({ 
  isOpen, 
  type, 
  title, 
  message, 
  buttonText, 
  onClose,
  className = ""
}) => {
  if (!isOpen) return null;

  const COLORS = {
    success: '#10B981',
    successLight: '#D1FAE5',
    successDark: '#059669',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    errorDark: '#DC2626',
    text: '#111827',
    textMuted: '#6B7280',
    backdrop: 'rgba(15, 23, 42, 0.75)',
  };

  const getIcon = () => {
    if (type === 'success') {
      return (
        <div className="relative">
          <div className="absolute inset-0 animate-ping w-20 h-20 rounded-full opacity-20" 
               style={{ background: COLORS.success }}></div>
          <div className="relative w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm"
               style={{ 
                 background: `linear-gradient(135deg, ${COLORS.successLight} 0%, rgba(209, 250, 229, 0.6) 100%)`,
                 boxShadow: `0 8px 32px -8px ${COLORS.success}40`
               }}>
            <FaCheckCircle className="w-10 h-10" style={{ color: COLORS.success }} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="relative">
          <div className="absolute inset-0 animate-ping w-20 h-20 rounded-full opacity-20" 
               style={{ background: COLORS.error }}></div>
          <div className="relative w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm"
               style={{ 
                 background: `linear-gradient(135deg, ${COLORS.errorLight} 0%, rgba(254, 226, 226, 0.6) 100%)`,
                 boxShadow: `0 8px 32px -8px ${COLORS.error}40`
               }}>
            <FaExclamationCircle className="w-10 h-10" style={{ color: COLORS.error }} />
          </div>
        </div>
      );
    }
  };

  const getButtonText = () => {
    if (buttonText) return buttonText;
    return type === 'success' ? 'Continue' : 'Try Again';
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn ${className}`}
      style={{ background: COLORS.backdrop }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl transform transition-all duration-300 ease-out flex flex-col animate-slideUp overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          background: 'linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top gradient */}
        <div 
          className="h-1 w-full"
          style={{
            background: type === 'success' 
              ? `linear-gradient(90deg, ${COLORS.success} 0%, ${COLORS.successDark} 100%)`
              : `linear-gradient(90deg, ${COLORS.error} 0%, ${COLORS.errorDark} 100%)`
          }}
        />

        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center min-h-[420px]">
          {/* Icon with animation */}
          <div className="flex justify-center mb-8 animate-bounceIn">
            {getIcon()}
          </div>

          {/* Title */}
          <h3 className="text-3xl font-bold mb-4 tracking-tight" style={{ color: COLORS.text }}>
            {title}
          </h3>

          {/* Message */}
          <p className="text-lg mb-10 leading-relaxed max-w-md opacity-90" style={{ color: COLORS.textMuted }}>
            {message}
          </p>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="relative w-full max-w-xs px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 overflow-hidden group"
            style={{
              background: type === 'success' 
                ? `linear-gradient(135deg, ${COLORS.success} 0%, ${COLORS.successDark} 100%)`
                : `linear-gradient(135deg, ${COLORS.error} 0%, ${COLORS.errorDark} 100%)`,
              color: '#ffffff'
            }}
          >
            <span className="relative z-10">{getButtonText()}</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
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

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ResultModal;