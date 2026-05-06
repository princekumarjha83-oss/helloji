import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Search, Package, MapPin, Clock } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Input, StatusBadge, Spinner } from '../components/ui'
import TrackingTimeline from '../components/TrackingTimeline'
import LiveTrackingMap from '../components/LiveTrackingMap'
import PDFInvoice from '../components/PDFInvoice'

const Tracking = () => {
  const [searchParams] = useSearchParams()
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '')
  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (trackingId) {
      handleSearch(new Event('submit'))
    }
  }, [])

  const handleInputChange = (e) => {
    setTrackingId(e.target.value.toUpperCase())
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID')
      return
    }

    setLoading(true)
    setError('')
    setShipment(null)

    try {
      // Mock API call - get from localStorage
      const allShipments = JSON.parse(localStorage.getItem('shipments') || '[]')
      const foundShipment = allShipments.find(s => s.trackingId === trackingId)
      
      // Add mock timestamps if not present
      if (foundShipment) {
        const enrichedShipment = {
          ...foundShipment,
          bookedAt: foundShipment.bookedAt || foundShipment.createdAt,
          dispatchedAt: foundShipment.dispatchedAt || new Date(Date.now() - 86400000).toISOString(),
          inTransitAt: foundShipment.inTransitAt || new Date(Date.now() - 43200000).toISOString(),
          outForDeliveryAt: foundShipment.outForDeliveryAt,
          deliveredAt: foundShipment.deliveredAt,
          estimatedDelivery: foundShipment.estimatedDelivery || '3-5 business days'
        }
        setShipment(enrichedShipment)
        setSearched(true)
      } else {
        setError('Shipment not found. Please check the tracking ID and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Track Your Shipment
        </h1>
        <p className="text-gray-600 text-lg">
          Enter your tracking ID to get real-time shipment status
        </p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardBody className="p-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={trackingId}
                  onChange={handleInputChange}
                  placeholder="Enter tracking ID (e.g., TRK1234567890)"
                  icon={<Search className="w-5 h-5 text-gray-400" />}
                  required
                />
              </div>
              <Button
                type="submit"
                loading={loading}
                size="lg"
                icon={<Package className="w-4 h-4" />}
                className="px-8"
              >
                {loading ? 'Searching...' : 'Track Shipment'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-red-200 bg-red-50">
            <CardBody className="p-6 text-center">
              <Package className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Shipment Not Found
              </h3>
              <p className="text-red-600">
                {error}
              </p>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Shipment Results */}
      {shipment && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Shipment Details Card */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Shipment Details
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Tracking ID: {shipment.trackingId}
                  </p>
                </div>
                <StatusBadge status={shipment.status} />
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sender</label>
                    <p className="text-gray-900 font-medium">{shipment.senderName}</p>
                    <p className="text-sm text-gray-600">{shipment.senderPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sender Address</label>
                    <p className="text-gray-900">{shipment.senderAddress}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Receiver</label>
                    <p className="text-gray-900 font-medium">{shipment.receiverName}</p>
                    <p className="text-sm text-gray-600">{shipment.receiverPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Receiver Address</label>
                    <p className="text-gray-900">{shipment.receiverAddress}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Weight</label>
                    <p className="text-gray-900 font-medium">{shipment.weight} kg</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900 font-medium">{shipment.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Tracking Timeline */}
          <TrackingTimeline shipment={shipment} />

          {/* Live Tracking Map */}
          {(shipment.status?.toLowerCase() === 'in transit' || 
            shipment.status?.toLowerCase() === 'out for delivery') && (
            <LiveTrackingMap shipment={shipment} />
          )}

          {/* Additional Actions */}
          <Card>
            <CardBody className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Last updated: {new Date().toLocaleString()}
                  </span>
                </div>
                <div className="flex space-x-3">
                  <PDFInvoice shipment={shipment} />
                  <Button variant="outline" size="sm">
                    Get Updates
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Spinner size="xl" />
        </div>
      )}
    </div>
  )
}

export default Tracking
