import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import { Amplify } from 'aws-amplify'
// import { withAuthenticator } from '@aws-amplify/ui-react'

import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import CreateShipment from './pages/CreateShipment'
import Tracking from './pages/Tracking'
import Layout from './components/Layout'

// Configure AWS Amplify - Temporarily disabled for development
// Amplify.configure({
//   Auth: {
//     mandatorySignIn: true,
//     region: process.env.VITE_AWS_REGION || 'us-east-1',
//     userPoolId: process.env.VITE_USER_POOL_ID,
//     userPoolWebClientId: process.env.VITE_USER_POOL_CLIENT_ID,
//   },
//   API: {
//     endpoints: [
//       {
//         name: 'shipmentsApi',
//         endpoint: process.env.VITE_API_ENDPOINT || 'https://api.example.com',
//         region: process.env.VITE_AWS_REGION || 'us-east-1',
//       },
//     ],
//   },
// })

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="create-shipment" element={<CreateShipment />} />
            <Route path="tracking" element={<Tracking />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
