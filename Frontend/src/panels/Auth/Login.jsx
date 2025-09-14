import React, { useState, useEffect } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, verifyOtp, selectUser, selectLoginLoading, selectOtpLoading, selectError } from '../../store/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectLoginLoading);
  const isOtpLoading = useAppSelector(selectOtpLoading);
  const error = useAppSelector(selectError);
  
  const [showPassword, setShowPassword] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')

  const slides = [
    {
      title: "Transform Speech into Text Effortlessly",
      description: "Capture patient consultations and medical notes with advanced voice recognition technology"
    },
    {
      title: "Streamline Patient Management",
      description: "Efficiently manage appointments, records, and treatment plans in one place"
    },
    {
      title: "Secure Healthcare Data",
      description: "Keep patient information safe with enterprise-grade security protocols"
    },
    {
      title: "Enhance Patient Care",
      description: "Make informed decisions with comprehensive medical history at your fingertips"
    }
  ];

  // Add the first slide again at the end for seamless loop
  const allSlides = [...slides, slides[0]];

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentSlide === slides.length - 1) {
        // When on last real slide, move to the duplicate slide
        setCurrentSlide(slides.length);
        // After the transition duration, reset to first slide without animation
        setTimeout(() => {
          setIsTransitioning(true);
          setCurrentSlide(0);
          // Re-enable transitions after a brief moment
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 500);
      } else {
        setCurrentSlide(prev => prev + 1);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const getActiveDotIndex = () => {
    return currentSlide >= slides.length ? 0 : currentSlide;
  };

  // Check if user is already authenticated
  useEffect(() => {
    if (user?.isAuthenticated) {
      const roleRoutes = {
        'SuperAdmin': '/superadmin',
        'Clinic': '/clinic',
        'Doctor': '/doctor',
        'Patient': '/patient'
      };
      
      const redirectPath = roleRoutes[user.role] || '/login';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const result = await dispatch(login({ email, password }));
    
    if (login.fulfilled.match(result)) {
      setShowOtpModal(true);
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setOtpError('');

    if (!otp) {
      setOtpError('Please enter the OTP');
      return;
    }

    const result = await dispatch(verifyOtp({ email, otp }));
    
    if (verifyOtp.fulfilled.match(result)) {
      const { role } = result.payload.data;
      const roleRoutes = {
        'SuperAdmin': '/superadmin',
        'Clinic': '/clinic',
        'Doctor': '/doctor',
        'Patient': '/patient'
      };
      
      const redirectPath = roleRoutes[role] || '/login';
      navigate(redirectPath, { replace: true });
    } else if (verifyOtp.rejected.match(result)) {
      setOtpError(result.payload);
    }
  };

  // Close OTP modal
  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp('');
    setOtpError('');
  };

  return (
    <div className='w-full min-h-screen md:h-screen  flex items-center justify-center  p-2 sm:p-4 md:p-6 md:overflow-hidden'>
        <div className='w-full max-w-7xl h-full md:max-h-[calc(100vh-3rem)] grid grid-cols-1 bg-[#FFF8F8] lg:grid-cols-2 bg-white rounded-2xl sm:rounded-3xl  overflow-hidden border-[#E9DFC3] border-1'>
        {/* Left Section - Abstract Design and Text */}
        <div className="left-section flex flex-col bg-gradient-to-br from-[#0118D8] to-[#1B56FD] p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 md:max-h-full md:overflow-hidden relative overflow-hidden">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className='flex-1 flex flex-col justify-between items-center text-white relative z-10'>
            {/* Logo or Brand Name */}
            <div className="text-center mb-4 md:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">MediVoice</h1>
              <p className="text-xs sm:text-sm lg:text-base opacity-90 mt-1">Healthcare Management System</p>
            </div>

            <div className="animation-section">
              <div className="w-72 h-72 mx-auto relative">
                {/* Doctor Profile Card */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform transition-all duration-500 hover:scale-105">
                  {/* Profile Image */}
                  <div className="w-24 h-24 rounded-full bg-[#E9DFC3]/30 mb-4 relative overflow-hidden">
                    <img 
                      src="/portrait-3d-male-doctor.jpg" 
                      alt="Doctor Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Animated Stats */}
                  <div className="w-full space-y-3">
                    {/* Patients Bar */}
                    <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-[#E9DFC3] rounded-full"
                        style={{
                          width: '75%',
                          animation: 'growWidth 2s ease-in-out infinite alternate'
                        }}
                      />
                    </div>
                    
                    {/* Records Bar */}
                    <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-[#E9DFC3] rounded-full"
                        style={{
                          width: '60%',
                          animation: 'growWidth 2s ease-in-out infinite alternate 0.5s'
                        }}
                      />
                    </div>
                    
                    {/* Activity Bar */}
                    <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-[#E9DFC3] rounded-full"
                        style={{
                          width: '85%',
                          animation: 'growWidth 2s ease-in-out infinite alternate 1s'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Floating Icons */}
                  <div className="absolute -right-4 top-4 w-8 h-8 bg-[#E9DFC3]/30 rounded-lg animate-float1" />
                  <div className="absolute -left-4 bottom-4 w-8 h-8 bg-[#E9DFC3]/30 rounded-lg animate-float2" />
                  <div className="absolute right-8 -bottom-4 w-8 h-8 bg-[#E9DFC3]/30 rounded-lg animate-float3" />
                </div>
              </div>
              
              <style>{`
                @keyframes growWidth {
                  from { transform: scaleX(0.5); }
                  to { transform: scaleX(1); }
                }
                
                @keyframes float1 {
                  0%, 100% { transform: translate(0, 0) rotate(0deg); }
                  50% { transform: translate(5px, -5px) rotate(5deg); }
                }
                
                @keyframes float2 {
                  0%, 100% { transform: translate(0, 0) rotate(0deg); }
                  50% { transform: translate(-5px, 5px) rotate(-5deg); }
                }
                
                @keyframes float3 {
                  0%, 100% { transform: translate(0, 0) rotate(0deg); }
                  50% { transform: translate(5px, 5px) rotate(5deg); }
                }
                
                .animate-float1 { animation: float1 3s ease-in-out infinite; }
                .animate-float2 { animation: float2 3.5s ease-in-out infinite; }
                .animate-float3 { animation: float3 4s ease-in-out infinite; }
              `}</style>
            </div>

            

            {/* Carousel Text */}
            <div className="text-section relative w-full max-w-md h-[80px] sm:h-[100px] overflow-hidden mb-4 sm:mb-6">
              <div 
                className={`absolute flex w-full ${isTransitioning ? 'transition-none' : 'transition-transform duration-700 ease-in-out'}`}
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {allSlides.map((slide, index) => (
                  <div key={index} className="min-w-full px-4 text-center">
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-1">{slide.title}</h2>
                    <p className="text-xs sm:text-sm lg:text-base opacity-90 leading-relaxed line-clamp-2">{slide.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 z-20">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      getActiveDotIndex() === index 
                        ? 'bg-[#E9DFC3] w-6' 
                        : 'bg-[#E9DFC3]/40 w-1.5 hover:bg-[#E9DFC3]/60'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className='flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 bg-[#FFF8F8] md:max-h-full md:overflow-auto'>
          <div className='w-full max-w-md space-y-6'>
            <div className='mb-2 sm:mb-4'>
              <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2'>Welcome back</h2>
              <p className='text-sm sm:text-base text-gray-600'>
                Don't have an account?{' '}
                <a href="#" className='text-[#1B56FD] font-medium hover:text-[#0118D8] transition-colors'>
                  Sign up
                </a>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">
                  {typeof error === 'string' ? error : 
                   typeof error === 'object' && error.message ? error.message :
                   typeof error === 'object' && error.non_field_errors ? 
                     (Array.isArray(error.non_field_errors) ? error.non_field_errors.join(', ') : error.non_field_errors) :
                   'An error occurred. Please try again.'}
                </p>
              </div>
            )}
            
            <form onSubmit={handleLogin} className='space-y-4 sm:space-y-5'>
              <div>
                <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1.5'>
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1B56FD] focus:border-transparent outline-none transition-all duration-200 bg-white hover:border-gray-300 text-sm sm:text-base'
                  placeholder='name@company.com'
                />
              </div>

              <div>
                <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-1.5'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1B56FD] focus:border-transparent outline-none transition-all duration-200 bg-white hover:border-gray-300 text-sm sm:text-base'
                    placeholder='••••••••'
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1'
                  >
                    {showPassword ? (
                      <EyeSlashIcon className='w-4 h-4 sm:w-5 sm:h-5' />
                    ) : (
                      <EyeIcon className='w-4 h-4 sm:w-5 sm:h-5' />
                    )}
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <label className='flex items-center'>
                  <input type="checkbox" className='w-4 h-4 text-[#1B56FD] border-gray-300 rounded focus:ring-[#1B56FD]' />
                  <span className='ml-2 text-sm text-gray-600'>Remember me</span>
                </label>
                <a href="#" className='text-sm text-[#1B56FD] hover:text-[#0118D8] font-medium transition-colors'>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-[#0118D8] to-[#1B56FD] text-white py-2 sm:py-2.5 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className='mt-4 sm:mt-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-[#FFF8F8] text-gray-500'>Or continue with</span>
                </div>
              </div>

              <div className='mt-4'>
                <button className='w-full flex items-center justify-center gap-3 py-2 sm:py-2.5 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group'>
                  <FcGoogle className='w-4 h-4 sm:w-5 sm:h-5' />
                  <span className='font-medium text-gray-700 group-hover:text-gray-900 text-sm sm:text-base'>Continue with Google</span>
                </button>
              </div>

              <p className='text-xs text-gray-500 text-center mt-4 sm:mt-6'>
                By signing in, you agree to our{' '}
                <a href="#" className='text-[#1B56FD] hover:text-[#0118D8] font-medium'>
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className='text-[#1B56FD] hover:text-[#0118D8] font-medium'>
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'saturate(140%) blur(8px)',
          }}
          onClick={() => setShowOtpModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: '#ffffff',
              border: '1px solid #ECEEF2',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between"
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
                  Verify OTP
                </h3>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                  We've sent a verification code to <span className="font-medium">{email}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleOtpVerification}
              className="p-6 space-y-6"
            >
              {otpError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">
                    {typeof otpError === 'string' ? otpError : 
                     typeof otpError === 'object' && otpError.message ? otpError.message :
                     typeof otpError === 'object' && otpError.non_field_errors ? 
                       (Array.isArray(otpError.non_field_errors) ? otpError.non_field_errors.join(', ') : otpError.non_field_errors) :
                     'OTP verification failed. Please try again.'}
                  </p>
                </div>
              )}

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: '#111827' }}
                >
                  Enter OTP <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  placeholder="000000"
                  className="w-full px-4 py-3 rounded-lg transition-all text-sm border-2 text-center text-lg font-mono tracking-widest"
                  style={{
                    background: '#ffffff',
                    border: '2px solid #ECEEF2',
                    color: '#111827',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0F1ED1';
                    e.target.style.boxShadow = '0 0 0 4px #0F1ED115';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ECEEF2';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Form Actions */}
              <div
                className="flex flex-col sm:flex-row gap-3 pt-6 border-t"
                style={{ borderColor: '#ECEEF2' }}
              >
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOtpLoading}
                  className="flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #0F1ED1, #1B56FD)',
                    color: '#ffffff',
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isOtpLoading) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow =
                        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow =
                      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  {isOtpLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login