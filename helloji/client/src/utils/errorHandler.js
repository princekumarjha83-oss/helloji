class ErrorHandler {
  constructor() {
    this.errors = []
    this.maxErrors = 50
  }

  log(error, context = '', severity = 'error') {
    const errorObj = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message: error.message || error,
      context,
      severity,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    this.errors.unshift(errorObj)
    
    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${severity.toUpperCase()}] ${context}:`, error)
    }

    // In production, you would send this to a logging service
    this.sendToLoggingService(errorObj)
  }

  sendToLoggingService(errorObj) {
    // Mock implementation - in production, send to your logging service
    console.log('Error logged:', errorObj)
  }

  getErrors() {
    return this.errors
  }

  clearErrors() {
    this.errors = []
  }

  getErrorSummary() {
    const summary = {
      total: this.errors.length,
      bySeverity: {},
      byContext: {},
      recent: this.errors.slice(0, 5)
    }

    this.errors.forEach(error => {
      summary.bySeverity[error.severity] = (summary.bySeverity[error.severity] || 0) + 1
      summary.byContext[error.context] = (summary.byContext[error.context] || 0) + 1
    })

    return summary
  }
}

export const errorHandler = new ErrorHandler()

export const handleAsyncError = (asyncFn, context = '') => {
  return async (...args) => {
    try {
      return await asyncFn(...args)
    } catch (error) {
      errorHandler.log(error, context)
      throw error
    }
  }
}

export const createErrorBoundary = (fallbackComponent) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props)
      this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
      errorHandler.log(error, 'React Error Boundary', 'error')
    }

    render() {
      if (this.state.hasError) {
        return fallbackComponent || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
              <p className="text-gray-600 mb-4">An unexpected error occurred. Please refresh the page.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      }

      return this.props.children
    }
  }
}

export default errorHandler
