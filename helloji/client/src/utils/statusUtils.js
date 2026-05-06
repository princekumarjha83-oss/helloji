export const statusFlow = {
  'Booked': {
    next: 'In Transit',
    color: 'blue',
    icon: '📋',
    description: 'Shipment has been booked and is ready for pickup'
  },
  'In Transit': {
    next: 'Out for Delivery',
    color: 'yellow',
    icon: '🚚',
    description: 'Shipment is in transit to destination'
  },
  'Out for Delivery': {
    next: 'Delivered',
    color: 'purple',
    icon: '📦',
    description: 'Shipment is out for delivery'
  },
  'Delivered': {
    next: null,
    color: 'green',
    icon: '✅',
    description: 'Shipment has been successfully delivered'
  }
}

export const generateStatusTimestamps = (shipment) => {
  const createdAt = new Date(shipment.createdAt)
  const updatedAt = new Date(shipment.updatedAt || createdAt)
  const timestamps = {}

  // Always have booked timestamp
  timestamps.Booked = {
    timestamp: createdAt.toISOString(),
    completed: true
  }

  // Generate timestamps based on current status
  if (shipment.status?.toLowerCase() === 'in transit') {
    const inTransitTime = new Date(createdAt.getTime() + (24 * 60 * 60 * 1000)) // 1 day after booking
    timestamps['In Transit'] = {
      timestamp: inTransitTime.toISOString(),
      completed: true
    }
  } else if (shipment.status?.toLowerCase() === 'out for delivery') {
    const inTransitTime = new Date(createdAt.getTime() + (24 * 60 * 60 * 1000))
    const outForDeliveryTime = new Date(createdAt.getTime() + (48 * 60 * 60 * 1000)) // 2 days after booking
    
    timestamps['In Transit'] = {
      timestamp: inTransitTime.toISOString(),
      completed: true
    }
    timestamps['Out for Delivery'] = {
      timestamp: outForDeliveryTime.toISOString(),
      completed: true
    }
  } else if (shipment.status?.toLowerCase() === 'delivered') {
    const inTransitTime = new Date(createdAt.getTime() + (24 * 60 * 60 * 1000))
    const outForDeliveryTime = new Date(createdAt.getTime() + (48 * 60 * 60 * 1000))
    const deliveredTime = new Date(createdAt.getTime() + (72 * 60 * 60 * 1000)) // 3 days after booking
    
    timestamps['In Transit'] = {
      timestamp: inTransitTime.toISOString(),
      completed: true
    }
    timestamps['Out for Delivery'] = {
      timestamp: outForDeliveryTime.toISOString(),
      completed: true
    }
    timestamps['Delivered'] = {
      timestamp: deliveredTime.toISOString(),
      completed: true
    }
  }

  return timestamps
}

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Not available'
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getEstimatedDelivery = (shipment) => {
  const createdAt = new Date(shipment.createdAt)
  const baseDeliveryTime = 3 * 24 * 60 * 60 * 1000 // 3 days base delivery time
  
  // Adjust based on current status
  let multiplier = 1
  if (shipment.status?.toLowerCase() === 'in transit') multiplier = 0.5
  if (shipment.status?.toLowerCase() === 'out for delivery') multiplier = 0.1
  
  const estimatedDelivery = new Date(createdAt.getTime() + (baseDeliveryTime * multiplier))
  
  return {
    date: estimatedDelivery,
    formatted: estimatedDelivery.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    timeLeft: getTimeLeft(estimatedDelivery)
  }
}

export const getTimeLeft = (targetDate) => {
  const now = new Date()
  const diff = targetDate - now
  
  if (diff <= 0) return 'Delivered'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`
  return `${minutes} minute${minutes > 1 ? 's' : ''}`
}

export const canUpdateStatus = (currentStatus, newStatus) => {
  const currentFlow = statusFlow[currentStatus]
  if (!currentFlow) return false
  
  // Can always move to the next status
  if (currentFlow.next === newStatus) return true
  
  // Admin can move backwards (for corrections)
  const statusOrder = ['Booked', 'In Transit', 'Out for Delivery', 'Delivered']
  const currentIndex = statusOrder.indexOf(currentStatus)
  const newIndex = statusOrder.indexOf(newStatus)
  
  return newIndex <= currentIndex
}

export const getNextStatus = (currentStatus) => {
  return statusFlow[currentStatus]?.next || null
}

export const getStatusProgress = (status) => {
  const statusOrder = ['Booked', 'In Transit', 'Out for Delivery', 'Delivered']
  const currentIndex = statusOrder.indexOf(status)
  return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0
}

export const enrichShipmentWithTimestamps = (shipment) => {
  return {
    ...shipment,
    timestamps: generateStatusTimestamps(shipment),
    estimatedDelivery: getEstimatedDelivery(shipment),
    statusProgress: getStatusProgress(shipment.status)
  }
}
