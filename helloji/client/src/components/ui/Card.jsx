import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  gradient = false,
  delay = 0 
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-lg overflow-hidden'
  const gradientClasses = gradient ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : ''
  const hoverClasses = hover ? 'hover:shadow-xl transition-shadow duration-300' : ''
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { scale: 1.02 } : {}}
      className={`${baseClasses} ${gradientClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </motion.div>
  )
}

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
)

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
)

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
)

export default Card
