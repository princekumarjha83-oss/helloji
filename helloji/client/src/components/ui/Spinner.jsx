import React from 'react'
import { motion } from 'framer-motion'

const Spinner = ({ 
  size = 'md', 
  color = 'blue',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  
  const colors = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    purple: 'border-purple-600',
    gray: 'border-gray-600'
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-4 border-t-transparent rounded-full ${colors[color]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

export const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="text-center">
      <Spinner size="xl" color="blue" />
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
)

export const CardSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Spinner size="lg" color="blue" />
    <p className="mt-4 text-gray-600 font-medium">{message}</p>
  </div>
)

export default Spinner
