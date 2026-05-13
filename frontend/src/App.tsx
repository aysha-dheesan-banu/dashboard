import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Callback from './pages/Callback'
import { useState, useEffect } from 'react'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'))

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/callback" element={<Callback />} />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard logout={logout} /> : <Navigate to="/login" />} 
      />
    </Routes>
  )
}

export default App
