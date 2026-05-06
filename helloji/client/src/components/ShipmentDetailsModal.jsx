import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Truck, 
  User, 
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Card, CardHeader, CardBody, Button, StatusBadge } from './ui'
import PDFInvoice from './PDFInvoice'
import DeliveryAgentSystem from './DeliveryAgentSystem'

const ShipmentDetailsModal = ({ 
  shipment, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('details')
  const [assigningAgent, setAssigningAgent] = useState(false)

  if (!shipment) return null

  const handleAgentAssign = (agent, shipment) => {
    // Update shipment with assigned agent
    const updatedShipment = {
      ...shipment,
      deliveryAgent: agent,
      updatedAt: new Date().toISOString()
    }
    onUpdateStatus?.(updatedShipment.trackingId, updatedShipment.status, updatedShipment)
    setAssigningAgent(false)
  }

  const tabs = [
    { id: 'details', label: 'Details', icon: Package },
    { id: 'tracking', label: 'Tracking', icon: MapPin },
    { id: 'agent', label: 'Delivery Agent', icon: User }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Tracking ID</p>
                    <p className="font-semibold text-gray-900">{shipment.trackingId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Package className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-semibold text-gray-900">{shipment.weight} kg</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Created Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <StatusBadge status={shipment.status} />
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <p className="font-semibold text-gray-900">{shipment.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {shipment.description && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Description</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{shipment.description}</p>
                </div>
              </div>
            )}

            {/* Cost Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Shipping:</span>
                    <span className="font-medium">$25.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Weight Charge:</span>
                    <span className="font-medium">${(parseFloat(shipment.weight) * 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Priority Handling:</span>
                    <span className="font-medium">$5.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Insurance:</span>
                    <span className="font-medium">$3.00</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-blue-900">Total:</span>
                      <span className="font-bold text-blue-900">
                        ${(35.50 + parseFloat(shipment.weight) * 2).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'tracking':
        return (
          <div className="space-y-6">
            {/* Sender Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Sender Information</h4>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-900">{shipment.senderName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{shipment.senderPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-gray-900">{shipment.senderAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Receiver Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Receiver Information</h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-900">{shipment.receiverName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{shipment.receiverPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-gray-900">{shipment.receiverAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Visualization */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Route Information</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Origin</p>
                      <p className="text-xs text-gray-600">{shipment.senderAddress}</p>
                    </div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-1 bg-gray-300 rounded-full">
                      <div 
                        className="h-1 bg-blue-600 rounded-full transition-all duration-500"
                        style={{
                          width: shipment.status === 'Delivered' ? '100%' :
                                 shipment.status === 'Out for Delivery' ? '75%' :
                                 shipment.status === 'In Transit' ? '50%' : '25%'
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Destination</p>
                      <p className="text-xs text-gray-600">{shipment.receiverAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'agent':
        return (
          <div className="space-y-6">
            {assigningAgent ? (
              <DeliveryAgentSystem
                shipment={shipment}
                onAssignAgent={handleAgentAssign}
              />
            ) : (
              <div>
                {shipment.deliveryAgent ? (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Assigned Delivery Agent</h4>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={shipment.deliveryAgent.avatar}
                          alt={shipment.deliveryAgent.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 text-lg">
                            {shipment.deliveryAgent.name}
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span>{shipment.deliveryAgent.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span>{shipment.deliveryAgent.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Truck className="w-4 h-4 text-gray-500" />
                              <span>{shipment.deliveryAgent.vehicle}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span>{shipment.deliveryAgent.location}</span>
                            </div>
                          </div>
                          <div className="flex space-x-3 mt-4">
                            <Button variant="outline" size="sm">
                              <Phone className="w-4 h-4 mr-1" />
                              Call Agent
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="w-4 h-4 mr-1" />
                              Send Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Delivery Agent Assigned</h4>
                    <p className="text-gray-600 mb-6">Assign a delivery agent to handle this shipment</p>
                    <Button onClick={() => setAssigningAgent(true)}>
                      Assign Delivery Agent
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Shipment Details</h2>
                  <p className="text-blue-100">Tracking ID: {shipment.trackingId}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {renderTabContent()}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <StatusBadge status={shipment.status} />
                  <span className="text-sm text-gray-600">
                    Last updated: {new Date(shipment.updatedAt || shipment.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <PDFInvoice shipment={shipment} />
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ShipmentDetailsModal
