import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAutoRefresh } from '../hooks/useAutoRefresh'
import { 
  Package, 
  CheckCircle, 
  Truck, 
  TrendingUp,
  Plus,
  Search,
  Filter,
  RefreshCw
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
import ShipmentHistoryTimeline from '../components/ShipmentHistoryTimeline'

const UserDashboard = () => {
  const [user, setUser] = useState(null)
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchUserData()
    fetchUserShipments()
  }, [])

  const fetchUserData = () => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser({ 
        name: parsedUser.name || parsedUser.email.split('@')[0],
        email: parsedUser.email 
      })
    } else {
      setUser({ name: 'User', email: 'user@example.com' })
    }
  }

  const fetchUserShipments = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allShipments = JSON.parse(localStorage.getItem('shipments') || '[]')
        setShipments(allShipments)
        setLoading(false)
        resolve(allShipments)
      }, 1000)
    })
  }

  const { isRefreshing, lastRefresh, error: refreshError, manualRefresh } = useAutoRefresh(
    fetchUserShipments,
    10000, // Refresh every 10 seconds
    true // Enabled
  )

  // Analytics calculations
  const totalShipments = shipments.length
  const deliveredShipments = shipments.filter(s => s.status?.toLowerCase() === 'delivered').length
  const inTransitShipments = shipments.filter(s => s.status?.toLowerCase() === 'in transit').length
  const deliveryRate = totalShipments > 0 ? Math.round((deliveredShipments / totalShipments) * 100) : 0

  // Filter shipments
  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.receiverName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         shipment.status?.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const analyticsCards = [
    {
      title: 'Total Shipments',
      value: totalShipments,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Delivered',
      value: deliveredShipments,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'In Transit',
      value: inTransitShipments,
      icon: Truck,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'Delivery Rate',
      value: `${deliveryRate}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      change: '+5%',
      changeType: 'positive'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-blue-100">
              Here's what's happening with your shipments today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-blue-100">Total Shipments</p>
              <p className="text-2xl font-bold">{totalShipments}</p>
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

      {/* Recent Shipments */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Shipments
              </h3>
              <p className="text-sm text-gray-600">
                Track and manage your shipments
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>
                  {isRefreshing ? 'Updating...' : `Updated ${lastRefresh ? lastRefresh.toLocaleTimeString() : 'just now'}`}
                </span>
              </div>
              <Link to="/create-shipment">
                <Button size="sm" icon={<Plus className="w-4 h-4" />}>
                  Create Shipment
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        
        <CardBody className="p-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchInput
                placeholder="Search by tracking ID or receiver name..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="booked">Booked</option>
              <option value="in transit">In Transit</option>
              <option value="out for delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {filteredShipments.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No shipments found matching your criteria' 
                  : 'No shipments found'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link to="/create-shipment">
                  <Button>Create your first shipment</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receiver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
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
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {shipment.trackingId}
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
                        <Link to={`/tracking?id=${shipment.trackingId}`}>
                          <Button variant="outline" size="sm">
                            Track
                          </Button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Shipment History Timeline */}
      <ShipmentHistoryTimeline shipments={shipments} />
    </div>
  )
}

export default UserDashboard
