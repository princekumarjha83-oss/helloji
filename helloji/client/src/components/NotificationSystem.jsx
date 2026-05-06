import React, { useState, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  X, 
  CheckCircle, 
  Truck, 
  Package, 
  AlertCircle,
  Info,
  XCircle
} from 'lucide-react'
import { Card, CardBody, Button } from './ui'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    }
    
    setNotifications(prev => [newNotification, ...prev])
    
    // Auto-remove after 10 seconds if not read
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id))
    }, 10000)
  }

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        unreadCount,
        isOpen,
        setIsOpen
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

const NotificationIcon = () => {
  const { unreadCount, setIsOpen } = useNotifications()

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsOpen(true)}
      className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </motion.div>
      )}
    </motion.button>
  )
}

const NotificationPanel = () => {
  const { 
    notifications, 
    isOpen, 
    setIsOpen, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAll,
    unreadCount 
  } = useNotifications()

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />
      case 'info': return <Info className="w-5 h-5 text-blue-600" />
      case 'shipment': return <Package className="w-5 h-5 text-blue-600" />
      case 'delivery': return <Truck className="w-5 h-5 text-purple-600" />
      default: return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
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
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="fixed top-16 right-4 w-96 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-80">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotification(notification.id)
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="w-full"
                >
                  Clear all notifications
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook for easy notification creation
export const useNotificationActions = () => {
  const { addNotification } = useNotifications()

  return {
    notifyShipmentCreated: (trackingId) => {
      addNotification({
        type: 'shipment',
        title: 'Shipment Created',
        message: `Shipment ${trackingId} has been created successfully.`,
      })
    },
    
    notifyShipmentUpdated: (trackingId, status) => {
      addNotification({
        type: 'shipment',
        title: 'Shipment Updated',
        message: `Shipment ${trackingId} status updated to ${status}.`,
      })
    },
    
    notifyDelivery: (trackingId) => {
      addNotification({
        type: 'delivery',
        title: 'Out for Delivery',
        message: `Shipment ${trackingId} is out for delivery.`,
      })
    },
    
    notifyDelivered: (trackingId) => {
      addNotification({
        type: 'success',
        title: 'Delivered Successfully',
        message: `Shipment ${trackingId} has been delivered!`,
      })
    },
    
    notifyError: (message) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message,
      })
    },
    
    notifyInfo: (title, message) => {
      addNotification({
        type: 'info',
        title,
        message,
      })
    }
  }
}

export { NotificationIcon, NotificationPanel }
export default NotificationProvider
