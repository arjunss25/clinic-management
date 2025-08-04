import React, { useState, useEffect } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
              
              <style jsx>{`
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

            <form className='space-y-4 sm:space-y-5'>
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
                className='w-full bg-gradient-to-r from-[#0118D8] to-[#1B56FD] text-white py-2 sm:py-2.5 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base'
              >
                Sign in
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
    </div>
  )
}

export default Login