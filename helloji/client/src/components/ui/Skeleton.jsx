import React from 'react'
import { motion } from 'framer-motion'

const Skeleton = ({ 
  className = '', 
  variant = 'default',
  width,
  height 
}) => {
  const baseClasses = 'bg-gray-200 rounded-lg animate-pulse'
  
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-20',
    card: 'h-32 w-full',
    rectangle: 'h-24 w-full',
    circle: 'rounded-full'
  }
  
  const style = {}
  if (width) style.width = width
  if (height) style.height = height
  
  return (
    <motion.div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={style}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )
}

export const CardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="title" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
    </div>
    <Skeleton variant="rectangle" />
  </div>
)

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <Skeleton variant="title" />
    </div>
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 space-y-2">
          <div className="flex space-x-4">
            <Skeleton variant="text" className="w-1/4" />
            <Skeleton variant="text" className="w-1/3" />
            <Skeleton variant="text" className="w-1/5" />
            <Skeleton variant="button" className="ml-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
    <TableSkeleton rows={5} />
  </div>
)

export default Skeleton
