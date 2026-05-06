import React from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Truck, 
  MapPin, 
  Home, 
  CheckCircle, 
  Circle,
  Clock
} from 'lucide-react'
import { StatusBadge } from './ui'

const TrackingTimeline = ({ shipment, className = '' }) => {
  const timelineSteps = [
    {
      key: 'booked',
      label: 'Booked',
      description: 'Shipment booked and ready for pickup',
      icon: Package,
      completed: ['booked', 'dispatched', 'in transit', 'out for delivery', 'delivered'].includes(shipment.status?.toLowerCase()),
      timestamp: shipment.bookedAt
    },
    {
      key: 'dispatched',
      label: 'Dispatched',
      description: 'Shipment picked up and dispatched',
      icon: Truck,
      completed: ['dispatched', 'in transit', 'out for delivery', 'delivered'].includes(shipment.status?.toLowerCase()),
      timestamp: shipment.dispatchedAt
    },
    {
      key: 'intransit',
      label: 'In Transit',
      description: 'Shipment is on the way',
      icon: MapPin,
      completed: ['in transit', 'out for delivery', 'delivered'].includes(shipment.status?.toLowerCase()),
      timestamp: shipment.inTransitAt
    },
    {
      key: 'outfordelivery',
      label: 'Out for Delivery',
      description: 'Shipment is out for final delivery',
      icon: Home,
      completed: ['out for delivery', 'delivered'].includes(shipment.status?.toLowerCase()),
      timestamp: shipment.outForDeliveryAt
    },
    {
      key: 'delivered',
      label: 'Delivered',
      description: 'Shipment has been delivered successfully',
      icon: CheckCircle,
      completed: ['delivered'].includes(shipment.status?.toLowerCase()),
      timestamp: shipment.deliveredAt
    }
  ]

  const getCurrentStepIndex = () => {
    const currentStatus = shipment.status?.toLowerCase()
    return timelineSteps.findIndex(step => step.key === currentStatus.replace(/\s+/g, '').toLowerCase())
  }

  const currentStepIndex = getCurrentStepIndex()

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tracking Timeline</h3>
          <StatusBadge status={shipment.status} />
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Package className="w-4 h-4" />
            <span>Tracking ID: {shipment.trackingId}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200">
          <motion.div
            className="w-full bg-gradient-to-b from-blue-600 to-purple-600"
            initial={{ height: 0 }}
            animate={{ height: `${(currentStepIndex + 1) * 25}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        {/* Timeline Steps */}
        <div className="space-y-8">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStepIndex
            const isCompleted = step.completed
            const timestamp = formatTimestamp(step.timestamp)

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-600'
                        : isActive
                        ? 'bg-white border-blue-600'
                        : 'bg-gray-100 border-gray-300'
                    }`}
                    whileHover={isActive ? { scale: 1.1 } : {}}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isCompleted
                          ? 'text-white'
                          : isActive
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                    />
                  </motion.div>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 w-12 h-12 rounded-full border-2 border-blue-600"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-medium ${
                      isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </h4>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center space-x-1 text-xs text-blue-600"
                      >
                        <Clock className="w-3 h-3" />
                        <span>In Progress</span>
                      </motion.div>
                    )}
                  </div>
                  
                  <p className={`text-sm ${
                    isCompleted || isActive ? 'text-gray-700' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                  
                  {timestamp && (
                    <p className="text-xs text-gray-500 mt-1">
                      {timestamp}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Estimated Delivery */}
      {shipment.status?.toLowerCase() !== 'delivered' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center space-x-2 text-blue-800">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              Estimated Delivery: {shipment.estimatedDelivery || '3-5 business days'}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default TrackingTimeline
