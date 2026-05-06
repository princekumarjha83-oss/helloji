import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Truck, Package, Clock } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, StatusBadge } from './ui'

const LiveTrackingMap = ({ shipment, className = '' }) => {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [currentLocation, setCurrentLocation] = useState({
    lat: 40.7128,
    lng: -74.0060
  })
  const [destination, setDestination] = useState({
    lat: 40.7580,
    lng: -73.9855
  })
  const [route, setRoute] = useState([])
  const [estimatedTime, setEstimatedTime] = useState('25 mins')

  useEffect(() => {
    // Simulate map loading
    setTimeout(() => setMapLoaded(true), 1000)
    
    // Generate mock route
    const mockRoute = [
      { lat: 40.7128, lng: -74.0060, name: 'Origin Warehouse' },
      { lat: 40.7260, lng: -73.9897, name: 'Checkpoint 1' },
      { lat: 40.7489, lng: -73.9680, name: 'Checkpoint 2' },
      { lat: 40.7580, lng: -73.9855, name: 'Destination' }
    ]
    setRoute(mockRoute)
  }, [])

  // Simulate real-time location updates
  useEffect(() => {
    if (shipment?.status?.toLowerCase() === 'in transit' || 
        shipment?.status?.toLowerCase() === 'out for delivery') {
      const interval = setInterval(() => {
        setCurrentLocation(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001
        }))
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [shipment?.status])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'in transit': return 'text-yellow-600'
      case 'out for delivery': return 'text-purple-600'
      case 'delivered': return 'text-green-600'
      default: return 'text-blue-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'in transit': return <Truck className="w-4 h-4" />
      case 'out for delivery': return <Package className="w-4 h-4" />
      case 'delivered': return <MapPin className="w-4 h-4" />
      default: return <Navigation className="w-4 h-4" />
    }
  }

  if (!mapLoaded) {
    return (
      <Card className={className}>
        <CardBody className="p-6">
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Live Tracking</h3>
            <p className="text-sm text-gray-600">Real-time shipment location</p>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={shipment?.status} />
            <div className={`flex items-center space-x-1 ${getStatusColor(shipment?.status)}`}>
              {getStatusIcon(shipment?.status)}
              <span className="text-sm font-medium">
                {shipment?.status === 'Delivered' ? 'Arrived' : 'En Route'}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="p-6">
        {/* Map Container */}
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-80 relative overflow-hidden border border-gray-200">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-8 h-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-gray-300"></div>
                ))}
              </div>
            </div>
            
            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.path
                d={`M ${50 + currentLocation.lng * 1000} ${200 - currentLocation.lat * 1000} 
                     Q 200 150, ${150 + destination.lng * 1000} ${100 - destination.lat * 1000}`}
                stroke="#3B82F6"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2 }}
              />
            </svg>
            
            {/* Current Location Marker */}
            <motion.div
              className="absolute w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
              style={{
                left: `${50 + currentLocation.lng * 1000}px`,
                top: `${200 - currentLocation.lat * 1000}px`,
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Truck className="w-4 h-4 text-white" />
            </motion.div>
            
            {/* Destination Marker */}
            <div
              className="absolute w-8 h-8 bg-green-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
              style={{
                left: `${150 + destination.lng * 1000}px`,
                top: `${100 - destination.lat * 1000}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <MapPin className="w-4 h-4 text-white" />
            </div>
            
            {/* Route Checkpoints */}
            {route.map((point, index) => (
              <div
                key={index}
                className="absolute w-3 h-3 bg-gray-400 rounded-full border-2 border-white"
                style={{
                  left: `${50 + point.lng * 1000}px`,
                  top: `${200 - point.lat * 1000}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <Button variant="secondary" size="sm" className="bg-white shadow-md">
              <Navigation className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" className="bg-white shadow-md">
              + Zoom
            </Button>
            <Button variant="secondary" size="sm" className="bg-white shadow-md">
              - Zoom
            </Button>
          </div>
        </div>
        
        {/* Tracking Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Current Location</p>
              <p className="text-xs text-gray-600">
                {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Destination</p>
              <p className="text-xs text-gray-600">
                {shipment?.receiverAddress || 'Delivery Address'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">ETA</p>
              <p className="text-xs text-gray-600">{estimatedTime}</p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1">
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
          <Button variant="outline" className="flex-1">
            <Clock className="w-4 h-4 mr-2" />
            Set Alert
          </Button>
          <Button className="flex-1">
            <Package className="w-4 h-4 mr-2" />
            Contact Driver
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

export default LiveTrackingMap
