import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, X, RefreshCw, Smartphone } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Input } from './ui'

const OTPDelivery = ({ shipment, onConfirm, onCancel, className = '' }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [generatedOTP, setGeneratedOTP] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

  useEffect(() => {
    generateOTP()
  }, [])

  useEffect(() => {
    if (otpSent && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setError('OTP expired. Please request a new one.')
    }
  }, [otpSent, timeLeft])

  const generateOTP = () => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOTP(newOTP)
    return newOTP
  }

  const sendOTP = async () => {
    setLoading(true)
    setError('')
    
    // Simulate sending OTP
    setTimeout(() => {
      setOtpSent(true)
      setTimeLeft(300)
      setLoading(false)
      // In production, this would send SMS/email
      console.log('OTP sent to recipient:', generatedOTP)
    }, 1500)
  }

  const handleInputChange = (index, value) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const verifyOTP = async () => {
    const enteredOTP = otp.join('')
    
    if (enteredOTP.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }
    
    if (timeLeft === 0) {
      setError('OTP has expired. Please request a new one.')
      return
    }
    
    setLoading(true)
    setError('')
    
    // Simulate verification
    setTimeout(() => {
      if (enteredOTP === generatedOTP) {
        setIsVerified(true)
        setTimeout(() => {
          onConfirm?.()
        }, 1500)
      } else {
        setError('Invalid OTP. Please try again.')
        setOtp(['', '', '', '', '', ''])
        document.getElementById('otp-0')?.focus()
      }
      setLoading(false)
    }, 1000)
  }

  const resendOTP = () => {
    const newOTP = generateOTP()
    setOtp(['', '', '', '', '', ''])
    setError('')
    setIsVerified(false)
    sendOTP()
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (isVerified) {
    return (
      <Card className={className}>
        <CardBody className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Delivery Confirmed!
          </h3>
          <p className="text-gray-600 mb-6">
            Shipment {shipment?.trackingId} has been successfully delivered.
          </p>
          <Button onClick={onCancel} className="px-8">
            Close
          </Button>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              OTP Delivery Confirmation
            </h3>
            <p className="text-sm text-gray-600">
              Verify delivery with 6-digit code sent to recipient
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="p-6">
        {!otpSent ? (
          <div className="text-center">
            <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-6">
              Send a 6-digit OTP to {shipment?.receiverName} at {shipment?.receiverPhone}
            </p>
            <Button
              onClick={sendOTP}
              loading={loading}
              size="lg"
              className="px-8"
            >
              Send OTP
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* OTP Input */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit code sent to the recipient
              </p>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                OTP expires in: <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatTime(timeLeft)}
                </span>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={verifyOTP}
                loading={loading}
                disabled={otp.join('').length !== 6}
                className="flex-1"
              >
                Verify & Confirm Delivery
              </Button>
              <Button
                variant="outline"
                onClick={resendOTP}
                disabled={loading}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Resend OTP
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                icon={<X className="w-4 h-4" />}
              >
                Cancel
              </Button>
            </div>

            {/* Delivery Instructions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Delivery Instructions:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ask the recipient for the 6-digit OTP they received</li>
                <li>• Enter the code in the fields above</li>
                <li>• Click "Verify & Confirm Delivery" to complete</li>
                <li>• The OTP is valid for 5 minutes</li>
              </ul>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default OTPDelivery
