import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateShipment = () => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    weight: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const generateTrackingId = () => {
    const timestamp = Date.now()
    return `TRK${timestamp}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const shipmentData = {
        ...formData,
        trackingId: generateTrackingId(),
        status: 'Booked',
        weight: parseFloat(formData.weight),
        createdAt: new Date().toISOString()
      }

      // Mock API call - store in localStorage for demo
      const existingShipments = JSON.parse(localStorage.getItem('shipments') || '[]')
      existingShipments.push(shipmentData)
      localStorage.setItem('shipments', JSON.stringify(existingShipments))
      
      setSuccess('Shipment created successfully!')
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      setError(error.message || 'Failed to create shipment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Shipment</h1>
          <p className="mt-2 text-gray-600">Fill in the details to create a new shipment</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sender Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="senderName" className="block text-sm font-medium text-gray-700">
                  Sender Name
                </label>
                <input
                  type="text"
                  id="senderName"
                  name="senderName"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.senderName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="senderPhone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="senderPhone"
                  name="senderPhone"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.senderPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="senderAddress" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="senderAddress"
                name="senderAddress"
                required
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.senderAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Receiver Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700">
                  Receiver Name
                </label>
                <input
                  type="text"
                  id="receiverName"
                  name="receiverName"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.receiverName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="receiverPhone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="receiverPhone"
                  name="receiverPhone"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="receiverAddress" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="receiverAddress"
                name="receiverAddress"
                required
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.receiverAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Package Details</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  required
                  step="0.01"
                  min="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateShipment
