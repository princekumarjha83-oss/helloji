import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Phone, Mail, MapPin, Star, Truck, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, StatusBadge } from './ui'

const DeliveryAgentSystem = ({ shipment, onAssignAgent, className = '' }) => {
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Mock delivery agents data
    const mockAgents = [
      {
        id: 1,
        name: 'Raj Kumar',
        phone: '+91 98765 43210',
        email: 'raj.kumar@courierlogix.com',
        rating: 4.8,
        completedDeliveries: 156,
        activeDeliveries: 3,
        vehicle: 'Honda Activa',
        status: 'available',
        location: 'Downtown Area',
        avatar: 'https://picsum.photos/seed/agent1/100/100.jpg'
      },
      {
        id: 2,
        name: 'Priya Sharma',
        phone: '+91 87654 32109',
        email: 'priya.sharma@courierlogix.com',
        rating: 4.9,
        completedDeliveries: 203,
        activeDeliveries: 2,
        vehicle: 'TVS Jupiter',
        status: 'available',
        location: 'North Zone',
        avatar: 'https://picsum.photos/seed/agent2/100/100.jpg'
      },
      {
        id: 3,
        name: 'Amit Patel',
        phone: '+91 76543 21098',
        email: 'amit.patel@courierlogix.com',
        rating: 4.7,
        completedDeliveries: 142,
        activeDeliveries: 4,
        vehicle: 'Hero Splendor',
        status: 'busy',
        location: 'East Area',
        avatar: 'https://picsum.photos/seed/agent3/100/100.jpg'
      },
      {
        id: 4,
        name: 'Sneha Reddy',
        phone: '+91 65432 10987',
        email: 'sneha.reddy@courierlogix.com',
        rating: 4.9,
        completedDeliveries: 189,
        activeDeliveries: 1,
        vehicle: 'Suzuki Access',
        status: 'available',
        location: 'South Zone',
        avatar: 'https://picsum.photos/seed/agent4/100/100.jpg'
      }
    ]
    setAgents(mockAgents)
  }, [])

  const handleAssignAgent = async () => {
    if (!selectedAgent) return
    
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      onAssignAgent?.(selectedAgent, shipment)
      setLoading(false)
    }, 1500)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100'
      case 'busy': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (shipment?.deliveryAgent) {
    return (
      <Card className={className}>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delivery Agent Assigned</h3>
                <p className="text-sm text-gray-600">Agent details and contact information</p>
              </div>
            </div>
            <StatusBadge status="Assigned" />
          </div>
        </CardHeader>
        
        <CardBody className="p-6">
          <div className="flex items-start space-x-4">
            <img
              src={shipment.deliveryAgent.avatar}
              alt={shipment.deliveryAgent.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {shipment.deliveryAgent.name}
                </h4>
                <div className="flex items-center space-x-1">
                  {renderStars(shipment.deliveryAgent.rating)}
                  <span className="text-sm text-gray-600 ml-1">
                    ({shipment.deliveryAgent.rating})
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{shipment.deliveryAgent.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{shipment.deliveryAgent.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>{shipment.deliveryAgent.vehicle}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{shipment.deliveryAgent.location}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="text-sm">
                  <span className="font-medium text-blue-900">Performance:</span>
                  <span className="text-blue-700 ml-2">
                    {shipment.deliveryAgent.completedDeliveries} deliveries completed
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Assign Delivery Agent</h3>
            <p className="text-sm text-gray-600">Select a delivery agent for this shipment</p>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="p-6">
        <div className="space-y-4">
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              whileHover={{ scale: 1.02 }}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedAgent?.id === agent.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedAgent(agent)}
            >
              <div className="flex items-start space-x-3">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                      <div className="flex items-center space-x-1">
                        {renderStars(agent.rating)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Truck className="w-3 h-3" />
                      <span>{agent.vehicle}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{agent.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>{agent.completedDeliveries} deliveries</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Currently handling {agent.activeDeliveries} active delivery{agent.activeDeliveries > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Selected: {selectedAgent.name}
                </p>
                <p className="text-xs text-gray-600">
                  Rating: {selectedAgent.rating} • {selectedAgent.completedDeliveries} deliveries
                </p>
              </div>
              <Button
                onClick={handleAssignAgent}
                loading={loading}
                disabled={selectedAgent.status === 'busy'}
              >
                Assign Agent
              </Button>
            </div>
          </motion.div>
        )}
      </CardBody>
    </Card>
  )
}

export default DeliveryAgentSystem
