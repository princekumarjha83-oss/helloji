import React, { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Truck, 
  Package, 
  Search, 
  BarChart3, 
  LogOut, 
  Menu,
  X,
  Home,
  Bell
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { NotificationProvider, NotificationIcon, NotificationPanel } from './NotificationSystem'

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Create Shipment', href: '/create-shipment', icon: Package },
    { name: 'Tracking', href: '/tracking', icon: Search },
    { name: 'Admin', href: '/admin', icon: Truck },
  ]

  const isActivePath = (path) => location.pathname === path

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <nav className="bg-white dark:bg-gray-800 shadow-xl border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  <Truck className="w-8 h-8 text-blue-600" />
                  <span>CourierLogix</span>
                </Link>
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActivePath(item.href)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              {/* Theme Toggle */}
              <div className="ml-4">
                <ThemeToggle size="md" />
              </div>
              
              {/* Notifications */}
              <div className="ml-2">
                <NotificationIcon />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 ml-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium ${
                      isActivePath(item.href)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-base font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>
      
      {/* Notification Panel */}
      <NotificationPanel />
    </div>
    </NotificationProvider>
  )
}

export default Layout
