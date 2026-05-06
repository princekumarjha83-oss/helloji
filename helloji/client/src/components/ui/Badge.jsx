import React from 'react'
import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}) => {
  const baseClasses = 'font-medium rounded-full inline-flex items-center'
  
  const variants = {
    primary: 'bg-blue-100 text-blue-800 border border-blue-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-purple-100 text-purple-800 border border-purple-200',
    gray: 'bg-gray-100 text-gray-800 border border-gray-200'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }
  
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.span>
  )
}

export const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return { variant: 'info', icon: '📦' }
      case 'dispatched':
        return { variant: 'warning', icon: '🚚' }
      case 'in transit':
        return { variant: 'warning', icon: '🚛' }
      case 'out for delivery':
        return { variant: 'info', icon: '🏠' }
      case 'delivered':
        return { variant: 'success', icon: '✓' }
      default:
        return { variant: 'gray', icon: '📋' }
    }
  }
  
  const { variant, icon } = getStatusConfig(status)
  
  return (
    <Badge variant={variant} className="gap-1">
      <span>{icon}</span>
      {status}
    </Badge>
  )
}

export default Badge
