import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const ThemeToggle = ({ className = '', size = 'md' }) => {
  const { theme, toggleTheme, isDark } = useTheme()
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-r ${
        isDark 
          ? 'from-gray-700 to-gray-900 border-gray-600' 
          : 'from-yellow-200 to-orange-200 border-yellow-300'
      } border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={false}
          animate={{ 
            rotate: isDark ? 180 : 0,
            scale: isDark ? 0 : 1,
            opacity: isDark ? 0 : 1
          }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <Sun className={`${iconSizes[size]} text-yellow-600`} />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{ 
            rotate: isDark ? 0 : -180,
            scale: isDark ? 1 : 0,
            opacity: isDark ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <Moon className={`${iconSizes[size]} text-blue-300`} />
        </motion.div>
      </div>
      
      {/* Animated ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white opacity-0"
        animate={{
          scale: isDark ? [1, 1.2, 1] : [1, 1.2, 1],
          opacity: isDark ? [0, 0.3, 0] : [0, 0.3, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      />
    </motion.button>
  )
}

export default ThemeToggle
