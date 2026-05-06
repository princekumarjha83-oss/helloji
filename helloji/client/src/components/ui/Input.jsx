import React from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Search, Mail, Lock, User, Phone, MapPin, Package } from 'lucide-react'

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  icon = null,
  showPasswordToggle = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  
  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type
  
  const getIcon = () => {
    if (icon) return icon
    switch (type) {
      case 'email': return <Mail className="w-5 h-5 text-gray-400" />
      case 'password': return <Lock className="w-5 h-5 text-gray-400" />
      case 'tel': return <Phone className="w-5 h-5 text-gray-400" />
      case 'search': return <Search className="w-5 h-5 text-gray-400" />
      default: return null
    }
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {getIcon() && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {getIcon()}
          </div>
        )}
        
        <motion.input
          type={inputType}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
            getIcon() ? 'pl-12' : 'pl-4'
          } ${
            showPasswordToggle ? 'pr-12' : 'pr-4'
          } ${
            error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : isFocused
              ? 'border-blue-500 focus:ring-blue-500 focus:border-blue-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export const SearchInput = ({ onSearch, ...props }) => (
  <Input
    type="search"
    placeholder="Search..."
    icon={<Search className="w-5 h-5 text-gray-400" />}
    onChange={(e) => onSearch?.(e.target.value)}
    {...props}
  />
)

export default Input
