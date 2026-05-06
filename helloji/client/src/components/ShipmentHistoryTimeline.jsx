import React from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Package, 
  CheckCircle, 
  Truck, 
  Clock,
  MapPin,
  ArrowRight
} from 'lucide-react'
import { Card, CardHeader, CardBody, StatusBadge } from './ui'

const ShipmentHistoryTimeline = ({ shipments, className = '' }) => {
  // Sort shipments by creation date (most recent first)
  const sortedShipments = [...shipments].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 10) // Show last 10 shipments

  const getTimelineIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'out for delivery':
        return <Truck className="w-5 h-5 text-purple-600" />
      case 'in transit':
        return <Package className="w-5 h-5 text-yellow-600" />
      default:
        return <Clock className="w-5 h-5 text-blue-600" />
    }
  }

  const getTimelineColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'border-green-200 bg-green-50'
      case 'out for delivery':
        return 'border-purple-200 bg-purple-50'
      case 'in transit':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  if (sortedShipments.length === 0) {
    return (
      <Card className={className}>
        <CardBody className="p-8 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No shipment history available</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Shipment History Timeline
            </h3>
            <p className="text-sm text-gray-600">
              Recent activity and shipment updates
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Last 10 shipments</span>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="p-6">
        <div className="space-y-4">
          {sortedShipments.map((shipment, index) => (
            <motion.div
              key={shipment.trackingId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`relative border-l-4 ${getTimelineColor(shipment.status)} pl-6 pb-6 last:pb-0 last:border-l-0`}
            >
              {/* Timeline Dot */}
              <div className="absolute -left-3 top-0 w-6 h-6 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center">
                {getTimelineIcon(shipment.status)}
              </div>

              {/* Shipment Content */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {shipment.trackingId}
                      </h4>
                      <StatusBadge status={shipment.status} />
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(shipment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Package className="w-4 h-4" />
                        <span>{shipment.weight} kg</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{shipment.senderAddress}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{shipment.receiverAddress}</span>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>
                      {shipment.status === 'Booked' && '0%'}
                      {shipment.status === 'In Transit' && '25%'}
                      {shipment.status === 'Out for Delivery' && '75%'}
                      {shipment.status === 'Delivered' && '100%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        shipment.status === 'Booked' ? 'w-0 bg-blue-600' :
                        shipment.status === 'In Transit' ? 'w-1/4 bg-yellow-600' :
                        shipment.status === 'Out for Delivery' ? 'w-3/4 bg-purple-600' :
                        'w-full bg-green-600'
                      }`}
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    {shipment.receiverName}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        {shipments.length > 10 && (
          <div className="mt-6 text-center">
            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              View all shipments →
            </button>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default ShipmentHistoryTimeline
