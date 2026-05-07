import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Package, 
  CheckCircle, 
  TrendingUp, 
  BarChart3,
  Users,
  DollarSign,
  Truck, 
  Search,
  Filter,
  Download,
  RefreshCw,
  Edit
} from 'lucide-react'
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Button, 
  StatusBadge, 
  Spinner,
  SearchInput 
} from '../components/ui'
import { ShipmentStatusChart, MonthlyShipmentsChart } from '../components/Charts'
import OTPDelivery from '../components/OTPDelivery'
import ActivityLogs from '../components/ActivityLogs'
import { exportShipmentsToCSV, exportShipmentsToPDF, createCustomReport } from '../utils/exportUtils'

const AdminDashboard = () => {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedShipmentForOTP, setSelectedShipmentForOTP] = useState(null)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [showStatusManager, setShowStatusManager] = useState(false)
  const [deliveryStatuses, setDeliveryStatuses] = useState([
    { id: 'booked', name: 'Booked', color: 'blue', received: true },
    { id: 'dispatched', name: 'Dispatched', color: 'yellow', received: true },
    { id: 'out for delivery', name: 'Out for Delivery', color: 'purple', received: true },
    { id: 'delivered', name: 'Delivered', color: 'green', received: true }
  ])

  useEffect(() => {
    fetchAllShipments()
  }, [])

  const fetchAllShipments = () => {
    setTimeout(() => {
      const allShipments = JSON.parse(localStorage.getItem('shipments') || '[]')
      setShipments(allShipments)
      setLoading(false)
    }, 1000)
  }

  const handleStatusUpdate = (shipmentId, newStatus) => {
    const allShipments = JSON.parse(localStorage.getItem('shipments') || '[]')
    const updatedShipments = allShipments.map(shipment => 
      shipment.trackingId === shipmentId 
        ? { ...shipment, status: newStatus, updatedAt: new Date().toISOString() }
        : shipment
    )
    localStorage.setItem('shipments', JSON.stringify(updatedShipments))
    setShipments(updatedShipments)
  }

  // Analytics calculations
  const totalShipments = shipments.length
  const bookedShipments = shipments.filter(s => s.status?.toLowerCase() === 'booked').length
  const inTransitShipments = shipments.filter(s => s.status?.toLowerCase() === 'in transit').length
  const deliveredShipments = shipments.filter(s => s.status?.toLowerCase() === 'delivered').length
  const totalRevenue = shipments.length * 50 // Mock revenue calculation

  const analyticsCards = [
    {
      title: 'Total Shipments',
      value: totalShipments,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Active Shipments',
      value: bookedShipments + inTransitShipments,
      icon: Truck,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Delivered',
      value: deliveredShipments,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      change: '+20%',
      changeType: 'positive'
    }
  ]

  // Filter and sort shipments
  const filteredShipments = shipments
    .filter(shipment => {
      const matchesSearch = 
        shipment.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.senderName?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || 
                           shipment.status?.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue || 0)
        bValue = new Date(bValue || 0)
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const handleOTPConfirm = (shipment) => {
    setSelectedShipmentForOTP(shipment)
    setShowOTPModal(true)
  }

  const handleOTPDeliveryConfirmed = () => {
    if (selectedShipmentForOTP) {
      handleStatusUpdate(selectedShipmentForOTP.trackingId, 'Delivered')
    }
    setShowOTPModal(false)
    setSelectedShipmentForOTP(null)
  }

  const handleOTPCancel = () => {
    setShowOTPModal(false)
    setSelectedShipmentForOTP(null)
  }

  const handleStatusToggle = (statusId) => {
    setDeliveryStatuses(prev => 
      prev.map(status => 
        status.id === statusId 
          ? { ...status, received: !status.received }
          : status
      )
    )
  }

  const handleStatusNameChange = (statusId, newName) => {
    setDeliveryStatuses(prev => 
      prev.map(status => 
        status.id === statusId 
          ? { ...status, name: newName }
          : status
      )
    )
  }

  const handleStatusColorChange = (statusId, newColor) => {
    setDeliveryStatuses(prev => 
      prev.map(status => 
        status.id === statusId 
          ? { ...status, color: newColor }
          : status
      )
    )
  }

  const saveStatusSettings = () => {
    localStorage.setItem('deliveryStatuses', JSON.stringify(deliveryStatuses))
    alert('Delivery status settings saved successfully!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-purple-100 text-lg">
              Manage all shipments and monitor system performance
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="secondary" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
              Refresh
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              icon={<Edit className="w-4 h-4" />}
              onClick={() => setShowStatusManager(true)}
            >
              Manage Status
            </Button>
            <div className="relative group">
              <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
                Export
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => exportShipmentsToCSV(filteredShipments)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => exportShipmentsToPDF(filteredShipments)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as PDF
                </button>
                <div className="border-t border-gray-200"></div>
                <button
                  onClick={() => createCustomReport(filteredShipments, { 
                    status: statusFilter, 
                    search: searchTerm,
                    sortBy: sortBy,
                    sortOrder: sortOrder 
                  })}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg font-medium"
                >
                  Generate Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={card.title} delay={index * 0.1} hover={true}>
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <Icon className={`w-6 h-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} />
                  </div>
                  <span className="text-sm text-green-600 font-medium">
                    {card.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </h3>
                <p className="text-sm text-gray-600">{card.title}</p>
              </CardBody>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Status Distribution</h3>
          </CardHeader>
          <CardBody>
            <ShipmentStatusChart shipments={shipments} />
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
          </CardHeader>
          <CardBody>
            <MonthlyShipmentsChart shipments={shipments} />
          </CardBody>
        </Card>
      </div>

      {/* Shipments Table */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                All Shipments
              </h3>
              <p className="text-sm text-gray-600">
                Manage and track all shipments in the system
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {filteredShipments.length} of {shipments.length} shipments
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardBody className="p-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchInput
                placeholder="Search by tracking ID, sender, or receiver..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="booked">Booked</option>
                <option value="dispatched">Dispatched</option>
                <option value="out for delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field)
                  setSortOrder(order)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="trackingId-asc">Tracking ID (A-Z)</option>
                <option value="trackingId-desc">Tracking ID (Z-A)</option>
              </select>
            </div>
          </div>

          {filteredShipments.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No shipments found matching your criteria' 
                  : 'No shipments found'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('trackingId')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Tracking ID</span>
                        {sortBy === 'trackingId' && (
                          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receiver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Created</span>
                        {sortBy === 'createdAt' && (
                          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredShipments.map((shipment, index) => (
                    <motion.tr
                      key={shipment.trackingId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {shipment.trackingId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {shipment.senderName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {shipment.receiverName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={shipment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(shipment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <StatusUpdateDropdown 
                            shipment={shipment}
                            onUpdate={handleStatusUpdate}
                          />
                          {shipment.status?.toLowerCase() === 'out for delivery' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleOTPConfirm(shipment)}
                            >
                              Confirm Delivery
                            </Button>
                          )}
                          <Link to={`/tracking?id=${shipment.trackingId}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Activity Logs */}
      <ActivityLogs />

      {/* OTP Delivery Modal */}
      {showOTPModal && selectedShipmentForOTP && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <OTPDelivery
              shipment={selectedShipmentForOTP}
              onConfirm={handleOTPDeliveryConfirmed}
              onCancel={handleOTPCancel}
            />
          </motion.div>
        </div>
      )}

      {/* Status Manager Modal */}
      {showStatusManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card>
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Manage Delivery Status Options
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowStatusManager(false)}
                  >
                    ×
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Configure delivery status options and mark which ones are received
                </p>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  {deliveryStatuses.map((status) => (
                    <div key={status.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={status.received}
                            onChange={() => handleStatusToggle(status.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label className="text-sm font-medium text-gray-700">
                            Status Received
                          </label>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}>
                          {status.name}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status Name
                          </label>
                          <input
                            type="text"
                            value={status.name}
                            onChange={(e) => handleStatusNameChange(status.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color
                          </label>
                          <select
                            value={status.color}
                            onChange={(e) => handleStatusColorChange(status.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="yellow">Yellow</option>
                            <option value="orange">Orange</option>
                            <option value="purple">Purple</option>
                            <option value="red">Red</option>
                            <option value="gray">Gray</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowStatusManager(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={saveStatusSettings}
                  >
                    Save Settings
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Status Update Dropdown Component
const StatusUpdateDropdown = ({ shipment, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const statuses = ['Booked', 'Dispatched', 'Out for Delivery', 'Delivered']
  
  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        icon={<Edit className="w-4 h-4" />}
        onClick={() => setIsOpen(!isOpen)}
      >
        Update
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => {
                  onUpdate(shipment.trackingId, status)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  shipment.status === status ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
