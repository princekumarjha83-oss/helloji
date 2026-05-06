import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon = null,
  fullWidth = false 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className} ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon && icon}
      {children}
    </motion.button>
  )
}

export default Button
