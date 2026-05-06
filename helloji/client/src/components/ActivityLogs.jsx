import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  User, 
  Package, 
  Truck, 
  CheckCircle, 
  Edit,
  Filter,
  RefreshCw
} from 'lucide-react'
import { Card, CardHeader, CardBody, Button, StatusBadge } from './ui'

const ActivityLogs = ({ className = '' }) => {
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchActivityLogs()
  }, [])

  const fetchActivityLogs = () => {
    setLoading(true)
    
    // Mock activity logs
    const mockLogs = [
      {
        id: 1,
        action: 'Shipment Created',
        details: 'TRK1234567890 - John Doe to Jane Smith',
        user: 'Admin User',
        timestamp: new Date(Date.now() - 5 * 60000),
        type: 'create',
        icon: Package,
        color: 'blue'
      },
      {
        id: 2,
        action: 'Status Updated',
        details: 'TRK1234567890 - Booked → In Transit',
        user: 'Admin User',
        timestamp: new Date(Date.now() - 15 * 60000),
        type: 'update',
        icon: Truck,
        color: 'yellow'
      },
      {
        id: 3,
        action: 'Delivery Agent Assigned',
        details: 'TRK1234567890 - Assigned to Raj Kumar',
        user: 'Admin User',
        timestamp: new Date(Date.now() - 30 * 60000),
        type: 'assign',
        icon: User,
        color: 'purple'
      },
      {
        id: 4,
        action: 'Shipment Delivered',
        details: 'TRK9876543210 - Successfully delivered',
        user: 'System',
        timestamp: new Date(Date.now() - 45 * 60000),
        type: 'complete',
        icon: CheckCircle,
        color: 'green'
      },
      {
        id: 5,
        action: 'Status Updated',
        details: 'TRK5555666677 - Out for Delivery → Delivered',
        user: 'Admin User',
        timestamp: new Date(Date.now() - 60 * 60000),
        type: 'update',
        icon: Edit,
        color: 'green'
      },
      {
        id: 6,
        action: 'OTP Verified',
        details: 'TRK5555666677 - Delivery confirmed via OTP',
        user: 'System',
        timestamp: new Date(Date.now() - 75 * 60000),
        type: 'verify',
        icon: CheckCircle,
        color: 'green'
      },
      {
        id: 7,
        action: 'Shipment Created',
        details: 'TRK1111222333 - Alice Johnson to Bob Wilson',
        user: 'Admin User',
        timestamp: new Date(Date.now() - 90 * 60000),
        type: 'create',
        icon: Package,
        color: 'blue'
      },
      {
        id: 8,
        action: 'Status Updated',
        details: 'TRK1111222333 - Booked → In Transit',
        user: 'Admin User',
        timestamp: new Date(Date.now() - 105 * 60000),
        type: 'update',
        icon: Truck,
        color: 'yellow'
      }
    ]
    
    setTimeout(() => {
      setLogs(mockLogs)
      setLoading(false)
    }, 1000)
  }

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true
    return log.type === filter
  })

  const formatTime = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  const getFilterOptions = () => [
    { value: 'all', label: 'All Activities', count: logs.length },
    { value: 'create', label: 'Created', count: logs.filter(l => l.type === 'create').length },
    { value: 'update', label: 'Updated', count: logs.filter(l => l.type === 'update').length },
    { value: 'assign', label: 'Assigned', count: logs.filter(l => l.type === 'assign').length },
    { value: 'complete', label: 'Completed', count: logs.filter(l => l.type === 'complete').length },
    { value: 'verify', label: 'Verified', count: logs.filter(l => l.type === 'verify').length }
  ]

  const getLogIcon = (log) => {
    const Icon = log.icon
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100'
    }
    
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[log.color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Activity Logs</h3>
            <p className="text-sm text-gray-600">Recent system activities and updates</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={fetchActivityLogs}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardBody className="p-6">
        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 mb-6 overflow-x-auto">
          {getFilterOptions().map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === option.value
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 border border-transparent'
              }`}
            >
              {option.label}
              {option.count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
                  {option.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No activities found</p>
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {getLogIcon(log)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {log.action}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatTime(log.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {log.details}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{log.user}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredLogs.length > 0 && !loading && (
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm">
              Load More Activities
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default ActivityLogs
