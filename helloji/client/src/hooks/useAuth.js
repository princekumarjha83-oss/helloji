import { useState, useEffect, createContext, useContext } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    const userWithRole = {
      ...userData,
      role: userData.email?.includes('admin') ? 'admin' : 'user',
      permissions: userData.email?.includes('admin') 
        ? ['read', 'write', 'delete', 'manage_users', 'view_analytics', 'export_data']
        : ['read', 'write_own']
    }
    
    setUser(userWithRole)
    localStorage.setItem('user', JSON.stringify(userWithRole))
    return userWithRole
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const hasPermission = (permission) => {
    if (!user) return false
    return user.permissions?.includes(permission) || false
  }

  const hasRole = (role) => {
    if (!user) return false
    return user.role === role
  }

  const isAdmin = () => {
    return hasRole('admin')
  }

  const canAccessRoute = (route) => {
    if (!user) return false
    
    const publicRoutes = ['/login', '/tracking']
    const adminRoutes = ['/admin']
    const userRoutes = ['/dashboard', '/create-shipment']
    
    if (publicRoutes.includes(route)) return true
    if (adminRoutes.includes(route)) return isAdmin()
    if (userRoutes.includes(route)) return true
    
    return false
  }

  const canPerformAction = (action, resource = null) => {
    if (!user) return false
    
    // Admin can do everything
    if (isAdmin()) return true
    
    // User-specific permissions
    switch (action) {
      case 'view_shipments':
        return hasPermission('read')
      case 'create_shipment':
        return hasPermission('write_own')
      case 'update_shipment':
        return resource?.userId === user.id || hasPermission('write')
      case 'delete_shipment':
        return hasPermission('delete')
      case 'view_analytics':
        return hasPermission('view_analytics')
      case 'export_data':
        return hasPermission('export_data')
      case 'manage_users':
        return hasPermission('manage_users')
      default:
        return false
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    hasRole,
    isAdmin,
    canAccessRoute,
    canPerformAction,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Higher-order component for route protection
export const withAuth = (WrappedComponent, requiredPermissions = []) => {
  return (props) => {
    const { isAuthenticated, hasPermission, user } = useAuth()

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">Please log in to access this page.</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      )
    }

    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission))
    
    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    }

    return <WrappedComponent {...props} />
  }
}

// Component for conditional rendering based on permissions
export const ProtectedComponent = ({ 
  children, 
  permissions = [], 
  roles = [], 
  fallback = null 
}) => {
  const { hasPermission, hasRole } = useAuth()

  const hasRequiredPermissions = permissions.length === 0 || 
    permissions.every(permission => hasPermission(permission))
  
  const hasRequiredRoles = roles.length === 0 || 
    roles.some(role => hasRole(role))

  if (hasRequiredPermissions && hasRequiredRoles) {
    return children
  }

  return fallback
}

export default AuthProvider
