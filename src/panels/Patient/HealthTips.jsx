import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaHeartbeat,
  FaAppleAlt,
  FaDumbbell,
  FaBed,
  FaWater,
  FaMedkit,
  FaBrain,
  FaLeaf,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaClock,
  FaBookmark,
  FaShare,
  FaChevronRight,
} from 'react-icons/fa';
import { FaFire } from 'react-icons/fa6';

const HealthTips = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const cardHover = { y: -4, transition: { duration: 0.2 } };

  // Categories
  const categories = [
    { id: 'all', name: 'All Tips', icon: FaHeartbeat, color: '#0118D8' },
    { id: 'nutrition', name: 'Nutrition', icon: FaAppleAlt, color: '#10B981' },
    { id: 'exercise', name: 'Exercise', icon: FaDumbbell, color: '#F59E0B' },
    { id: 'sleep', name: 'Sleep', icon: FaBed, color: '#8B5CF6' },
    { id: 'hydration', name: 'Hydration', icon: FaWater, color: '#06B6D4' },
    { id: 'mental', name: 'Mental Health', icon: FaBrain, color: '#EF4444' },
    { id: 'wellness', name: 'Wellness', icon: FaLeaf, color: '#84CC16' },
  ];

  // Sample health tips data
  const healthTips = [
    {
      id: 1,
      title: 'Start Your Day with Hydration',
      category: 'hydration',
      excerpt: 'Drinking water first thing in the morning kickstarts your metabolism and helps flush out toxins.',
      content: 'Your body loses water while you sleep through breathing and sweating. Starting your day with a glass of water helps rehydrate your body, kickstart your metabolism, and flush out toxins that have accumulated overnight.',
      tips: [
        'Keep a glass of water by your bedside',
        'Add lemon for extra vitamin C and flavor',
        'Drink before coffee or tea for maximum benefit',
      ],
      readTime: '2 min read',
      date: 'Today',
      featured: true,
      icon: '💧',
    },
    {
      id: 2,
      title: 'The Power of 10-Minute Walks',
      category: 'exercise',
      excerpt: 'Short walks throughout the day can significantly improve your cardiovascular health and mental clarity.',
      content: 'Research shows that even 10-minute walks can boost your mood, improve circulation, and enhance mental clarity. Breaking up sedentary time with brief walks is especially beneficial for desk workers.',
      tips: [
        'Take stairs instead of elevators',
        'Walk during phone calls when possible',
        'Set hourly reminders to move',
      ],
      readTime: '3 min read',
      date: 'Yesterday',
      featured: false,
      icon: '🚶‍♂️',
    },
    {
      id: 3,
      title: 'Optimize Your Sleep Environment',
      category: 'sleep',
      excerpt: 'Creating the perfect sleep environment can dramatically improve your sleep quality and duration.',
      content: 'Your bedroom environment plays a crucial role in sleep quality. The ideal sleep environment is cool (65-68°F), dark, and quiet. Small changes can make a big difference in how well you rest.',
      tips: [
        'Keep room temperature between 65-68°F',
        'Use blackout curtains or eye masks',
        'Remove electronic devices 1 hour before bed',
      ],
      readTime: '4 min read',
      date: '2 days ago',
      featured: true,
      icon: '🛏️',
    },
    {
      id: 4,
      title: 'Mindful Eating for Better Digestion',
      category: 'nutrition',
      excerpt: 'Slow, mindful eating improves digestion and helps you recognize hunger and fullness cues.',
      content: 'Eating mindfully means paying attention to your food, chewing slowly, and listening to your body\'s hunger cues. This practice can improve digestion, reduce overeating, and enhance meal satisfaction.',
      tips: [
        'Chew each bite 20-30 times',
        'Put your fork down between bites',
        'Eliminate distractions during meals',
      ],
      readTime: '3 min read',
      date: '3 days ago',
      featured: false,
      icon: '🍽️',
    },
    {
      id: 5,
      title: '5-Minute Breathing Exercise',
      category: 'mental',
      excerpt: 'Simple breathing techniques can instantly reduce stress and improve mental clarity.',
      content: 'Deep breathing activates your parasympathetic nervous system, reducing stress hormones and promoting relaxation. The 4-7-8 technique is particularly effective for anxiety and sleep.',
      tips: [
        'Inhale for 4 counts through your nose',
        'Hold breath for 7 counts',
        'Exhale for 8 counts through your mouth',
      ],
      readTime: '2 min read',
      date: '4 days ago',
      featured: false,
      icon: '🧘‍♀️',
    },
    {
      id: 6,
      title: 'Power Foods for Energy',
      category: 'nutrition',
      excerpt: 'Natural foods that provide sustained energy without the crash of processed alternatives.',
      content: 'Complex carbohydrates, healthy fats, and lean proteins provide steady energy throughout the day. Avoid refined sugars that cause energy spikes and crashes.',
      tips: [
        'Choose whole grains over refined grains',
        'Include protein with every meal',
        'Snack on nuts and seeds for sustained energy',
      ],
      readTime: '3 min read',
      date: '5 days ago',
      featured: false,
      icon: '⚡',
    },
  ];

  // Filter tips based on category and search
  const filteredTips = healthTips.filter(tip => {
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredTips = healthTips.filter(tip => tip.featured);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-[2rem] md:text-[2.25rem] font-semibold tracking-tight text-gray-900">
              Daily Health Tips
            </h1>
            <p className="text-gray-600">
              Expert-curated wellness insights to help you live your healthiest life
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaFire className="w-4 h-4 text-orange-500" />
            <span className="font-medium">{healthTips.length} tips available</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search health tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E9DFC3]/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0118D8]/20 focus:border-[#0118D8] transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E9DFC3]/70 rounded-lg hover:border-[#0118D8] transition-colors">
            <FaFilter className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Filter</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-3"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                isActive
                  ? 'bg-[#0118D8] text-white border-[#0118D8] shadow-sm'
                  : 'bg-white text-gray-700 border-[#E9DFC3]/70 hover:border-[#0118D8] hover:bg-[#0118D8]/5'
              }`}
            >
              <Icon 
                className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} 
              />
              <span className="text-sm font-medium">{category.name}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Featured Tips */}
      {selectedCategory === 'all' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaFire className="w-5 h-5 text-orange-500" />
            Featured Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredTips.map((tip) => (
              <motion.div
                key={tip.id}
                variants={itemVariants}
                whileHover={cardHover}
                className="bg-gradient-to-br from-[#0118D8]/5 to-[#1B56FD]/5 rounded-xl border border-[#E9DFC3]/70 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0118D8]/10 to-[#1B56FD]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{tip.icon}</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                          {tip.title}
                        </h3>
                        <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-2 py-1 text-xs font-medium flex-shrink-0">
                          Featured
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {tip.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaClock className="w-3 h-3" />
                            {tip.readTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            {tip.date}
                          </span>
                        </div>
                        <button className="text-[#0118D8] text-sm font-medium hover:text-[#1B56FD] transition-colors flex items-center gap-1">
                          Read more
                          <FaChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Tips Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedCategory === 'all' ? 'All Health Tips' : `${categories.find(c => c.id === selectedCategory)?.name} Tips`}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredTips.length} tip{filteredTips.length !== 1 ? 's' : ''} found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip) => (
            <motion.div
              key={tip.id}
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-white rounded-xl p-5 border border-[#E9DFC3]/70 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0118D8]/10 to-[#1B56FD]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{tip.icon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[#0118D8]">
                      <FaBookmark className="w-4 h-4" />
                    </button>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[#0118D8]">
                      <FaShare className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0118D8] transition-colors">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tip.excerpt}
                  </p>
                </div>

                {/* Quick Tips Preview */}
                <div className="bg-gradient-to-br from-[#0118D8]/5 to-[#1B56FD]/5 rounded-lg p-3 border border-[#E9DFC3]/50">
                  <p className="text-xs font-semibold text-[#0118D8] mb-2">Quick Tips:</p>
                  <ul className="space-y-1">
                    {tip.tips.slice(0, 2).map((quickTip, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-1 h-1 rounded-full bg-[#1B56FD]" />
                        {quickTip}
                      </li>
                    ))}
                    {tip.tips.length > 2 && (
                      <li className="text-xs text-[#0118D8] font-medium">
                        +{tip.tips.length - 2} more tips
                      </li>
                    )}
                  </ul>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      {tip.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="w-3 h-3" />
                      {tip.date}
                    </span>
                  </div>
                  <button className="text-[#0118D8] text-xs font-medium hover:text-[#1B56FD] transition-colors flex items-center gap-1">
                    Read full tip
                    <FaChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Load More Button */}
      {filteredTips.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-8"
        >
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#0118D8] border border-[#E9DFC3]/80 rounded-lg hover:border-[#1B56FD] hover:bg-[#0118D8]/5 transition-colors font-medium">
            Load More Tips
            <FaChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HealthTips;
