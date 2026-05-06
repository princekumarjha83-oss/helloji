import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Truck, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '../components/ui'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Mock authentication - accept any email/password
    setTimeout(() => {
      if (formData.email && formData.password) {
        // Store mock user data
        localStorage.setItem('user', JSON.stringify({ 
          email: formData.email,
          name: formData.email.split('@')[0]
        }))
        navigate('/dashboard')
      } else {
        setError('Please enter email and password')
      }
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Logo and Brand */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CourierLogix
          </h1>
          <p className="mt-2 text-gray-600">Your trusted logistics partner</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              icon={<Mail className="w-5 h-5 text-gray-400" />}
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                icon={<Lock className="w-5 h-5 text-gray-400" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              className="py-3"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center text-xs text-gray-500"
        >
          © 2024 CourierLogix. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Login
